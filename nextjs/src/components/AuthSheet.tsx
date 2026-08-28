'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Screen = 'login' | 'register' | 'forgot' | 'account';
type Status = 'idle' | 'loading' | 'success';

interface AuthSheetProps {
  isOpen: boolean;
  screen: Screen;
  onOpen: () => void;
  onClose: () => void;
  onScreenChange: (screen: Screen) => void;
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  t: (key: string) => string;
}

// ── outside component so references never change ──────────────────
const Eye = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    {open ? (
      <><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    )}
  </svg>
);

const SpinnerIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
    style={{ animation: 'spin 0.75s linear infinite' }}>
    <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
    <path d="M6.5 1.5A5 5 0 0111.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const C = {
  bgSheet:   '#09090a',
  bgContent: '#111113',
  border:    '#212224',
  borderHov: '#2e3035',
  label:     '#6b6f76',
  text:      '#e2e3e5',
  white:     '#ffffff',
  purple:    '#7c3aed',
};

const SCREEN_ORDER: Record<Screen, number> = { login: 0, register: 1, forgot: 2, account: 3 };

export default function AuthSheet({
  isOpen, screen, onOpen, onClose, onScreenChange, isLoggedIn, onLoginSuccess, onLogout, t,
}: AuthSheetProps) {
  const [status, setStatus]   = useState<Status>('idle');
  const [error, setError]     = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const prevScreen            = useRef<Screen>(screen);
  const [dir, setDir]         = useState(1);

  useEffect(() => {
    setDir(SCREEN_ORDER[screen] >= SCREEN_ORDER[prevScreen.current] ? 1 : -1);
    prevScreen.current = screen;
  }, [screen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ authSheet: true }, '');
    const pop = () => onClose();
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, [isOpen, onClose]);

  useEffect(() => {
    setError(''); setStatus('idle'); setShowPw(false); setShowCpw(false);
  }, [screen]);

  const success = (cb: () => void) => {
    setStatus('success');
    setTimeout(() => {
      cb();
      onScreenChange('account'); // stay open, go to account
    }, 650);
  };

  // shared input style — pure CSS, no state dependency that causes remount
  const inp: React.CSSProperties = {
    width: '100%', height: 32, padding: '0 10px', borderRadius: 6,
    fontSize: 13, fontWeight: 500, color: C.white,
    background: '#1c1c1e', border: `1px solid ${C.border}`,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.12s, box-shadow 0.12s',
  };

  const inpFocusCss = `
    .auth-inp:focus { border-color: ${C.purple} !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.16) !important; }
    .auth-inp:hover:not(:focus) { border-color: ${C.borderHov} !important; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  const screenV = {
    initial: (d: number) => ({ opacity: 0, x: d * 20, filter: 'blur(3px)' }),
    animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.16, ease: [0.25, 0.1, 0.25, 1] as const } },
    exit:    (d: number) => ({ opacity: 0, x: d * -20, filter: 'blur(3px)', transition: { duration: 0.1 } }),
  };

  const btnStyle: React.CSSProperties = {
    width: '100%', height: 32, marginTop: 8, borderRadius: 6,
    fontSize: 13, fontWeight: 500, border: 'none', color: C.white,
    background: status === 'success' ? '#16a34a' : `linear-gradient(135deg, ${C.purple}, #2563eb)`,
    cursor: status !== 'idle' ? 'default' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    transition: 'background 0.2s',
    opacity: status === 'loading' ? 0.8 : 1,
  };

  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 500, color: C.label, display: 'block', marginBottom: 6 };
  const rowStyle:   React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 };
  const fieldGap:   React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 14 };
  const relPos:     React.CSSProperties = { position: 'relative' };
  const eyeBtn:     React.CSSProperties = { position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: C.label, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 };

  const screenTitle: Record<Screen, string> = {
    login: t('signIn'), register: t('signUp'), forgot: t('resetPassword'), account: t('myAccount'),
  };

  return (
    <>
      <style>{inpFocusCss}</style>

      {/* ── PERSISTENT TAB ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div key="tab"
            initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, display: 'flex', justifyContent: 'center' }}
          >
            <button type="button"
              onClick={() => { onScreenChange(isLoggedIn ? 'account' : 'login'); onOpen(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px 14px',
                background: C.bgSheet, border: `1px solid ${C.border}`, borderBottom: 'none',
                borderRadius: '10px 10px 0 0', cursor: 'pointer', color: C.text,
                fontSize: 13, fontWeight: 500, boxShadow: '0 -4px 20px rgba(0,0,0,0.5)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHov)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              {isLoggedIn ? t('openAccount') : `${t('signIn')} / ${t('signUp')}`}
              <svg width="10" height="10" fill="none" stroke={C.label} strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHEET ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div key="bd" className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }} onClick={onClose}
            />

            <motion.div key="sheet" className="fixed bottom-0 left-0 right-0 z-50"
              style={{ height: 'min(88vh, 680px)' }}
              initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 340, mass: 0.8 }}
            >
              <div className="h-full flex flex-col overflow-hidden" style={{
                background: C.bgSheet, borderTop: `1px solid ${C.border}`,
                borderRadius: '16px 16px 0 0',
                boxShadow: '0 -8px 48px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.04)',
              }}>
                {/* HEADER */}
                <div style={{ flexShrink: 0, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
                    <div style={{ width: 32, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.12)' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px 10px', gap: 8 }}>
                    {/* back */}
                    <div style={{ width: 32, flexShrink: 0 }}>
                      {screen === 'forgot' && (
                        <button type="button" onClick={() => onScreenChange('login')}
                          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: C.text, background: 'none', border: 'none', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {/* tabs / title */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                      {(screen === 'login' || screen === 'register') ? (
                        <div style={{ display: 'inline-flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
                          {(['login', 'register'] as Screen[]).map(s => (
                            <button key={s} type="button" onClick={() => onScreenChange(s)}
                              style={{ position: 'relative', padding: '0 16px', height: 28, borderRadius: 5, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'transparent', color: screen === s ? C.white : C.label, transition: 'color 0.15s', zIndex: 1 }}>
                              {screen === s && (
                                <motion.span layoutId="pill"
                                  style={{ position: 'absolute', inset: 0, borderRadius: 5, background: 'rgba(255,255,255,0.09)', zIndex: -1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                              )}
                              {s === 'login' ? t('signIn') : t('signUp')}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{screenTitle[screen]}</span>
                      )}
                    </div>
                    {/* close */}
                    <button type="button" onClick={onClose}
                      style={{ width: 32, height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: C.label, background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = C.white; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.label; }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto no-scrollbar" style={{ background: C.bgContent }}>
                  <div style={{ maxWidth: 400, margin: '0 auto', padding: '28px 24px 40px' }}>

                    <AnimatePresence>
                      {error && (
                        <motion.div key={`err-${error}`}
                          initial={{ opacity: 0, x: 0 }}
                          animate={{ opacity: 1, x: [0, -6, 6, -4, 4, -2, 2, 0] }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          style={{ marginBottom: 16, padding: '10px 12px', borderRadius: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13 }}
                        >{error}</motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait" initial={false} custom={dir}>

                      {/* ── LOGIN ── */}
                      {screen === 'login' && (
                        <motion.form key="login" custom={dir} variants={screenV} initial="initial" animate="animate" exit="exit"
                          onSubmit={async e => {
                            e.preventDefault();
                            const fd = new FormData(e.currentTarget);
                            setStatus('loading'); setError('');
                            try {
                              const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: fd.get('email'), password: fd.get('password') }) });
                              const data = await res.json();
                              if (!res.ok) { setError(data.error || t('loginFailed')); setStatus('idle'); return; }
                              localStorage.setItem('auth_token', data.token);
                              localStorage.setItem('user', JSON.stringify(data.user));
                              success(onLoginSuccess);
                            } catch { setError(t('connectionError')); setStatus('idle'); }
                          }}
                          style={fieldGap}
                        >
                          <div>
                            <label style={labelStyle}>{t('emailLabel')}</label>
                            <input className="auth-inp" id="login-email" type="email" name="email" placeholder="you@example.com" autoComplete="email" required style={inp} />
                          </div>
                          <div>
                            <div style={rowStyle}>
                              <label style={{ ...labelStyle, marginBottom: 0 }}>{t('passwordLabel')}</label>
                              <button type="button" onClick={() => onScreenChange('forgot')} style={{ fontSize: 12, color: C.purple, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                                {t('forgotPassword')}
                              </button>
                            </div>
                            <div style={{ ...relPos, marginTop: 6 }}>
                              <input className="auth-inp" id="login-password" type={showPw ? 'text' : 'password'} name="password" placeholder="••••••••" autoComplete="current-password" required style={{ ...inp, paddingRight: 32 }} />
                              <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)} style={eyeBtn}><Eye open={showPw} /></button>
                            </div>
                          </div>
                          <button type="submit" disabled={status !== 'idle'} style={btnStyle}>
                            <AnimatePresence mode="wait" initial={false}>
                              {status === 'loading' && <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><SpinnerIcon />{t('signingIn')}</motion.span>}
                              {status === 'success' && <motion.span key="s" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>&#10003; {t('doneLabel')}</motion.span>}
                              {status === 'idle' && <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{t('signIn')}</motion.span>}
                            </AnimatePresence>
                          </button>
                        </motion.form>
                      )}

                      {/* ── REGISTER ── */}
                      {screen === 'register' && (
                        <motion.form key="register" custom={dir} variants={screenV} initial="initial" animate="animate" exit="exit"
                          onSubmit={async e => {
                            e.preventDefault();
                            const fd = new FormData(e.currentTarget);
                            const pw = fd.get('password') as string;
                            if (pw !== fd.get('confirmPassword')) { setError(t('passwordMismatch')); return; }
                            setStatus('loading'); setError('');
                            try {
                              const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname: fd.get('nickname'), email: fd.get('email'), password: pw }) });
                              const data = await res.json();
                              if (!res.ok) { setError(data.error || t('registrationFailed')); setStatus('idle'); return; }
                              localStorage.setItem('auth_token', data.token);
                              localStorage.setItem('user', JSON.stringify(data.user));
                              success(onLoginSuccess);
                            } catch { setError(t('connectionError')); setStatus('idle'); }
                          }}
                          style={fieldGap}
                        >
                          <div>
                            <label style={labelStyle}>{t('nicknameLabel')}</label>
                            <input className="auth-inp" id="reg-nickname" type="text" name="nickname" placeholder="DragonSlayer" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} required style={inp} />
                          </div>
                          <div>
                            <label style={labelStyle}>{t('emailLabel')}</label>
                            <input className="auth-inp" id="reg-email" type="email" name="email" placeholder="you@example.com" autoComplete="email" required style={inp} />
                          </div>
                          <div>
                            <label style={labelStyle}>{t('passwordLabel')}</label>
                            <div style={relPos}>
                              <input className="auth-inp" id="reg-password" type={showPw ? 'text' : 'password'} name="password" placeholder="••••••••" autoComplete="new-password" required style={{ ...inp, paddingRight: 32 }} />
                              <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)} style={eyeBtn}><Eye open={showPw} /></button>
                            </div>
                          </div>
                          <div>
                            <label style={labelStyle}>{t('confirmPasswordLabel')}</label>
                            <div style={relPos}>
                              <input className="auth-inp" type={showCpw ? 'text' : 'password'} name="confirmPassword" placeholder="••••••••" autoComplete="new-password" required style={{ ...inp, paddingRight: 32 }} />
                              <button type="button" tabIndex={-1} onClick={() => setShowCpw(v => !v)} style={eyeBtn}><Eye open={showCpw} /></button>
                            </div>
                          </div>
                          <button type="submit" disabled={status !== 'idle'} style={btnStyle}>
                            <AnimatePresence mode="wait" initial={false}>
                              {status === 'loading' && <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><SpinnerIcon />{t('creating')}</motion.span>}
                              {status === 'success' && <motion.span key="s" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>&#10003; {t('doneLabel')}</motion.span>}
                              {status === 'idle' && <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{t('signUp')}</motion.span>}
                            </AnimatePresence>
                          </button>
                        </motion.form>
                      )}

                      {/* ── FORGOT ── */}
                      {screen === 'forgot' && (
                        <motion.form key="forgot" custom={dir} variants={screenV} initial="initial" animate="animate" exit="exit"
                          onSubmit={e => { e.preventDefault(); setError(t('comingSoon')); }}
                          style={fieldGap}
                        >
                          <p style={{ fontSize: 13, color: C.label, lineHeight: 1.6, margin: 0 }}>
                            {t('resetPasswordDesc')}
                          </p>
                          <div>
                            <label style={labelStyle}>{t('emailLabel')}</label>
                            <input className="auth-inp" type="email" name="email" placeholder="you@example.com" autoComplete="email" required style={inp} />
                          </div>
                          <button type="submit" style={btnStyle}>{t('sendResetLink')}</button>
                        </motion.form>
                      )}

                      {/* ── ACCOUNT ── */}
                      {screen === 'account' && isLoggedIn && (
                        <motion.div key="account" custom={dir} variants={screenV} initial="initial" animate="animate" exit="exit"
                          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                          <div>
                            <label style={labelStyle}>{t('castlesLabel')}</label>
                            <button type="button"
                              style={{ height: 32, padding: '0 12px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.text }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHov)}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                              {t('addCastleBtn')}
                            </button>
                          </div>
                          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                            <label style={labelStyle}>{t('updateEmail')}</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <input className="auth-inp" type="email" placeholder="new@email.com" autoComplete="email" style={{ ...inp, flex: 1 }} />
                              <button type="button" style={{ height: 32, padding: '0 12px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.text, whiteSpace: 'nowrap' }}>{t('save')}</button>
                            </div>
                          </div>
                          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                            <button type="button"
                              onClick={() => {
                                localStorage.removeItem('auth_token');
                                localStorage.removeItem('user');
                                onLogout();
                                onClose();
                              }}
                              style={{ height: 32, padding: '0 12px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', color: '#f87171' }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(239,68,68,0.38)')}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(239,68,68,0.18)')}>
                              {t('signOut')}
                            </button>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
