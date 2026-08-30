'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const LANGS = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
export type KvkLang = typeof LANGS[number];

const LOGIN_T: Record<KvkLang, Record<string, string>> = {
  IT: { login: 'Accedi', logout: 'Esci', email: 'Email', password: 'Password', signing: 'Accesso...', error: 'Credenziali errate', title: 'Accedi a k698' },
  EN: { login: 'Login', logout: 'Logout', email: 'Email', password: 'Password', signing: 'Signing in...', error: 'Invalid credentials', title: 'Sign in to k698' },
  PL: { login: 'Zaloguj', logout: 'Wyloguj', email: 'Email', password: 'Hasło', signing: 'Logowanie...', error: 'Błędne dane', title: 'Zaloguj się' },
  ZH: { login: '登录', logout: '退出', email: '邮箱', password: '密码', signing: '登录中...', error: '凭据无效', title: '登录 k698' },
  DE: { login: 'Anmelden', logout: 'Abmelden', email: 'E-Mail', password: 'Passwort', signing: 'Anmeldung...', error: 'Falsche Anmeldedaten', title: 'Anmelden' },
  FR: { login: 'Connexion', logout: 'Déconnexion', email: 'E-mail', password: 'Mot de passe', signing: 'Connexion...', error: 'Identifiants invalides', title: 'Connexion à k698' },
  RU: { login: 'Войти', logout: 'Выйти', email: 'Email', password: 'Пароль', signing: 'Вход...', error: 'Неверные данные', title: 'Войти в k698' },
  ES: { login: 'Iniciar sesión', logout: 'Cerrar sesión', email: 'Correo', password: 'Contraseña', signing: 'Iniciando...', error: 'Credenciales inválidas', title: 'Iniciar sesión' },
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
        setLoginErr('');
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

  return (
    <>
      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 9999,
        background: 'linear-gradient(90deg,#020617 0%,#0f172a 50%,#020617 100%)',
        borderBottom: '1px solid rgba(168,85,247,0.2)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 2px 32px rgba(88,28,220,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', gap: 8 }}>

          {/* LEFT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontWeight: 900, fontSize: 20, background: 'linear-gradient(90deg,#c084fc,#60a5fa,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px', lineHeight: 1 }}>k698</span>
            </Link>
            {backHref && (
              <>
                <span style={{ color: 'rgba(168,85,247,0.4)', fontWeight: 700 }}>•</span>
                <Link href={backHref} style={{ fontSize: 12, color: 'rgba(168,85,247,0.8)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>{backLabel || '←'}</Link>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {nickname ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isAdmin ? '#c084fc' : 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isAdmin ? '★ ' : ''}{nickname}
                </span>
                <button onClick={doLogout} style={{ fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {tl('logout')}
                </button>
              </div>
            ) : (
              <button onClick={() => { setShowLogin(true); setLoginErr(''); }} style={{ fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 9, border: '1px solid rgba(168,85,247,0.5)', background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(37,99,235,0.2))', color: '#c084fc', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {tl('login')}
              </button>
            )}

            {/* Lang */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setLangOpen(o => !o)} style={{ width: 42, height: 38, borderRadius: 8, border: '1px solid rgba(168,85,247,0.4)', background: 'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(37,99,235,0.1))', color: '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>{lang}</button>
              {langOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: 'linear-gradient(180deg,rgba(15,23,42,0.98),rgba(9,9,10,0.98))', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 100, minWidth: 80 }}>
                  {LANGS.map((l, i) => (
                    <button key={l} onClick={() => { onLang(l); setLangOpen(false); }} style={{ display: 'block', width: '100%', padding: '9px 14px', textAlign: 'center', fontSize: 12, fontWeight: 600, background: lang === l ? 'rgba(124,58,237,0.25)' : 'transparent', color: lang === l ? '#fff' : 'rgba(203,213,225,0.7)', border: 'none', borderTop: i > 0 ? '1px solid rgba(168,85,247,0.07)' : 'none', cursor: 'pointer' }}>{l}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── LOGIN MODAL ── */}
      {showLogin && !nickname && (
        <div
          onClick={() => setShowLogin(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 400, background: 'linear-gradient(180deg,#111113 0%,#0d0d10 100%)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: '32px 24px', boxShadow: '0 24px 80px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 12 }}>k</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{tl('title')}</div>
            </div>

            {/* Fields */}
            <input
              type="email"
              placeholder={tl('email')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doLogin()}
              autoFocus
              style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
            />
            <input
              type="password"
              placeholder={tl('password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doLogin()}
              style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
            />

            {loginErr && (
              <div style={{ fontSize: 13, color: '#f87171', textAlign: 'center', background: 'rgba(248,113,113,0.08)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)' }}>{loginErr}</div>
            )}

            {/* Button */}
            <button
              onClick={doLogin}
              disabled={signing}
              style={{ padding: '14px', borderRadius: 12, border: 'none', cursor: signing ? 'wait' : 'pointer', fontWeight: 800, fontSize: 15, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', opacity: signing ? 0.7 : 1, width: '100%' }}
            >{signing ? tl('signing') : tl('login')}</button>

            {/* Close */}
            <button onClick={() => setShowLogin(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 12, cursor: 'pointer', textAlign: 'center' }}>✕ Annulla</button>
          </div>
        </div>
      )}
    </>
  );
}
