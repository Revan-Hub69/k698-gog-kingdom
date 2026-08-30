'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const LANGS = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
export type KvkLang = typeof LANGS[number];

const LOGIN_T: Record<KvkLang, Record<string, string>> = {
  IT: { login: 'Accedi', logout: 'Esci', email: 'Email', password: 'Password', signing: 'Accesso...', error: 'Credenziali errate' },
  EN: { login: 'Login', logout: 'Logout', email: 'Email', password: 'Password', signing: 'Signing in...', error: 'Invalid credentials' },
  PL: { login: 'Zaloguj', logout: 'Wyloguj', email: 'Email', password: 'Hasło', signing: 'Logowanie...', error: 'Błędne dane' },
  ZH: { login: '登录', logout: '退出', email: '邮箱', password: '密码', signing: '登录中...', error: '凭据无效' },
  DE: { login: 'Anmelden', logout: 'Abmelden', email: 'E-Mail', password: 'Passwort', signing: 'Anmeldung...', error: 'Falsche Anmeldedaten' },
  FR: { login: 'Connexion', logout: 'Déconnexion', email: 'E-mail', password: 'Mot de passe', signing: 'Connexion...', error: 'Identifiants invalides' },
  RU: { login: 'Войти', logout: 'Выйти', email: 'Email', password: 'Пароль', signing: 'Вход...', error: 'Неверные данные' },
  ES: { login: 'Iniciar sesión', logout: 'Cerrar sesión', email: 'Correo', password: 'Contraseña', signing: 'Iniciando...', error: 'Credenciales inválidas' },
};

interface Props {
  lang: KvkLang;
  onLang: (l: KvkLang) => void;
  backHref?: string;
  backLabel?: string;
  onAuthChange?: (token: string | null, nickname: string | null, isAdmin: boolean) => void;
}

export default function KvkHeader({ lang, onLang, backHref, backLabel, onAuthChange }: Props) {
  const [langOpen, setLangOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signing, setSigning] = useState(false);
  const [loginErr, setLoginErr] = useState('');

  const tl = (k: string) => LOGIN_T[lang]?.[k] || LOGIN_T['EN'][k] || k;

  // Read token on mount
  useEffect(() => {
    const tok = localStorage.getItem('token');
    if (tok) {
      try {
        const p = JSON.parse(atob(tok.split('.')[1]));
        setNickname(p.nickname);
        setIsAdmin(p.isAdmin);
        onAuthChange?.(tok, p.nickname, p.isAdmin);
      } catch { localStorage.removeItem('token'); }
    }
  }, []);

  const doLogin = async () => {
    setSigning(true);
    setLoginErr('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setNickname(data.user.nickname);
        setIsAdmin(data.user.isAdmin);
        onAuthChange?.(data.token, data.user.nickname, data.user.isAdmin);
        setShowLogin(false);
        setEmail('');
        setPassword('');
      } else {
        setLoginErr(tl('error'));
      }
    } catch { setLoginErr(tl('error')); }
    setSigning(false);
  };

  const doLogout = () => {
    localStorage.removeItem('token');
    setNickname(null);
    setIsAdmin(false);
    onAuthChange?.(null, null, false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(168,85,247,0.2)',
    color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 9999,
        background: 'linear-gradient(90deg, #020617 0%, #0f172a 50%, #020617 100%)',
        borderBottom: '1px solid rgba(168,85,247,0.2)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 32px rgba(88,28,220,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', gap: 8 }}>

          {/* LEFT: logo + back */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{
                fontWeight: 900, fontSize: 20,
                background: 'linear-gradient(90deg,#c084fc,#60a5fa,#c084fc)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px', lineHeight: 1,
              }}>k698</span>
            </Link>
            {backHref && (
              <>
                <span style={{ color: 'rgba(168,85,247,0.4)', fontWeight: 700 }}>•</span>
                <Link href={backHref} style={{ fontSize: 12, color: 'rgba(168,85,247,0.8)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {backLabel || '←'}
                </Link>
              </>
            )}
          </div>

          {/* RIGHT: user + lang */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Login / user */}
            {nickname ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isAdmin ? '#c084fc' : 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isAdmin && '★ '}{nickname}
                </span>
                <button onClick={doLogout} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {tl('logout')}
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(s => !s)} style={{
                fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 8,
                border: '1px solid rgba(168,85,247,0.4)',
                background: showLogin ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(124,58,237,0.12)',
                color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{tl('login')}</button>
            )}

            {/* Lang dropdown */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(o => !o)} style={{
                width: 42, height: 38, borderRadius: 8,
                border: '1px solid rgba(168,85,247,0.4)',
                background: 'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(37,99,235,0.1))',
                color: '#fff', fontWeight: 700, fontSize: 11,
                cursor: 'pointer',
              }}>{lang}</button>
              {langOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  background: 'linear-gradient(180deg,rgba(15,23,42,0.98),rgba(9,9,10,0.98))',
                  border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10,
                  overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 100, minWidth: 80,
                }}>
                  {LANGS.map((l, i) => (
                    <button key={l} onClick={() => { onLang(l); setLangOpen(false); }} style={{
                      display: 'block', width: '100%', padding: '9px 14px',
                      textAlign: 'center', fontSize: 12, fontWeight: 600,
                      background: lang === l ? 'rgba(124,58,237,0.25)' : 'transparent',
                      color: lang === l ? '#fff' : 'rgba(203,213,225,0.7)',
                      border: 'none', borderTop: i > 0 ? '1px solid rgba(168,85,247,0.07)' : 'none',
                      cursor: 'pointer',
                    }}>{l}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LOGIN FORM — inline under header */}
        {showLogin && !nickname && (
          <div style={{
            borderTop: '1px solid rgba(168,85,247,0.15)',
            padding: '14px 16px 16px',
            background: 'rgba(9,9,10,0.95)',
          }}>
            <div style={{ maxWidth: 360, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                style={inputStyle} type="email" placeholder={tl('email')}
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doLogin()}
              />
              <input
                style={inputStyle} type="password" placeholder={tl('password')}
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doLogin()}
              />
              {loginErr && <div style={{ fontSize: 12, color: '#f87171' }}>{loginErr}</div>}
              <button
                onClick={doLogin} disabled={signing}
                style={{ padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff' }}
              >{signing ? tl('signing') : tl('login')}</button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
