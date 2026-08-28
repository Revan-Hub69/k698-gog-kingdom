'use client';

import { useState } from 'react';

interface AuthSheetProps {
  isOpen: boolean;
  screen: 'login' | 'register' | 'forgot' | 'account';
  onClose: () => void;
  onScreenChange: (screen: 'login' | 'register' | 'forgot' | 'account') => void;
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  t: (key: string) => string;
}

export default function AuthSheet({
  isOpen,
  screen,
  onClose,
  onScreenChange,
  isLoggedIn,
  onLoginSuccess,
  t,
}: AuthSheetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const PasswordToggle = ({ show, setShow }: { show: boolean; setShow: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => setShow(!show)}
      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300"
    >
      {show ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 5C7 5 2.73 8.11 1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54C21.27 8.11 17 5 12 5m0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.83 9L15.5 12.67c.04-.3.07-.59.07-.67C15.57 11.14 14.43 10 13 10c-.36 0-.69.08-1.17.17zM19.08 15.54c.33-.67.54-1.42.54-2.54 0-3.97-3.03-7-7-7-1.12 0-1.87.21-2.54.54l1.81 1.81c.71-.38 1.53-.6 2.73-.6 2.76 0 5 2.24 5 5 0 1.2-.22 2.02-.6 2.73l1.6 1.6zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.69c1.73 4.39 6 7.54 11 7.54 1.69 0 3.32-.27 4.84-.75l2.85 2.85c.36.36.93.36 1.29 0 .36-.36.36-.93 0-1.29L3.29 2.58c-.36-.36-.93-.36-1.29 0-.37.36-.37.92.01 1.29zm7.78-4.28c5.05 0 9.27 3.19 11 7.54-1.73 4.39-6 7.54-11 7.54-1.69 0-3.32-.27-4.84-.75l2.85 2.85c.36.36.93.36 1.29 0 .36-.36.36-.93 0-1.29L3.29 2.58c-.36-.36-.93-.36-1.29 0-.37.36-.37.92.01 1.29zm7.5 6.85c0 .67-.54 1.21-1.21 1.21-.67 0-1.21-.54-1.21-1.21s.54-1.21 1.21-1.21 1.21.54 1.21 1.21z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-purple-500/20 rounded-t-3xl p-6 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-lg transition"
        >
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="max-w-2xl mx-auto pr-8">
          {/* LOGIN SCREEN */}
          {screen === 'login' && (
            <>
              <h2 className="text-3xl font-black text-white mb-6">{t('loginTitle')}</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = new FormData(e.currentTarget).get('email') as string;
                  const password = new FormData(e.currentTarget).get('password') as string;
                  setLoading(true);
                  setError('');
                  try {
                    const res = await fetch('/api/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, password }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setError(data.error || 'Login failed');
                      return;
                    }
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    onLoginSuccess();
                    onClose();
                  } catch (err) {
                    setError('An error occurred. Please try again.');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">{t('email')}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-10 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                      required
                    />
                    <PasswordToggle show={showPassword} setShow={setShowPassword} />
                  </div>
                  <button
                    type="button"
                    onClick={() => onScreenChange('forgot')}
                    className="text-xs text-purple-400 hover:text-purple-300 mt-2"
                  >
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-lg font-bold transition"
                >
                  {loading ? 'Signing in...' : t('signIn')}
                </button>
              </form>
              <p className="text-center text-slate-400 text-sm mt-6">
                {t('dontHaveAccount')}{' '}
                <button
                  onClick={() => onScreenChange('register')}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  {t('signUp')}
                </button>
              </p>
            </>
          )}

          {/* REGISTER SCREEN */}
          {screen === 'register' && (
            <>
              <h2 className="text-3xl font-black text-white mb-6">{t('registerTitle')}</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const nickname = fd.get('nickname') as string;
                  const email = fd.get('email') as string;
                  const password = fd.get('password') as string;
                  const confirmPassword = fd.get('confirmPassword') as string;
                  if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                  }
                  setLoading(true);
                  setError('');
                  try {
                    const res = await fetch('/api/auth/register', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ nickname, email, password }),
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      setError(data.error || 'Registration failed');
                      return;
                    }
                    localStorage.setItem('auth_token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    onLoginSuccess();
                    onClose();
                  } catch (err) {
                    setError('An error occurred. Please try again.');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">{t('nicknameLabel')}</label>
                  <input
                    type="text"
                    name="nickname"
                    placeholder="DragonSlayer"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">{t('email')}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-10 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                      required
                    />
                    <PasswordToggle show={showPassword} setShow={setShowPassword} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 pr-10 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                      required
                    />
                    <PasswordToggle show={showConfirmPassword} setShow={setShowConfirmPassword} />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-lg font-bold transition"
                >
                  {loading ? 'Creating...' : t('signUp')}
                </button>
              </form>
              <p className="text-center text-slate-400 text-sm mt-6">
                {t('alreadyHaveAccount')}{' '}
                <button
                  onClick={() => onScreenChange('login')}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  {t('signIn')}
                </button>
              </p>
            </>
          )}

          {/* FORGOT PASSWORD SCREEN */}
          {screen === 'forgot' && (
            <>
              <h2 className="text-3xl font-black text-white mb-6">Reset Password</h2>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              <p className="text-slate-300 text-sm mb-6">Enter your email address and we'll send you instructions to reset your password.</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError('Password reset feature coming soon. Contact support.');
                  setLoading(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">{t('email')}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-lg font-bold transition"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p className="text-center text-slate-400 text-sm mt-6">
                Remember your password?{' '}
                <button
                  onClick={() => onScreenChange('login')}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </>
          )}

          {/* ACCOUNT SCREEN */}
          {screen === 'account' && isLoggedIn && (
            <>
              <h2 className="text-3xl font-black text-white mb-6">{t('myKingdom')}</h2>
              <div className="space-y-6">
                <div className="border-b border-slate-700 pb-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>🏰 {t('myCastles')}</span>
                    <span className="text-sm bg-purple-600 text-white px-2 py-1 rounded">0</span>
                  </h3>
                  <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                    + Add Castle
                  </button>
                </div>
                <div className="border-b border-slate-700 pb-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    ⚙️ {t('settings')}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">📧 {t('email')}</label>
                      <div className="flex gap-2">
                        <input type="email" placeholder="your@email.com" className="flex-1 px-3 py-2 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
                        <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm">{t('save')}</button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">🔐 {t('changePassword')}</label>
                      <div className="flex gap-2">
                        <input type="password" placeholder="New password" className="flex-1 px-3 py-2 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm" />
                        <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm">{t('save')}</button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 rounded-lg font-semibold transition"
                >
                  🚪 Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
