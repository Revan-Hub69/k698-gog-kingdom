'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const LANGS = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
export type KvkLang = typeof LANGS[number];

const LOGIN_T: Record<KvkLang, Record<string, string>> = {
  IT: { login: 'Accedi', logout: 'Esci', email: 'Email', password: 'Password', signing: 'Accesso...', error: 'Credenziali errate', title: 'Accedi a k698', forgot: 'Password dimenticata?', forgotTitle: 'Reimposta password', forgotDesc: 'Inserisci la tua email per ricevere il link di reset.', send: 'Invia link', sending: 'Invio...', sent: 'Email inviata! Controlla la casella.', back: '← Torna al login', cancel: 'Annulla' },
  EN: { login: 'Login', logout: 'Logout', email: 'Email', password: 'Password', signing: 'Signing in...', error: 'Invalid credentials', title: 'Sign in to k698', forgot: 'Forgot password?', forgotTitle: 'Reset password', forgotDesc: 'Enter your email to receive a reset link.', send: 'Send link', sending: 'Sending...', sent: 'Email sent! Check your inbox.', back: '← Back to login', cancel: 'Cancel' },
  PL: { login: 'Zaloguj', logout: 'Wyloguj', email: 'Email', password: 'Hasło', signing: 'Logowanie...', error: 'Błędne dane', title: 'Zaloguj się', forgot: 'Zapomniałeś hasła?', forgotTitle: 'Resetuj hasło', forgotDesc: 'Podaj email aby otrzymać link.', send: 'Wyślij link', sending: 'Wysyłanie...', sent: 'Wysłano! Sprawdź skrzynkę.', back: '← Wróć', cancel: 'Anuluj' },
  ZH: { login: '登录', logout: '退出', email: '邮箱', password: '密码', signing: '登录中...', error: '凭据无效', title: '登录 k698', forgot: '忘记密码？', forgotTitle: '重置密码', forgotDesc: '输入邮箱以接收重置链接。', send: '发送链接', sending: '发送中...', sent: '已发送！请查看邮箱。', back: '← 返回登录', cancel: '取消' },
  DE: { login: 'Anmelden', logout: 'Abmelden', email: 'E-Mail', password: 'Passwort', signing: 'Anmeldung...', error: 'Falsche Anmeldedaten', title: 'Anmelden', forgot: 'Passwort vergessen?', forgotTitle: 'Passwort zurücksetzen', forgotDesc: 'E-Mail eingeben für Reset-Link.', send: 'Link senden', sending: 'Senden...', sent: 'Gesendet! Prüfe dein Postfach.', back: '← Zurück', cancel: 'Abbrechen' },
  FR: { login: 'Connexion', logout: 'Déconnexion', email: 'E-mail', password: 'Mot de passe', signing: 'Connexion...', error: 'Identifiants invalides', title: 'Connexion à k698', forgot: 'Mot de passe oublié?', forgotTitle: 'Réinitialiser', forgotDesc: 'Entrez votre email pour recevoir le lien.', send: 'Envoyer le lien', sending: 'Envoi...', sent: 'Envoyé! Vérifiez votre boîte.', back: '← Retour', cancel: 'Annuler' },
  RU: { login: 'Войти', logout: 'Выйти', email: 'Email', password: 'Пароль', signing: 'Вход...', error: 'Неверные данные', title: 'Войти в k698', forgot: 'Забыли пароль?', forgotTitle: 'Сброс пароля', forgotDesc: 'Введите email для получения ссылки.', send: 'Отправить ссылку', sending: 'Отправка...', sent: 'Отправлено! Проверьте почту.', back: '← Назад', cancel: 'Отмена' },
  ES: { login: 'Iniciar sesión', logout: 'Cerrar sesión', email: 'Correo', password: 'Contraseña', signing: 'Iniciando...', error: 'Credenciales inválidas', title: 'Iniciar sesión', forgot: '¿Olvidaste tu contraseña?', forgotTitle: 'Restablecer contraseña', forgotDesc: 'Ingresa tu email para recibir el enlace.', send: 'Enviar enlace', sending: 'Enviando...', sent: '¡Enviado! Revisa tu bandeja.', back: '← Volver', cancel: 'Cancelar' },
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
  const [showPw, setShowPw] = useState(false);
  const [signing, setSigning] = useState(false);
  const [loginErr, setLoginErr] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSending, setForgotSending] = useState(false);

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

  const doForgot = async () => {
    if (!forgotEmail.trim()) return;
    setForgotSending(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
    } catch {}
    setForgotSent(true);
    setForgotSending(false);
  };

  const closeModal = () => {
    setShowLogin(false);
    setForgotMode(false);
    setForgotSent(false);
    setForgotEmail('');
    setLoginErr('');
    setEmail('');
    setPassword('');
    setShowPw(false);
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
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 400, background: 'linear-gradient(180deg,#111113 0%,#0d0d10 100%)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 20, padding: '32px 24px', boxShadow: '0 24px 80px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Logo */}
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 12 }}>k</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{forgotMode ? tl('forgotTitle') : tl('title')}</div>
              {forgotMode && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{tl('forgotDesc')}</div>}
            </div>

            {forgotMode ? (
              /* ── FORGOT MODE ── */
              forgotSent ? (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>✉️</div>
                  <div style={{ fontSize: 14, color: '#4ade80', fontWeight: 600 }}>{tl('sent')}</div>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder={tl('email')}
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && doForgot()}
                    autoFocus
                    style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
                  />
                  <button onClick={doForgot} disabled={forgotSending} style={{ padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 15, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', opacity: forgotSending ? 0.7 : 1, width: '100%' }}>
                    {forgotSending ? tl('sending') : tl('send')}
                  </button>
                </>
              )
            ) : (
              /* ── LOGIN MODE ── */
              <>
                <input
                  type="email"
                  placeholder={tl('email')}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doLogin()}
                  autoFocus
                  style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
                />

                {/* Password with eye toggle */}
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder={tl('password')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && doLogin()}
                    style={{ padding: '14px 48px 14px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box' as const }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {showPw ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>

                {loginErr && (
                  <div style={{ fontSize: 13, color: '#f87171', textAlign: 'center', background: 'rgba(248,113,113,0.08)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)' }}>{loginErr}</div>
                )}

                <button
                  onClick={doLogin}
                  disabled={signing}
                  style={{ padding: '14px', borderRadius: 12, border: 'none', cursor: signing ? 'wait' : 'pointer', fontWeight: 800, fontSize: 15, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', opacity: signing ? 0.7 : 1, width: '100%' }}
                >{signing ? tl('signing') : tl('login')}</button>

                {/* Forgot password */}
                <button
                  onClick={() => { setForgotMode(true); setLoginErr(''); setForgotEmail(email); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(168,85,247,0.8)', fontSize: 13, cursor: 'pointer', textAlign: 'center', textDecoration: 'underline', padding: 0 }}
                >{tl('forgot')}</button>
              </>
            )}

            {/* Back / Close */}
            <button
              onClick={forgotMode ? () => { setForgotMode(false); setForgotSent(false); } : closeModal}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 12, cursor: 'pointer', textAlign: 'center' }}
            >{forgotMode ? tl('back') : `✕ ${tl('cancel')}`}</button>
          </div>
        </div>
      )}
    </>
  );
}
