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

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 1, nickname: 'DragonSlayer', rank: 1, totalCastles: 3, totalCurrentPower: 850000, totalHistoricalPower: 920000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 2, nickname: 'ShadowKing', rank: 2, totalCastles: 4, totalCurrentPower: 780000, totalHistoricalPower: 890000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 3, nickname: 'PhoenixRisen', rank: 3, totalCastles: 2, totalCurrentPower: 720000, totalHistoricalPower: 850000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 4, nickname: 'IceWizard', rank: 4, totalCastles: 5, totalCurrentPower: 680000, totalHistoricalPower: 800000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 5, nickname: 'ThunderLord', rank: 5, totalCastles: 3, totalCurrentPower: 650000, totalHistoricalPower: 750000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 6, nickname: 'SilentAssassin', rank: 6, totalCastles: 2, totalCurrentPower: 620000, totalHistoricalPower: 720000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 7, nickname: 'IronFist', rank: 7, totalCastles: 4, totalCurrentPower: 590000, totalHistoricalPower: 680000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 8, nickname: 'MysticSeer', rank: 8, totalCastles: 3, totalCurrentPower: 560000, totalHistoricalPower: 650000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 9, nickname: 'FrostByte', rank: 9, totalCastles: 2, totalCurrentPower: 530000, totalHistoricalPower: 620000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 10, nickname: 'InfernoBlaze', rank: 10, totalCastles: 3, totalCurrentPower: 500000, totalHistoricalPower: 590000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 11, nickname: 'VoidWalker', rank: 11, totalCastles: 2, totalCurrentPower: 470000, totalHistoricalPower: 560000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 12, nickname: 'StormChaser', rank: 12, totalCastles: 4, totalCurrentPower: 440000, totalHistoricalPower: 530000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 13, nickname: 'SilverArrow', rank: 13, totalCastles: 3, totalCurrentPower: 410000, totalHistoricalPower: 500000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 14, nickname: 'EchoKnight', rank: 14, totalCastles: 2, totalCurrentPower: 380000, totalHistoricalPower: 470000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 15, nickname: 'LunaEclipse', rank: 15, totalCastles: 3, totalCurrentPower: 350000, totalHistoricalPower: 440000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 16, nickname: 'NovaStar', rank: 16, totalCastles: 2, totalCurrentPower: 320000, totalHistoricalPower: 410000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 17, nickname: 'CrimsonEdge', rank: 17, totalCastles: 4, totalCurrentPower: 290000, totalHistoricalPower: 380000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 18, nickname: 'AzureWind', rank: 18, totalCastles: 3, totalCurrentPower: 260000, totalHistoricalPower: 350000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 19, nickname: 'ObsidianSoul', rank: 19, totalCastles: 2, totalCurrentPower: 230000, totalHistoricalPower: 320000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
  { id: 20, nickname: 'VenomFang', rank: 20, totalCastles: 3, totalCurrentPower: 200000, totalHistoricalPower: 290000, castles: [{ lastPowerUpdate: '2026-08-27' }] },
];

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
      
      setLeaderboard(leaderboardData.slice(0, 20)); // Top 20
      setFilteredLeaderboard(leaderboardData.slice(0, 20));
      setLeaderboardLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard, using mock data:', error);
      // Always use mock data as fallback
      setLeaderboard(MOCK_LEADERBOARD);
      setFilteredLeaderboard(MOCK_LEADERBOARD);
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

          {/* SEARCH BAR */}
          <div className="relative mb-4">
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
          <div className="text-sm text-slate-400 text-right mt-4">
            Showing {filteredLeaderboard.length} of {leaderboard.length} players
          </div>
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
              <p className="text-slate-400">Account Sheet - Coming Soon</p>
            </div>
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
