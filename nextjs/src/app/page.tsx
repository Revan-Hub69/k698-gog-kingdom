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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* HEADER - ELEGANT TIER 1 */}
      <header className="sticky top-0 z-[9999] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-purple-500/20 backdrop-blur-lg shadow-2xl shadow-purple-950/30">
        <div className="w-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          {/* LOGO - ELEGANT GEOMETRIC k698 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <svg className="w-9 h-9 sm:w-11 sm:h-11" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer circle */}
              <circle cx="20" cy="20" r="18" stroke="url(#grad)" strokeWidth="1.5" opacity="0.6"/>
              {/* Inner square rotated */}
              <rect x="8" y="8" width="24" height="24" stroke="url(#grad)" strokeWidth="1.5" transform="rotate(45 20 20)" opacity="0.8"/>
              {/* Center vertical line */}
              <line x1="20" y1="10" x2="20" y2="30" stroke="url(#grad)" strokeWidth="1.2" opacity="0.9"/>
              {/* Center horizontal line */}
              <line x1="10" y1="20" x2="30" y2="20" stroke="url(#grad)" strokeWidth="1.2" opacity="0.9"/>
              {/* Corner accents */}
              <circle cx="14" cy="14" r="1.5" fill="url(#grad)"/>
              <circle cx="26" cy="26" r="1.5" fill="url(#grad)"/>
              <circle cx="14" cy="26" r="1.5" fill="url(#grad)"/>
              <circle cx="26" cy="14" r="1.5" fill="url(#grad)"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#a855f7"/>
                  <stop offset="50%" stopColor="#7c3aed"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col">
              <h1 className="font-black text-xs sm:text-sm text-white tracking-widest leading-tight">k698</h1>
              <p className="text-xs text-purple-400 font-semibold tracking-wider">RENAISSANCE</p>
            </div>
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
          {/* PROJECT NAME PILL */}
          <div className="inline-block mb-6 sm:mb-8 md:mb-10">
            <div className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-full border border-purple-500/40 bg-gradient-to-r from-purple-500/15 via-purple-500/10 to-blue-500/15 backdrop-blur-md hover:border-purple-500/60 transition-all">
              <p className="text-xs sm:text-sm md:text-base text-purple-300 font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"></span>
                {t('projectName')}
              </p>
            </div>
          </div>
          
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
                <Image src="/images/guard-weapons.png" alt="Equipment" fill className="object-cover" />
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
                <Image src="/images/curiosities.png" alt="Ship Parts" fill className="object-cover" />
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

      {/* FAQ SECTION */}
      <section className="py-16 sm:py-20 md:py-24 px-4 bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-8 sm:mb-12 text-center tracking-tight">
            {t('faqTitle')}
          </h2>
          
          <div className="space-y-4 sm:space-y-6">
            {[
              { question: 'faq1Q', answer: 'faq1A' },
              { question: 'faq2Q', answer: 'faq2A' },
              { question: 'faq3Q', answer: 'faq3A' },
              { question: 'faq4Q', answer: 'faq4A' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-purple-500/20 rounded-lg p-5 sm:p-6"
              >
                <h3 className="text-base sm:text-lg font-bold text-purple-300 mb-2 sm:mb-3">
                  {t(item.question)}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {t(item.answer)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIPS & TRICKS SECTION */}
      <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-6 text-center tracking-tight">
            {t('tipsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mb-10 sm:mb-14 text-center max-w-2xl mx-auto">
            {t('tipsSubtitle')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: '⚡', titleKey: 'tip1Title', descKey: 'tip1Desc' },
              { icon: '🎯', titleKey: 'tip2Title', descKey: 'tip2Desc' },
              { icon: '📊', titleKey: 'tip3Title', descKey: 'tip3Desc' },
              { icon: '🔄', titleKey: 'tip4Title', descKey: 'tip4Desc' },
              { icon: '💡', titleKey: 'tip5Title', descKey: 'tip5Desc' },
              { icon: '⭐', titleKey: 'tip6Title', descKey: 'tip6Desc' },
            ].map((tip, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg p-5 sm:p-6 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl sm:text-3xl flex-shrink-0">{tip.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-purple-300 mb-1 sm:mb-2">
                      {t(tip.titleKey)}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {t(tip.descKey)}
                    </p>
                  </div>
                </div>
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
