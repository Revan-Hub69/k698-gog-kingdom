'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parsePower, formatPower } from '@/lib/power';

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

// ── SVG path constants (avoid SWC regexp parsing issues) ──────────
const P = {
  eyeOpen1: "M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  eyeOpen2: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  eyeShut:  "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
  edit:     "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  image:    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  check:    "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
  backArrow:"M15 19l-7-7 7-7",
  close:    "M6 18L18 6M6 6l12 12",
  chevronUp:"M5 15l7-7 7 7",
  user:     "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
};

const Eye = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    {open
      ? <><path strokeLinecap="round" strokeLinejoin="round" d={P.eyeOpen1} /><path strokeLinecap="round" strokeLinejoin="round" d={P.eyeOpen2} /></>
      : <path strokeLinecap="round" strokeLinejoin="round" d={P.eyeShut} />}
  </svg>
);

// ── Design tokens ─────────────────────────────────────────────────
const T = {
  bg0:     '#09090b',   // sheet header
  bg1:     '#0f0f12',   // sheet content
  surface: '#18181b',   // cards / inputs
  border:  '#27272a',   // borders (zinc-800)
  muted:   '#71717a',   // muted text (zinc-500)
  subtle:  '#3f3f46',   // subtle text (zinc-700)
  text:    '#e4e4e7',   // primary text (zinc-200)
  white:   '#ffffff',
  purple:  '#7c3aed',
  red:     '#ef4444',
};

const SCREEN_ORDER: Record<Screen, number> = { login: 0, register: 1, forgot: 2, account: 3 };

