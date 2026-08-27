'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageProvider';

const LANGUAGES = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;

type TabType = 'guard' | 'curiosities' | 'coa';

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

  // Auto-detect browser language
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    if (LANGUAGES.includes(browserLang as typeof LANGUAGES[0])) {
      setLanguage(browserLang as typeof LANGUAGES[0]);
    }
  }, [setLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-[999] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-purple-500/30 backdrop-blur">
        <div className="w-full px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          {/* LOGO - LEFT */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-white text-sm sm:text-lg shadow-lg shadow-purple-600/50">
              K
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-lg sm:text-xl text-white tracking-tight">k698</h1>
              <p className="text-xs text-purple-300">Kingdom Manager</p>
            </div>
          </div>

          {/* LANGUAGE DROPDOWN - RIGHT */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all"
            >
              <span>{language}</span>
              <span className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* DROPDOWN MENU */}
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-purple-500/50 rounded-lg shadow-2xl shadow-purple-600/30 z-50 min-w-32">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-all ${
                      language === lang
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
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
      <section className="relative py-12 sm:py-20 md:py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight drop-shadow-lg">
            {t('headerBranding')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-200 mb-6 sm:mb-10 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow">
            {t('headerSubtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <div className="h-1 sm:h-1.5 w-24 sm:w-32 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full"></div>
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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEPARATOR */}
      <div className="h-px sm:h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-8 sm:my-12 md:my-16"></div>

      {/* EVENTS SECTION */}
      <section className="py-12 sm:py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 md:mb-8 text-center tracking-tight drop-shadow">
            {t('eventsTitle')}
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-8 sm:mb-12 md:mb-16 text-center font-medium w-full">
            {t('eventsDesc')}
          </p>

          <div className="space-y-4 sm:space-y-6 w-full">
            {[
              {
                keyTitle: 'guardWeaponsStrategy',
                keyContent: 'guardWeaponsContent',
                keyList: ['equipStrategically', 'manageTroops', 'exceptionLeaders'],
                color: 'purple',
              },
              {
                keyTitle: 'curiositiesManagement',
                keyContent: 'optimizeCollection',
                keyList: ['collectCombine', 'trackPowerChanges', 'planLoadouts'],
                color: 'blue',
              },
              {
                keyTitle: 'coaNew',
                keyContent: 'newestFeature',
                keyList: ['applyCoa', 'calculateImpact', 'maximizePerformance'],
                color: 'amber',
                isNew: true,
              },
            ].map((section, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-${section.color}-500/40 rounded-lg md:rounded-xl p-4 sm:p-6 md:p-8 backdrop-blur w-full`}
              >
                <h3 className={`text-lg sm:text-xl md:text-2xl font-black text-${section.color}-300 mb-2 sm:mb-3 flex items-center gap-2`}>
                  {section.isNew && <span className="text-amber-400 text-2xl sm:text-3xl">⭐</span>}
                  {t(section.keyTitle)}
                </h3>
                <p className="text-slate-300 mb-3 sm:mb-4 text-sm sm:text-base">{t(section.keyContent)}</p>
                <ul className="space-y-1.5 sm:space-y-2 ml-2 w-full">
                  {section.keyList.map((key, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm">
                      <span className={`text-${section.color}-400 font-bold`}>◆</span>
                      <span className="word-wrap break-words">{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-[30] py-6 sm:py-8 md:py-12 px-4 text-center border-t border-purple-500/20 bg-slate-950">
        {/* COPYRIGHT */}
        <p className="text-xs sm:text-sm text-slate-500">© {new Date().getFullYear()} k698 · {t('copyright')}</p>
        <p className="text-xs text-slate-600 mt-2">Guns of Glory Kingdom Manager</p>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
