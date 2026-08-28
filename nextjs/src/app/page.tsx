'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageProvider';

const LANGUAGES = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;

type TabType = 'guard' | 'curiosities' | 'coa';

interface LeaderboardEntry {
  id: number;
  nickname: string;
  totalCastles: number;
  totalCurrentPower: number;
  totalHistoricalPower: number;
  rank: number;
  castles: { lastPowerUpdate: string; screenshotUrl?: string }[];
}

const TAB_DATA: Record<TabType, { title: string; descKey: string; contentKey: string; image: string; list: string[] }> = {
  guard: {
    title: 'guardWeapons',
    descKey: 'guardWeaponsStrategy',
    contentKey: 'guardWeaponsContent',
    image: '/images/guard-weapons.png',
    list: ['equipStrategically', 'manageTroops', 'exceptionLeaders'],
  },
  curiosities: {
    title: 'curiosities',
    descKey: 'curiositiesManagement',
    contentKey: 'curiositiesContent',
    image: '/images/Curiosities.png',
    list: ['collectCombine', 'trackPowerChanges', 'planLoadouts'],
  },
  coa: {
    title: 'coatsOfArms',
    descKey: 'coaNew',
    contentKey: 'newestFeature',
    image: '/images/COA.png',
    list: ['applyCoa', 'calculateImpact', 'maximizePerformance'],
  },
};

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('guard');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

  // Auto-detect browser language
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    if (LANGUAGES.includes(browserLang as typeof LANGUAGES[0])) {
      setLanguage(browserLang as typeof LANGUAGES[0]);
    }
  }, [setLanguage]);

  // Fetch leaderboard
  useEffect(() => {
    fetchLeaderboard();
    checkAuth();
  }, []);

  // Filter leaderboard based on search
  useEffect(() => {
    if (leaderboardSearch.trim() === '') {
      setFilteredLeaderboard(leaderboard);
    } else {
      const search = leaderboardSearch.toLowerCase();
      setFilteredLeaderboard(
        leaderboard.filter((entry) =>
          entry.nickname.toLowerCase().includes(search)
        )
      );
    }
  }, [leaderboardSearch, leaderboard]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      
      // Ensure data is an array
      const leaderboardData = Array.isArray(data) ? data : data.data || [];
      if (leaderboardData.length === 0) {
        throw new Error('No data');
      }
      
      setLeaderboard(leaderboardData); // ALL players
      setFilteredLeaderboard(leaderboardData);
      setLeaderboardLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // No mock fallback - show empty state for non-logged-in users
      setLeaderboard([]);
      setFilteredLeaderboard([]);
      setLeaderboardLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* HEADER - ELEGANT TIER 1 */}
      <header className="sticky top-0 z-[9999] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-purple-500/20 backdrop-blur-lg shadow-2xl shadow-purple-950/30">
        <div className="w-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          {/* LOGO - K698 INNOVATIVE TIER1 TEXT */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <h1 className="font-black text-lg sm:text-2xl bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight leading-none">k698</h1>
            <span className="text-purple-500/40 font-bold">●</span>
            <p className="text-xs sm:text-sm text-purple-400/80 font-semibold tracking-widest leading-none">{t('renaissance')}</p>
          </div>

          {/* LANGUAGE SELECTOR - TIER 1 ELEGANT */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-white font-bold text-xs hover:border-purple-500/60 hover:bg-purple-500/15 transition-all backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20"
            >
              <span className="text-sm sm:text-base">{language}</span>
            </button>

            {/* DROPDOWN MENU - TIER 1 ELEGANT */}
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2.5 bg-gradient-to-b from-slate-800/95 to-slate-900/95 border border-purple-500/30 rounded-lg shadow-2xl shadow-purple-900/40 z-50 min-w-40 backdrop-blur-xl overflow-hidden">
                {LANGUAGES.map((lang, idx) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-sm font-semibold transition-all text-center ${
                      idx !== 0 ? 'border-t border-purple-500/10' : ''
                    } ${
                      language === lang
                        ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-purple-500/10'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20 md:pb-24 px-4 text-center overflow-hidden">
        {/* GEOMETRIC BACKGROUND ELEMENTS */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 border border-purple-500/20 rounded-lg rotate-45 opacity-50"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 border border-blue-500/20 rounded-full opacity-50"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
            {t('headerBranding')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow">
            {t('headerSubtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <div className="h-1.5 w-32 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* GEOMETRIC SEPARATOR */}
      <section className="py-12 sm:py-16 md:py-24 px-4 border-y border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 sm:gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg md:rounded-xl opacity-20 hover:opacity-50 transition-all cursor-pointer shadow-lg shadow-purple-600/30"
                style={{
                  animation: `pulse ${2 + i * 0.15}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SPIRITUAL POWER SECTION */}
      <section className="py-12 sm:py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-12 sm:mb-16 md:mb-20 text-center tracking-tight drop-shadow">
            {t('spiritualPowerTitle')}
          </h2>
          
          {/* BANNER - GLASSMORPHISM ELEGANTE */}
          <div className="mb-16 sm:mb-20 md:mb-28 bg-gradient-to-r from-slate-800/40 via-slate-900/40 to-slate-800/40 border border-red-500/60 rounded-xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-2xl shadow-red-600/20">
            <div className="flex items-start gap-4 sm:gap-5 md:gap-6">
              {/* PREMIUM SVG ICON */}
              <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 20h20L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="text-red-500"/>
                <circle cx="12" cy="16" r="1" fill="currentColor" className="text-red-500"/>
                <line x1="12" y1="8" x2="12" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-red-500"/>
              </svg>
              <p className="text-sm sm:text-base md:text-lg text-slate-100 font-semibold leading-relaxed">
                {t('spiritualPowerBanner')}
              </p>
            </div>
          </div>

          {/* MOBILE: STACK + SCROLL TABS / DESKTOP: TABS LEFT + CONTENT RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* TABS */}
            <div className="order-2 lg:order-1 lg:sticky lg:top-[80px] h-fit w-full lg:w-auto">
              <div className="flex flex-nowrap gap-2 lg:flex-col lg:gap-3 w-full lg:w-auto overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {(Object.entries(TAB_DATA) as [TabType, typeof TAB_DATA['guard']][]).map(([tabKey, tabInfo]) => (
                  <button
                    key={tabKey}
                    onClick={() => setActiveTab(tabKey as TabType)}
                    className={`flex-1 lg:flex-none px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap lg:whitespace-normal ${
                      activeTab === tabKey
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                    }`}
                  >
                    <div className="truncate lg:truncate-none">{t(tabInfo.title)}</div>
                    {tabKey === 'coa' && (
                      <div className="text-xs text-amber-300 font-black">✦ {t('newBadge')} ✦</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTENT */}
            <div className="order-1 lg:order-2 lg:col-span-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/40 rounded-lg md:rounded-2xl p-4 sm:p-5 md:p-8 lg:p-12 backdrop-blur w-full overflow-hidden min-h-[600px] sm:min-h-[700px] md:min-h-[500px]">
              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-start w-full h-full">
                {/* DESCRIPTION & LIST - FULL WIDTH */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6 w-full">
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-black text-white mb-3 sm:mb-4">
                      {t(TAB_DATA[activeTab].descKey)}
                    </h3>
                    <div className="h-0.5 sm:h-1 w-10 sm:w-12 md:w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                  </div>

                  <p className="text-sm sm:text-base md:text-base text-slate-300 leading-7">
                    {t(TAB_DATA[activeTab].contentKey)}
                  </p>

                  <ul className="space-y-3 sm:space-y-4 md:space-y-4 w-full">
                    {TAB_DATA[activeTab].list.map((key, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-slate-200 text-sm sm:text-base md:text-base leading-6 w-full">
                        <span className="text-purple-400 font-black text-lg sm:text-xl flex-shrink-0 mt-0.5">▸</span>
                        <span className="word-wrap break-words leading-7">{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* IMAGE - SMALLER */}
                <div className="relative w-full max-w-lg mx-auto aspect-video bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg md:rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-600/30">
                  <Image
                    src={TAB_DATA[activeTab].image}
                    alt={t(TAB_DATA[activeTab].title)}
                    fill
                    className="object-contain bg-slate-900"
                    priority={activeTab === 'guard'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEPARATOR */}
      <div className="h-px sm:h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-8 sm:my-12 md:my-16"></div>

      {/* EVENTS SECTION - BACKGROUND CHANGE */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900/50 via-purple-900/30 to-slate-950">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 sm:mb-4 text-center tracking-tight drop-shadow">
            {t('eventsTitle')}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-purple-300 mb-12 sm:mb-14 md:mb-16 text-center font-bold drop-shadow">
            {t('eventsSubtitle')}
          </p>
          <p className="text-sm sm:text-base text-slate-300 mb-12 sm:mb-16 md:mb-20 text-center max-w-3xl mx-auto leading-relaxed">
            {t('eventsContext')}
          </p>

          {/* 5 STEPS GRID */}
          <div className="space-y-6 sm:space-y-8">
            {/* STEP 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-lg p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('eventStep1Title')}</h3>
                    <p className="text-sm sm:text-base text-slate-300">{t('eventStep1Desc')}</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 relative w-full aspect-video bg-slate-700 rounded-lg overflow-hidden border border-purple-500/20">
                <Image src="/equipaggiamento.png" alt="Equipment" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </div>

            {/* STEP 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-lg p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('eventStep2Title')}</h3>
                    <p className="text-sm sm:text-base text-slate-300">{t('eventStep2Desc')}</p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 relative w-full aspect-video bg-slate-700 rounded-lg overflow-hidden border border-purple-500/20">
                <Image src="/parti-della-nave.png" alt="Ship Parts" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </div>

            {/* STEP 3 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-lg p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('eventStep3Title')}</h3>
                  <p className="text-sm sm:text-base text-slate-300">{t('eventStep3Desc')}</p>
                </div>
              </div>
            </div>

            {/* STEP 4 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-lg p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('eventStep4Title')}</h3>
                  <p className="text-sm sm:text-base text-slate-300">{t('eventStep4Desc')}</p>
                </div>
              </div>
            </div>

            {/* STEP 5 */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-lg p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-black text-white text-lg flex-shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('eventStep5Title')}</h3>
                  <p className="text-sm sm:text-base text-slate-300">{t('eventStep5Desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD SECTION - INLINE */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow">
                {t('leaderboardTitle')}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">{t('leaderboardDesc')}</p>
            </div>
            {isLoggedIn && (
              <button
                onClick={fetchLeaderboard}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm sm:text-base"
              >
                {t('refreshLeaderboard')}
              </button>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="space-y-6">
               {/* INFO BOX - KVK RULES */}
               <div className="bg-gradient-to-br from-orange-600/10 to-red-600/10 border border-orange-500/40 rounded-lg p-5 sm:p-6">
                 <div className="flex items-start gap-4">
                   <div className="text-2xl flex-shrink-0">⚠️</div>
                   <div>
                     <h3 className="font-bold text-white text-lg mb-2">{t('kvkWarningTitle')}</h3>
                     <p className="text-slate-300 text-sm leading-relaxed">
                       {t('kvkWarningMessage')}
                     </p>
                   </div>
                 </div>
               </div>

              {/* LOGIN PROMPT */}
              <div className="text-center py-12">
                <p className="text-slate-300 mb-6 text-lg font-semibold">{t('loginToView')}</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
                  >
                    {t('signIn')}
                  </button>
                  <button 
                    onClick={() => setShowRegisterModal(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                  >
                    {t('signUp')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* SEARCH BAR */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by nickname..."
                  value={leaderboardSearch}
                  onChange={(e) => setLeaderboardSearch(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/30 transition"
                />
                <svg className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

          {/* SCROLLABLE TABLE */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/40 rounded-lg overflow-hidden max-h-[600px] overflow-y-auto custom-scrollbar">
            {leaderboardLoading ? (
              <div className="py-16 text-center text-slate-400">{t('leaderboardDesc')}</div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                No players found matching &quot;{leaderboardSearch}&quot;
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredLeaderboard.map((entry) => {
                  const lastUpdate = entry.castles[0]?.lastPowerUpdate 
                    ? new Date(entry.castles[0].lastPowerUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '-';
                  const hasScreenshot = entry.castles.some(c => c.screenshotUrl);

                  return (
                    <div
                      key={entry.id}
                      className="p-2.5 rounded-lg border bg-slate-800/40 border-slate-700/50 transition-all duration-300 hover:bg-slate-800/60 hover:border-purple-500/50 overflow-hidden"
                    >
                      {/* ROW 1: RANK + NAME + SCREENSHOT + DATE */}
                      <div className="flex items-center justify-between gap-2 mb-1.5 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <div className="w-7 h-7 rounded flex items-center justify-center font-bold text-xs bg-slate-700/50 text-slate-300 flex-shrink-0">
                            #{entry.rank}
                          </div>
                          <p className="font-semibold text-white truncate text-xs sm:text-sm">
                            {entry.nickname}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0 text-xs">
                          {/* SCREENSHOT STATUS */}
                          <span className={`font-bold ${hasScreenshot ? 'text-green-400' : 'text-red-400'}`}>
                            {hasScreenshot ? '✓' : '✗'}
                          </span>

                          {/* LAST UPDATED */}
                          <span className="text-slate-400 whitespace-nowrap text-xs">
                            {lastUpdate}
                          </span>
                        </div>
                      </div>

                      {/* ROW 2: POWER VALUES + PROGRESS */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {/* ATTUALE */}
                        <div className="min-w-0">
                          <p className="text-slate-400 truncate text-xs">Attuale</p>
                          <p className="font-bold text-blue-400 truncate">
                            {(entry.totalCurrentPower / 1000).toFixed(0)}k
                          </p>
                        </div>

                        {/* STORICO */}
                        <div className="min-w-0">
                          <p className="text-slate-400 truncate text-xs">Storico</p>
                          <p className="font-bold text-green-400 truncate">
                            {(entry.totalHistoricalPower / 1000).toFixed(0)}k
                          </p>
                        </div>

                        {/* PROGRESS */}
                        <div className="min-w-0">
                          <p className="text-slate-400 truncate text-xs">Progress</p>
                          <div className="h-1 bg-slate-700/30 rounded-full overflow-hidden mt-0.5">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                              style={{
                                width: `${Math.min((entry.totalCurrentPower / entry.totalHistoricalPower) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RESULTS COUNT */}
           {/* RESULTS COUNT */}
           <div className="text-sm text-slate-400 text-right">
             Showing {filteredLeaderboard.length} of {leaderboard.length} players
           </div>
            </div>
          )}
        </div>
      </section>

      <footer className="relative z-[30] py-6 sm:py-8 md:py-12 px-4 text-center border-t border-purple-500/20 bg-slate-950">
        {/* COPYRIGHT */}
        <p className="text-xs sm:text-sm text-slate-500">© {new Date().getFullYear()} k698 · {t('copyright')}</p>
        <p className="text-xs text-slate-600 mt-2">Guns of Glory Kingdom Manager</p>
      </footer>

      {/* ACCOUNT SHEET PLACEHOLDER */}
      {showAccountSheet && isLoggedIn && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowAccountSheet(false)}>
          <div
            className="fixed bottom-0 left-0 right-0 bg-slate-900 rounded-t-2xl border-t border-purple-500/20 p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-white mb-6">{t('myKingdom')}</h2>
              
              <div className="space-y-6">
                {/* CLOSE BUTTON */}
                <button
                  onClick={() => setShowAccountSheet(false)}
                  className="absolute top-6 right-6 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* MY CASTLES SECTION */}
                <div className="border-b border-slate-700 pb-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span>🏰 {t('myCastles')}</span>
                    <span className="text-sm bg-purple-600 text-white px-2 py-1 rounded">0</span>
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">Add and manage your kingdom castles</p>
                  <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">
                    + Add Castle
                  </button>
                </div>

                {/* ACCOUNT SETTINGS */}
                <div className="border-b border-slate-700 pb-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    ⚙️ {t('settings')}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* EMAIL */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                        📧 {t('email')}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="your@email.com"
                          className="flex-1 px-3 py-2 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                        />
                        <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm">
                          {t('save')}
                        </button>
                      </div>
                    </div>

                    {/* PASSWORD */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                        🔐 {t('changePassword')}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          placeholder="New password"
                          className="flex-1 px-3 py-2 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                        />
                        <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm">
                          {t('save')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LOGOUT BUTTON */}
                <button
                  onClick={() => {
                    // Logout logic here
                    setIsLoggedIn(false);
                    setShowAccountSheet(false);
                  }}
                  className="w-full px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 rounded-lg font-semibold transition"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowLoginModal(false)}>
          <div
            className="bg-slate-900/95 border border-purple-500/20 rounded-2xl p-6 sm:p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">{t('loginTitle')}</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              const email = new FormData(e.currentTarget).get('email') as string;
              const password = new FormData(e.currentTarget).get('password') as string;
              
              setAuthLoading(true);
              setAuthError('');
              
              try {
                const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password }),
                });
                
                const data = await res.json();
                
                if (!res.ok) {
                  setAuthError(data.error || 'Login failed');
                  return;
                }
                
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsLoggedIn(true);
                setShowLoginModal(false);
              } catch (err) {
                setAuthError('An error occurred. Please try again.');
              } finally {
                setAuthLoading(false);
              }
            }} className="space-y-4">
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
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">{t('changePassword')}</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-lg font-bold transition"
              >
                {authLoading ? 'Signing in...' : t('signIn')}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-4">
              {t('dontHaveAccount')}{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegisterModal(true);
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                {t('signUp')}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowRegisterModal(false)}>
          <div
            className="bg-slate-900/95 border border-purple-500/20 rounded-2xl p-6 sm:p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">{t('registerTitle')}</h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const nickname = fd.get('nickname') as string;
              const email = fd.get('email') as string;
              const password = fd.get('password') as string;
              
              setAuthLoading(true);
              setAuthError('');
              
              try {
                const res = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nickname, email, password }),
                });
                
                const data = await res.json();
                
                if (!res.ok) {
                  setAuthError(data.error || 'Registration failed');
                  return;
                }
                
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setIsLoggedIn(true);
                setShowRegisterModal(false);
              } catch (err) {
                setAuthError('An error occurred. Please try again.');
              } finally {
                setAuthLoading(false);
              }
            }} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300"
                  >
                    {showLoginPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 5C7 5 2.73 8.11 1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54C21.27 8.11 17 5 12 5m0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.83 9L15.5 12.67c.04-.3.07-.59.07-.67C15.57 11.14 14.43 10 13 10c-.36 0-.69.08-1.17.17zM19.08 15.54c.33-.67.54-1.42.54-2.54 0-3.97-3.03-7-7-7-1.12 0-1.87.21-2.54.54l1.81 1.81c.71-.38 1.53-.6 2.73-.6 2.76 0 5 2.24 5 5 0 1.2-.22 2.02-.6 2.73l1.6 1.6zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.69c1.73 4.39 6 7.54 11 7.54 1.69 0 3.32-.27 4.84-.75l2.85 2.85c.36.36.93.36 1.29 0 .36-.36.36-.93 0-1.29L3.29 2.58c-.36-.36-.93-.36-1.29 0-.37.36-.37.92.01 1.29zm7.78-4.28c5.05 0 9.27 3.19 11 7.54-1.73 4.39-6 7.54-11 7.54-1.69 0-3.32-.27-4.84-.75l2.85 2.85c.36.36.93.36 1.29 0 .36-.36.36-.93 0-1.29L3.29 2.58c-.36-.36-.93-.36-1.29 0-.37.36-.37.92.01 1.29zm7.5 6.85c0 .67-.54 1.21-1.21 1.21-.67 0-1.21-.54-1.21-1.21s.54-1.21 1.21-1.21 1.21.54 1.21 1.21z" />
                      </svg>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 mt-2"
                >
                  Forgot password?
                </button>
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
                    type={showRegisterPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300"
                  >
                    {showRegisterPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 5C7 5 2.73 8.11 1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54C21.27 8.11 17 5 12 5m0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.83 9L15.5 12.67c.04-.3.07-.59.07-.67C15.57 11.14 14.43 10 13 10c-.36 0-.69.08-1.17.17zM19.08 15.54c.33-.67.54-1.42.54-2.54 0-3.97-3.03-7-7-7-1.12 0-1.87.21-2.54.54l1.81 1.81c.71-.38 1.53-.6 2.73-.6 2.76 0 5 2.24 5 5 0 1.2-.22 2.02-.6 2.73l1.6 1.6zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.69c1.73 4.39 6 7.54 11 7.54 1.69 0 3.32-.27 4.84-.75l2.85 2.85c.36.36.93.36 1.29 0 .36-.36.36-.93 0-1.29L3.29 2.58c-.36-.36-.93-.36-1.29 0-.37.36-.37.92.01 1.29zm7.78-4.28c5.05 0 9.27 3.19 11 7.54-1.73 4.39-6 7.54-11 7.54-1.69 0-3.32-.27-4.84-.75l2.85 2.85c.36.36.93.36 1.29 0 .36-.36.36-.93 0-1.29L3.29 2.58c-.36-.36-.93-.36-1.29 0-.37.36-.37.92.01 1.29zm7.5 6.85c0 .67-.54 1.21-1.21 1.21-.67 0-1.21-.54-1.21-1.21s.54-1.21 1.21-1.21 1.21.54 1.21 1.21z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showRegisterConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 bg-slate-800/50 border border-purple-500/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterConfirm(!showRegisterConfirm)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-300"
                  >
                    {showRegisterConfirm ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 5C7 5 2.73 8.11 1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54C21.27 8.11 17 5 12 5m0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.83 9L15.5 12.67c.04-.3.07-.59.07-.67C15.57 11.14 14.43 10 13 10c-.36 0-.69.08-1.17.17zM19.08 15.54c.33-.67.54-1.42.54-2.54 0-3.97-3.03-7-7-7-1.12 0-1.87.21-2.54.54l1.81 1.81c.71-.38 1.53-.6 2.73-.6 2.76 0 5 2.24 5 5 0 1.2-.22 2.02-.6 2.73l1.6 1.6zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.69c1.73 4.39 6 7.54 11 7.54 1.69 0 3.32-.27 4.84-.75l2.85 2.85c.36.36.93.36 1.29 0 .36-.36.36-.93 0-1.29L3.29 2.58c-.36-.36-.93-.36-1.29 0-.37.36-.37.92.01 1.29zm7.78-4.28c5.05 0 9.27 3.19 11 7.54-1.73 4.39-6 7.54-11 7.54-1.69 0-3.32-.27-4.84-.75l2.85 2.85c.36.36.93.36 1.29 0 .36-.36.36-.93 0-1.29L3.29 2.58c-.36-.36-.93-.36-1.29 0-.37.36-.37.92.01 1.29zm7.5 6.85c0 .67-.54 1.21-1.21 1.21-.67 0-1.21-.54-1.21-1.21s.54-1.21 1.21-1.21 1.21.54 1.21 1.21z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-lg font-bold transition"
              >
                {authLoading ? 'Creating...' : t('signUp')}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-4">
              {t('alreadyHaveAccount')}{' '}
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setShowLoginModal(true);
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                {t('signIn')}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForgotModal(false)}>
          <div
            className="bg-slate-900/95 border border-purple-500/20 rounded-2xl p-6 sm:p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white">Reset Password</h2>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">
                {authError}
              </div>
            )}

            <p className="text-slate-300 text-sm mb-6">Enter your email address and we'll send you instructions to reset your password.</p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const email = new FormData(e.currentTarget).get('email') as string;
              setAuthLoading(true);
              setAuthError('');
              
              try {
                // TODO: implement password reset endpoint
                setAuthError('Password reset feature coming soon. Contact support.');
              } finally {
                setAuthLoading(false);
              }
            }} className="space-y-4">
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
                disabled={authLoading}
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-lg font-bold transition"
              >
                {authLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-4">
              Remember your password?{' '}
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setShowLoginModal(true);
                }}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.5;
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.6));
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(147, 51, 234, 0.8), rgba(59, 130, 246, 0.8));
        }
      `}</style>
    </div>
  );
}