export default function AuthSheet({
  isOpen, screen, onOpen, onClose, onScreenChange,
  isLoggedIn, onLoginSuccess, onLogout, t,
}: AuthSheetProps) {
  const [status, setStatus]       = useState<Status>('idle');
  const [error, setError]         = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [showCpw, setShowCpw]     = useState(false);
  const prevScreen                = useRef<Screen>(screen);
  const [dir, setDir]             = useState(1);
  const [accountTab, setAccountTab] = useState<'castles' | 'settings' | 'leaderboard' | 'admin-users' | 'admin-kvk'>('castles');
  const [castles, setCastles]     = useState<{id:number;castleName:string;currentPower:number;historicalMaxPower:number;screenshotUrl?:string}[]>([]);
  const [editingCastle, setEditingCastle] = useState<{id:number;currentPower:string;historicalMaxPower:string} | null>(null);
  const [addingCastle, setAddingCastle]   = useState(false);
  const [expandedCastle, setExpandedCastle] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete]   = useState<{id:number;name:string} | null>(null);
  const [newCastleName, setNewCastleName] = useState('');
  const [newCurrPower, setNewCurrPower]   = useState('');
  const [newHistPower, setNewHistPower]   = useState('');
  const [newEmail, setNewEmail]       = useState('');
  const [currPw, setCurrPw]           = useState('');
  const [newPw, setNewPw]             = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const [showCurrPw, setShowCurrPw]   = useState(false);
  const [showNewPw, setShowNewPw]     = useState(false);
  const [showConfNewPw, setShowConfNewPw] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{rank:number;nickname:string;totalCurrentPower:number;totalHistoricalPower:number;hasScreenshot:boolean}[]>([]);
  const [msgOk, setMsgOk]         = useState('');
  const [adminUsers, setAdminUsers] = useState<{id:number;email:string;nickname:string;isAdmin:boolean;_count:{castles:number}}[]>([]);
  const [kvkUsers, setKvkUsers]   = useState<{id:number;nickname:string;kvkPackage:string|null}[]>([]);
  const [token, setToken]         = useState<string | null>(null);
  const [isAdmin, setIsAdmin]     = useState(false);

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
    setError(''); setStatus('idle'); setShowPw(false); setShowCpw(false); setMsgOk('');
  }, [screen]);

  // Read auth from localStorage (client-only, re-read on login state change)
  useEffect(() => {
    const t = localStorage.getItem('auth_token');
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setToken(t);
    setIsAdmin(u?.isAdmin === true);
  }, [isLoggedIn]);

  // Load account data on tab switch
  useEffect(() => {
    if (screen !== 'account' || !isOpen || !token) return;
    const headers = { Authorization: `Bearer ${token}` };
    if (accountTab === 'castles')
      fetch('/api/account/castles', { headers }).then(r => r.json()).then(d => Array.isArray(d) && setCastles(d));
    if (accountTab === 'admin-users' && isAdmin)
      fetch('/api/admin/users', { headers }).then(r => r.json()).then(d => Array.isArray(d) && setAdminUsers(d));
    if (accountTab === 'admin-kvk' && isAdmin)
      fetch('/api/admin/kvk', { headers }).then(r => r.json()).then(d => Array.isArray(d) && setKvkUsers(d));
    if (accountTab === 'leaderboard')
      fetch('/api/leaderboard').then(r => r.json()).then(d => Array.isArray(d) && setLeaderboard(d));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, accountTab, isOpen]);

  const success = (cb: () => void) => {
    setStatus('success');
    setTimeout(() => { cb(); onScreenChange('account'); }, 650);
  };

  const screenTitle: Record<Screen, string> = {
    login: t('signIn'), register: t('signUp'), forgot: t('resetPassword'), account: t('openAccount'),
  };

  // ── Shared styles ─────────────────────────────────────────────
  // Input: height 48px (Material 3 filled text field standard)
  const field: React.CSSProperties = {
    width: '100%', height: 48, padding: '0 16px',
    background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
    fontSize: 15, fontWeight: 400, color: T.white,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  // Primary button: height 48px full-width (Apple HIG touch target)
  const btnPrimary: React.CSSProperties = {
    width: '100%', height: 48, borderRadius: 10,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    border: 'none', color: T.white,
    background: `linear-gradient(135deg, ${T.purple}, #2563eb)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'opacity 0.15s',
  };

  // Secondary button: same height, outlined
  const btnSecondary: React.CSSProperties = {
    height: 42, padding: '0 16px', borderRadius: 8,
    fontSize: 14, fontWeight: 500, cursor: 'pointer',
    background: 'transparent', border: `1px solid ${T.border}`, color: T.text,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    transition: 'border-color 0.15s, background 0.15s',
    whiteSpace: 'nowrap',
  };

  const label12: React.CSSProperties = {
    fontSize: 12, fontWeight: 500, color: T.muted,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: 8, display: 'block',
  };

  const screenV = {
    initial: (d: number) => ({ opacity: 0, x: d * 24, filter: 'blur(4px)' }),
    animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.18 } },
    exit: (d: number) => ({ opacity: 0, x: d * -24, filter: 'blur(4px)', transition: { duration: 0.12 } }),
  };

  const focusCss = `
    .af:focus { border-color: ${T.purple} !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.18) !important; }
    .af:hover:not(:focus) { border-color: ${T.subtle} !important; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  return (
    <>
      <style>{focusCss}</style>

      {/* ── PERSISTENT TAB ─────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div key="tab"
            initial={{ y: 72 }} animate={{ y: 0 }} exit={{ y: 72 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, display: 'flex', justifyContent: 'center' }}
          >
            <button type="button"
              onClick={() => { onScreenChange(isLoggedIn ? 'account' : 'login'); onOpen(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 28px 16px',
                background: 'linear-gradient(180deg, #27272a 0%, #18181b 100%)',
                border: '1px solid rgba(255,255,255,0.14)', borderBottom: 'none',
                borderRadius: '14px 14px 0 0', cursor: 'pointer',
                color: T.text, fontSize: 14, fontWeight: 600,
                boxShadow: '0 -8px 32px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.06)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.24)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
            >
              {isLoggedIn ? t('openAccount') : `${t('signIn')} / ${t('signUp')}`}
              <svg width="13" height="13" fill="none" stroke={T.muted} strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={P.chevronUp} />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FULL SHEET ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div key="bd" className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            {/* ── CLOSE X — sits just above the sheet ── */}
            <motion.button key="close-btn" type="button" onClick={onClose}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                position: 'fixed',
                bottom: 'calc(min(86dvh, 700px) + 12px)',
                right: 16,
                zIndex: 60,
                width: 40, height: 40, borderRadius: 20,
                background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: T.white,
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={P.close} />
              </svg>
            </motion.button>
            <motion.div key="sheet" className="fixed bottom-0 left-0 right-0 z-50"
              style={{ height: 'min(86dvh, 700px)' }}
              initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320, mass: 0.9 }}
            >
              <div className="h-full flex flex-col overflow-hidden" style={{
                position: 'relative',
                background: T.bg0,
                borderTop: `1px solid ${T.border}`,
                borderRadius: '20px 20px 0 0',
                boxShadow: '0 -12px 60px rgba(0,0,0,0.7)',
              }}>

                {/* ── HEADER ────────────────────────────────────── */}
                <div style={{ flexShrink: 0, borderBottom: `1px solid ${T.border}` }}>
                  {/* Drag handle */}
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px' }}>
                    <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.15)' }} />
                  </div>

                  {/* Nav row: [back] [tabs/title] [signout+close] */}
                  <div style={{ display: 'flex', alignItems: 'center', padding: '4px 12px 12px', gap: 8 }}>

                    {/* Left: back button */}
                    <div style={{ width: 40, flexShrink: 0 }}>
                      {screen === 'forgot' && (
                        <button type="button" onClick={() => onScreenChange('login')}
                          style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: T.text, background: 'none', border: 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d={P.backArrow} />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Center: segmented tabs or title */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
                      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                      {(screen === 'login' || screen === 'register') && (
                        <div style={{ display: 'inline-flex', background: T.surface, borderRadius: 10, padding: 3, border: `1px solid ${T.border}`, gap: 2 }}>
                          {(['login', 'register'] as Screen[]).map(s => (
                            <button key={s} type="button" onClick={() => onScreenChange(s)}
                              style={{ position: 'relative', padding: '0 20px', height: 34, borderRadius: 7, fontSize: 14, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'transparent', color: screen === s ? T.white : T.muted, transition: 'color 0.15s', zIndex: 1 }}>
                              {screen === s && (
                                <motion.span layoutId="tab-pill"
                                  style={{ position: 'absolute', inset: 0, borderRadius: 7, background: 'rgba(255,255,255,0.1)', zIndex: -1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                              )}
                              {s === 'login' ? t('signIn') : t('signUp')}
                            </button>
                          ))}
                        </div>
                      )}
                      {screen === 'forgot' && (
                        <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{t('resetPassword')}</span>
                      )}
                      {screen === 'account' && (
                        <div style={{ display: 'inline-flex', background: T.surface, borderRadius: 10, padding: 3, border: `1px solid ${T.border}`, gap: 2 }}>
                          {[
                            { id: 'castles',      label: t('castlesLabel') },
                            { id: 'leaderboard',  label: t('leaderboardTitle') },
                            { id: 'settings',     label: t('settings') },
                            ...(isAdmin ? [
                              { id: 'admin-users', label: t('manageAccountsShort') },
                              { id: 'admin-kvk',   label: t('kvkPackagesShort') },
                            ] : []),
                          ].map(tab => (
                            <button key={tab.id} type="button"
                              onClick={() => { setAccountTab(tab.id as typeof accountTab); setMsgOk(''); setError(''); }}
                              style={{ position: 'relative', padding: '0 14px', height: 34, borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: 'transparent', color: accountTab === tab.id ? T.white : T.muted, transition: 'color 0.15s', zIndex: 1, whiteSpace: 'nowrap' }}>
                              {accountTab === tab.id && (
                                <motion.span layoutId="acc-pill"
                                  style={{ position: 'absolute', inset: 0, borderRadius: 7, background: 'rgba(255,255,255,0.1)', zIndex: -1 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                              )}
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      )}
                      </div>
                    </div>

                    {/* Right: sign out (account only) + close */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, minWidth: 44 }}>
                    </div>
                  </div>
                </div>

                {/* ── SIGN OUT — floating bottom right ── */}
                {screen === 'account' && isLoggedIn && (
                  <motion.button type="button"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    onClick={() => { localStorage.removeItem('auth_token'); localStorage.removeItem('user'); onLogout(); onClose(); }}
                    style={{
                      position: 'absolute', bottom: 20, right: 20, zIndex: 10,
                      height: 40, padding: '0 18px', borderRadius: 20,
                      fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      background: 'rgba(239,68,68,0.12)', backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(239,68,68,0.3)', color: '#f87171',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
                  >
                    {t('signOut')}
                  </motion.button>
                )}

                {/* ── CONTENT ────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto no-scrollbar" style={{ background: T.bg1 }}>
                  <div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px 56px' }}>

                    {/* Error/success banners */}
                    <AnimatePresence>
                      {error && (
                        <motion.div key={`e-${error}`}
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 14 }}
                        >{error}</motion.div>
                      )}
                      {msgOk && (
                        <motion.div key={`m-${msgOk}`}
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80', fontSize: 14 }}
                        >{msgOk}</motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait" initial={false} custom={dir}>

                      {/* ── LOGIN ────────────────────────────────── */}
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
                          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <div>
                            <label style={label12}>{t('emailLabel')}</label>
                            <input className="af" type="email" name="email" id="l-email" placeholder="you@example.com" autoComplete="email" required style={field} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <span style={{ ...label12, marginBottom: 0 }}>{t('passwordLabel')}</span>
                              <button type="button" onClick={() => onScreenChange('forgot')}
                                style={{ fontSize: 13, color: T.purple, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                                {t('forgotPassword')}
                              </button>
                            </div>
                            <div style={{ position: 'relative' }}>
                              <input className="af" type={showPw ? 'text' : 'password'} name="password" id="l-pw" placeholder="••••••••" autoComplete="current-password" required style={field} />
                              <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
                                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                <Eye open={showPw} />
                              </button>
                            </div>
                          </div>
                          <button type="submit" disabled={status !== 'idle'} style={{ ...btnPrimary, marginTop: 8, opacity: status !== 'idle' ? 0.7 : 1 }}>
                            {status === 'loading' && <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.75s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/><path d="M8 2A6 6 0 0114 8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
                            {status === 'success' ? '✓ ' + t('doneLabel') : status === 'loading' ? t('signingIn') : t('signIn')}
                          </button>
                        </motion.form>
                      )}

                      {/* ── REGISTER ─────────────────────────────── */}
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
                          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          {[
                            { lbl: t('nicknameLabel'), name: 'nickname', type: 'text', ph: 'DragonSlayer', ac: 'off', id: 'r-nick' },
                            { lbl: t('emailLabel'), name: 'email', type: 'email', ph: 'you@example.com', ac: 'email', id: 'r-email' },
                          ].map(f => (
                            <div key={f.name}>
                              <label style={label12}>{f.lbl}</label>
                              <input className="af" type={f.type} name={f.name} id={f.id} placeholder={f.ph} autoComplete={f.ac} required style={field} />
                            </div>
                          ))}
                          {[
                            { lbl: t('passwordLabel'), name: 'password', ac: 'new-password', id: 'r-pw', vis: showPw, tog: () => setShowPw(v => !v) },
                            { lbl: t('confirmPasswordLabel'), name: 'confirmPassword', ac: 'new-password', id: 'r-cpw', vis: showCpw, tog: () => setShowCpw(v => !v) },
                          ].map(f => (
                            <div key={f.name}>
                              <label style={label12}>{f.lbl}</label>
                              <div style={{ position: 'relative' }}>
                                <input className="af" type={f.vis ? 'text' : 'password'} name={f.name} id={f.id} placeholder="••••••••" autoComplete={f.ac} required style={field} />
                                <button type="button" tabIndex={-1} onClick={f.tog}
                                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                  <Eye open={f.vis} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button type="submit" disabled={status !== 'idle'} style={{ ...btnPrimary, marginTop: 8, opacity: status !== 'idle' ? 0.7 : 1 }}>
                            {status === 'loading' && <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 0.75s linear infinite' }}><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/><path d="M8 2A6 6 0 0114 8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
                            {status === 'success' ? '✓ ' + t('doneLabel') : status === 'loading' ? t('creating') : t('signUp')}
                          </button>
                        </motion.form>
                      )}

                      {/* ── FORGOT ───────────────────────────────── */}
                      {screen === 'forgot' && (
                        <motion.form key="forgot" custom={dir} variants={screenV} initial="initial" animate="animate" exit="exit"
                          onSubmit={e => { e.preventDefault(); setError(t('comingSoon')); }}
                          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: 0 }}>{t('resetPasswordDesc')}</p>
                          <div>
                            <label style={label12}>{t('emailLabel')}</label>
                            <input className="af" type="email" name="email" placeholder="you@example.com" autoComplete="email" required style={field} />
                          </div>
                          <button type="submit" style={{ ...btnPrimary, marginTop: 8 }}>{t('sendResetLink')}</button>
                        </motion.form>
                      )}

                      {/* ── ACCOUNT ──────────────────────────────── */}
                      {screen === 'account' && isLoggedIn && (
                        <motion.div key="account" custom={dir} variants={screenV} initial="initial" animate="animate" exit="exit"
                          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                          {/* ── CASTLES ── */}
                          {accountTab === 'castles' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                              {/* Top bar */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 13, color: T.muted }}>{castles.length} {t('castlesLabel').toLowerCase()}</span>
                                {!addingCastle && castles.length < 20 && (
                                  <button type="button" onClick={() => setAddingCastle(true)}
                                    style={{ height: 36, padding: '0 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: `linear-gradient(135deg, ${T.purple}, #2563eb)`, border: 'none', color: T.white }}>
                                    + {t('addCastleBtn')}
                                  </button>
                                )}
                                {addingCastle && (
                                  <button type="button" onClick={() => { setAddingCastle(false); setNewCastleName(''); setNewCurrPower(''); setNewHistPower(''); }}
                                    style={{ height: 36, padding: '0 14px', borderRadius: 8, fontSize: 14, cursor: 'pointer', background: 'none', border: `1px solid ${T.border}`, color: T.muted }}>
                                    {t('cancel') || 'Cancel'}
                                  </button>
                                )}
                              </div>

                              {/* Add form */}
                              {addingCastle && (
                                <div style={{ padding: 20, borderRadius: 12, border: `1px solid ${T.border}`, background: T.surface, display: 'flex', flexDirection: 'column', gap: 16 }}>
                                  <div>
                                    <label style={label12}>{t('castleName') || t('castleNamePh')}</label>
                                    <input className="af" value={newCastleName} onChange={e => setNewCastleName(e.target.value)}
                                      placeholder={t('castleNamePh')} autoFocus style={field} />
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div>
                                      <label style={label12}>{t('currentPower')}</label>
                                      <input className="af" id="nc-curr" type="text" inputMode="decimal" value={newCurrPower} onChange={e => setNewCurrPower(e.target.value)}
                                        placeholder="es. 8.5b" style={field} />
                                      {newCurrPower && <div style={{ fontSize: 12, color: T.purple, marginTop: 4 }}>= {formatPower(parsePower(newCurrPower))}</div>}
                                    </div>
                                    <div>
                                      <label style={label12}>{t('historicalPower')}</label>
                                      <input className="af" id="nc-hist" type="text" inputMode="decimal" value={newHistPower} onChange={e => setNewHistPower(e.target.value)}
                                        placeholder="es. 9.5b" style={field} />
                                      {newHistPower && <div style={{ fontSize: 12, color: T.purple, marginTop: 4 }}>= {formatPower(parsePower(newHistPower))}</div>}
                                    </div>
                                  </div>
                                  <button type="button" style={btnPrimary}
                                    onClick={async () => {
                                      const name = newCastleName.trim();
                                      if (!name) return;
                                      const curr = parsePower(newCurrPower);
                                      const hist = parsePower(newHistPower);
                                      const res = await fetch('/api/account/castles', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ castleName: name }) });
                                      const data = await res.json();
                                      if (!res.ok) { setError(data.error); return; }
                                      let castle = data;
                                      if (curr > 0 || hist > 0) {
                                        const pRes = await fetch('/api/account/castles', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: data.id, currentPower: curr, historicalMaxPower: hist }) });
                                        if (pRes.ok) castle = await pRes.json();
                                      }
                                      setCastles(prev => [...prev, castle]);
                                      setNewCastleName(''); setNewCurrPower(''); setNewHistPower(''); setAddingCastle(false);
                                    }}>
                                    {t('addCastleBtn')}
                                  </button>
                                </div>
                              )}

                              {castles.length === 0 && !addingCastle && (
                                <p style={{ fontSize: 14, color: T.muted }}>{t('noCastles')}</p>
                              )}

                              {/* Castle cards — ACCORDION */}
                              {castles.map(c => (
                                <div key={c.id} style={{ borderRadius: 12, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
                                  {/* Accordion header — always visible */}
                                  <button type="button"
                                    onClick={() => setExpandedCastle(expandedCastle === c.id ? null : c.id)}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: T.surface, border: 'none', cursor: 'pointer', color: T.white, textAlign: 'left' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                      <span style={{ fontSize: 15, fontWeight: 700 }}>{c.castleName}</span>
                                      {c.currentPower > 0 && (
                                        <span style={{ fontSize: 13, color: T.muted }}>{formatPower(c.currentPower)}</span>
                                      )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      {c.screenshotUrl && (
                                        <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 600 }}>✓</span>
                                      )}
                                      <svg width="14" height="14" fill="none" stroke={T.muted} strokeWidth={2} viewBox="0 0 24 24"
                                        style={{ transform: expandedCastle === c.id ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </button>

                                  {/* Accordion body */}
                                  {expandedCastle === c.id && (
                                    <div style={{ borderTop: `1px solid ${T.border}` }}>
                                      {editingCastle?.id === c.id ? (
                                        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                            <div>
                                              <label style={label12}>{t('currentPower')}</label>
                                              <input className="af" type="text" inputMode="decimal" value={editingCastle.currentPower}
                                                onChange={e => setEditingCastle(p => p && { ...p, currentPower: e.target.value })} style={field} />
                                              {editingCastle.currentPower && <div style={{ fontSize: 12, color: T.purple, marginTop: 4 }}>= {formatPower(parsePower(editingCastle.currentPower))}</div>}
                                            </div>
                                            <div>
                                              <label style={label12}>{t('historicalPower')}</label>
                                              <input className="af" type="text" inputMode="decimal" value={editingCastle.historicalMaxPower}
                                                onChange={e => setEditingCastle(p => p && { ...p, historicalMaxPower: e.target.value })} style={field} />
                                              {editingCastle.historicalMaxPower && <div style={{ fontSize: 12, color: T.purple, marginTop: 4 }}>= {formatPower(parsePower(editingCastle.historicalMaxPower))}</div>}
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', gap: 8 }}>
                                            <button type="button" style={{ ...btnPrimary, height: 42, marginTop: 0, flex: 1, fontSize: 14 }}
                                              onClick={async () => {
                                                const curr = parsePower(editingCastle.currentPower);
                                                const hist = parsePower(editingCastle.historicalMaxPower);
                                                const res = await fetch('/api/account/castles', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: c.id, currentPower: curr, historicalMaxPower: hist }) });
                                                const data = await res.json();
                                                if (!res.ok) { setError(data.error); return; }
                                                setCastles(prev => prev.map(x => x.id === c.id ? data : x));
                                                setEditingCastle(null); setMsgOk(t('save') + ' ✓');
                                              }}>
                                              {t('save')}
                                            </button>
                                            <button type="button" style={{ ...btnSecondary, height: 42 }} onClick={() => setEditingCastle(null)}>
                                              {t('cancel') || 'Cancel'}
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div style={{ padding: '16px 18px' }}>
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
                                            <div>
                                              <div style={{ fontSize: 11, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{t('currentPower')}</div>
                                              <div style={{ fontSize: 22, fontWeight: 700, color: c.currentPower > 0 ? T.white : T.subtle }}>
                                                {formatPower(c.currentPower)}
                                              </div>
                                            </div>
                                            <div>
                                              <div style={{ fontSize: 11, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{t('historicalPower')}</div>
                                              <div style={{ fontSize: 22, fontWeight: 700, color: c.historicalMaxPower > 0 ? T.white : T.subtle }}>
                                                {formatPower(c.historicalMaxPower)}
                                              </div>
                                            </div>
                                          </div>
                                          <div style={{ display: 'flex', gap: 10, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                                            <button type="button" style={{ ...btnSecondary, flex: 1, height: 44, flexDirection: 'column', gap: 3 } as React.CSSProperties}
                                              onClick={() => setEditingCastle({ id: c.id, currentPower: String(c.currentPower), historicalMaxPower: String(c.historicalMaxPower) })}>
                                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={P.edit} /></svg>
                                              <span style={{ fontSize: 11 }}>{t('editPower')}</span>
                                            </button>
                                            <label style={{ ...btnSecondary, flex: 1, height: 44, flexDirection: 'column', gap: 3 } as React.CSSProperties}>
                                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={P.image} /></svg>
                                              <span style={{ fontSize: 11, textAlign: 'center', lineHeight: 1.3 }}>{t('screenshotMigration')}</span>
                                              <input type="file" accept="image/*" style={{ display: 'none' }}
                                                onChange={async e => {
                                                  const file = e.target.files?.[0]; if (!file) return;
                                                  const fd = new FormData(); fd.append('file', file); fd.append('castleId', String(c.id));
                                                  const res = await fetch('/api/account/castles/screenshot', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
                                                  setMsgOk(res.ok ? t('screenshotOk') : t('screenshotErr'));
                                                }} />
                                            </label>
                                            <button type="button"
                                              onClick={() => setConfirmDelete({ id: c.id, name: c.castleName })}
                                              style={{ height: 44, padding: '0 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', whiteSpace: 'nowrap' }}>
                                              {t('delete')}
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ── LEADERBOARD ── */}
                          {accountTab === 'leaderboard' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {leaderboard.length === 0 && (
                                <p style={{ fontSize: 14, color: T.muted }}>{t('leaderboardDesc')}</p>
                              )}
                              {leaderboard.map(entry => (
                                <div key={entry.rank} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 10, background: T.surface, border: `1px solid ${T.border}` }}>
                                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: entry.rank <= 3 ? T.purple : T.muted, flexShrink: 0 }}>
                                    #{entry.rank}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: T.white, marginBottom: 2 }}>{entry.nickname}</div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                      <span style={{ fontSize: 12, color: '#60a5fa' }}>{t('currentPower')}: <strong>{formatPower(entry.totalCurrentPower)}</strong></span>
                                      <span style={{ fontSize: 12, color: '#4ade80' }}>{t('historicalPower')}: <strong>{formatPower(entry.totalHistoricalPower)}</strong></span>
                                    </div>
                                  </div>
                                  {entry.hasScreenshot && (
                                    <span style={{ fontSize: 12, color: '#4ade80', flexShrink: 0 }}>✓</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ── SETTINGS ── */}
                          {accountTab === 'settings' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                              <div>
                                <label style={label12}>{t('updateEmail')}</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                  <input className="af" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                                    placeholder={t('newEmailPh')} autoComplete="email" style={{ ...field, flex: 1 }} />
                                  <button type="button" style={{ ...btnSecondary, height: 48, padding: '0 20px', flexShrink: 0 }}
                                    onClick={async () => {
                                      const res = await fetch('/api/account/change-email', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ email: newEmail }) });
                                      const data = await res.json();
                                      if (!res.ok) { setError(data.error); return; }
                                      setMsgOk(t('emailUpdated')); setNewEmail('');
                                    }}>
                                    {t('save')}
                                  </button>
                                </div>
                              </div>
                              <div style={{ paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
                                <label style={label12}>{t('changePassword')}</label>
                                <form onSubmit={async e => {
                                  e.preventDefault();
                                  if (newPw !== confirmNewPw) { setError(t('passwordMismatch')); return; }
                                  const res = await fetch('/api/account/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ currentPassword: currPw, newPassword: newPw }) });
                                  const data = await res.json();
                                  if (!res.ok) { setError(data.error); return; }
                                  setMsgOk(t('passwordUpdated')); setCurrPw(''); setNewPw(''); setConfirmNewPw('');
                                }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                  {/* Current password */}
                                  <div style={{ position: 'relative' }}>
                                    <input className="af" id="s-cpw" type={showCurrPw ? 'text' : 'password'} value={currPw} onChange={e => setCurrPw(e.target.value)} placeholder={t('currentPwPh')} autoComplete="current-password" style={field} />
                                    <button type="button" tabIndex={-1} onClick={() => setShowCurrPw(v => !v)}
                                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                      <Eye open={showCurrPw} />
                                    </button>
                                  </div>
                                  {/* New password */}
                                  <div style={{ position: 'relative' }}>
                                    <input className="af" id="s-npw" type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder={t('newPwPh')} autoComplete="new-password" style={field} />
                                    <button type="button" tabIndex={-1} onClick={() => setShowNewPw(v => !v)}
                                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                      <Eye open={showNewPw} />
                                    </button>
                                  </div>
                                  {/* Confirm new password */}
                                  <div style={{ position: 'relative' }}>
                                    <input className="af" id="s-cnpw" type={showConfNewPw ? 'text' : 'password'} value={confirmNewPw} onChange={e => setConfirmNewPw(e.target.value)} placeholder={t('confirmPasswordLabel')} autoComplete="new-password" style={{ ...field, borderColor: confirmNewPw && confirmNewPw !== newPw ? T.red : T.border }} />
                                    <button type="button" tabIndex={-1} onClick={() => setShowConfNewPw(v => !v)}
                                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted, background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                      <Eye open={showConfNewPw} />
                                    </button>
                                  </div>
                                  <button type="submit" style={{ ...btnPrimary, marginTop: 4 }}>{t('save')}</button>
                                </form>
                              </div>
                            </div>
                          )}

                          {/* ── ADMIN: USERS ── */}
                          {accountTab === 'admin-users' && isAdmin && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {adminUsers.map(u => (
                                <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: T.surface, border: `1px solid ${T.border}` }}>
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: T.white }}>{u.nickname}</div>
                                    <div style={{ fontSize: 12, color: T.muted }}>{u.email} · {u._count.castles} castles {u.isAdmin ? '· admin' : ''}</div>
                                  </div>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button type="button" onClick={async () => {
                                      const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ userId: u.id, isAdmin: !u.isAdmin }) });
                                      const data = await res.json();
                                      if (res.ok) setAdminUsers(prev => prev.map(x => x.id === u.id ? { ...x, isAdmin: data.isAdmin } : x));
                                    }} style={{ ...btnSecondary, fontSize: 12, height: 34, color: u.isAdmin ? '#f87171' : '#4ade80', borderColor: u.isAdmin ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)' }}>
                                      {u.isAdmin ? t('revokeAdmin') : t('makeAdmin')}
                                    </button>
                                    <button type="button" onClick={async () => {
                                      if (!window.confirm(u.nickname)) return;
                                      const res = await fetch(`/api/admin/users?userId=${u.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                                      if (res.ok) setAdminUsers(prev => prev.filter(x => x.id !== u.id));
                                    }} style={{ ...btnSecondary, fontSize: 12, height: 34, color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
                                      {t('delete')}
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {adminUsers.length === 0 && <p style={{ fontSize: 14, color: T.muted }}>No users.</p>}
                            </div>
                          )}

                          {/* ── ADMIN: KVK ── */}                          {accountTab === 'admin-kvk' && isAdmin && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              {kvkUsers.map(u => (
                                <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: T.surface, border: `1px solid ${T.border}` }}>
                                  <span style={{ fontSize: 14, fontWeight: 600, color: T.white }}>{u.nickname}</span>
                                  <select value={u.kvkPackage || 'none'}
                                    onChange={async e => {
                                      const pkg = e.target.value;
                                      const res = await fetch('/api/admin/kvk', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ userId: u.id, kvkPackage: pkg }) });
                                      if (res.ok) setKvkUsers(prev => prev.map(x => x.id === u.id ? { ...x, kvkPackage: pkg === 'none' ? null : pkg } : x));
                                    }}
                                    style={{ height: 36, padding: '0 10px', borderRadius: 8, fontSize: 13, background: T.surface, border: `1px solid ${T.border}`, color: T.white, cursor: 'pointer' }}>
                                    <option value="none">— No package</option>
                                    <option value="bronze">Bronze</option>
                                    <option value="silver">Silver</option>
                                    <option value="gold">Gold</option>
                                  </select>
                                </div>
                              ))}
                              {kvkUsers.length === 0 && <p style={{ fontSize: 14, color: T.muted }}>No users.</p>}
                            </div>
                          )}

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
      {/* ── CONFIRM DELETE DIALOG ── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div key="confirm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: T.bg0, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, maxWidth: 320, width: '100%', boxShadow: '0 24px 48px rgba(0,0,0,0.6)' }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: T.white, marginBottom: 8 }}>{t('delete')} castello</div>
              <div style={{ fontSize: 14, color: T.muted, marginBottom: 24, lineHeight: 1.5 }}>
                Eliminare <strong style={{ color: T.text }}>{confirmDelete.name}</strong>? Questa azione non è reversibile.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button"
                  onClick={async () => {
                    const res = await fetch(`/api/account/castles?id=${confirmDelete.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                    if (res.ok) { setCastles(prev => prev.filter(x => x.id !== confirmDelete.id)); setEditingCastle(null); setExpandedCastle(null); }
                    setConfirmDelete(null);
                  }}
                  style={{ flex: 1, height: 44, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: T.red, border: 'none', color: T.white }}>
                  {t('delete')}
                </button>
                <button type="button"
                  onClick={() => setConfirmDelete(null)}
                  style={{ flex: 1, height: 44, borderRadius: 10, fontSize: 14, cursor: 'pointer', background: 'none', border: `1px solid ${T.border}`, color: T.muted }}>
                  {t('cancel')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
