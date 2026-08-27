'use client';

import React, { useState } from 'react';
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
    contentKey: 'optimizeCollection',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-[999] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-purple-500/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-600/50">
              K
            </div>
            <div>
              <h1 className="font-black text-xl text-white tracking-tight">k698</h1>
              <p className="text-xs text-purple-300">Kingdom Manager</p>
            </div>
          </div>

          {/* LANGUAGE SELECTOR - DESKTOP BUTTONS */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">LANG:</span>
            <div className="inline-flex bg-slate-800/80 border border-purple-500/50 rounded-lg p-1 gap-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 text-xs font-black transition-all ${
                    language === lang
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* LANGUAGE SELECTOR - MOBILE SELECT */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            className="md:hidden px-2 py-1.5 bg-slate-800/80 border border-purple-500/50 rounded text-xs font-black text-white cursor-pointer focus:outline-none focus:border-purple-400"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-slate-900">
                {lang}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
            {t('headerBranding')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow">
            {t('headerSubtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <div className="h-1.5 w-32 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* GEOMETRIC SEPARATOR */}
      <section className="py-24 px-4 border-y-2 border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl opacity-20 hover:opacity-50 transition-all cursor-pointer shadow-lg shadow-purple-600/30"
                style={{
                  animation: `pulse ${2 + i * 0.15}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SPIRITUAL POWER SECTION - DESKTOP LAYOUT */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black text-white mb-16 text-center tracking-tight drop-shadow">
            {t('spiritualPowerTitle')}
          </h2>

          {/* DESKTOP: TABS LEFT + CONTENT RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* TABS (LEFT SIDE - STICKY) */}
            <div className="lg:sticky lg:top-[80px] h-fit space-y-3">
              {(Object.entries(TAB_DATA) as [TabType, typeof TAB_DATA['guard']][]).map(([tabKey, tabInfo]) => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey as TabType)}
                  className={`w-full px-6 py-4 rounded-xl font-bold text-left transition-all duration-300 ${
                    activeTab === tabKey
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl shadow-purple-500/50 scale-105'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                  }`}
                >
                  <div className="text-sm">{t(tabInfo.title)}</div>
                  {tabKey === 'coa' && (
                    <div className="text-xs text-amber-300 mt-1 font-black">✦ {t('newBadge')} ✦</div>
                  )}
                </button>
              ))}
            </div>

            {/* CONTENT (RIGHT SIDE) */}
            <div className="lg:col-span-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/40 rounded-2xl p-8 lg:p-12 backdrop-blur">
              {/* CONTENT GRID: Description Left + Image Right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* DESCRIPTION & LIST (LEFT) */}
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">
                      {t(TAB_DATA[activeTab].descKey)}
                    </h3>
                    <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                  </div>

                  <p className="text-slate-300 text-base leading-relaxed">
                    {t(TAB_DATA[activeTab].contentKey)}
                  </p>

                  <ul className="space-y-2.5">
                    {TAB_DATA[activeTab].list.map((key, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-slate-200 text-sm">
                        <span className="text-purple-400 font-black text-lg mt-0">▸</span>
                        <span>{t(key)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* IMAGE (RIGHT) */}
                <div className="lg:col-span-2 relative w-full aspect-video bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-600/30">
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
      <div className="h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-16"></div>

      {/* EVENTS SECTION */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-5xl font-black text-white mb-8 text-center tracking-tight drop-shadow">
            {t('eventsTitle')}
          </h2>
          <p className="text-2xl text-slate-200 mb-16 text-center font-medium">
            {t('eventsDesc')}
          </p>

          <div className="space-y-6">
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
                className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-${section.color}-500/40 rounded-xl p-8 backdrop-blur`}
              >
                <h3 className={`text-2xl font-black text-${section.color}-300 mb-3 flex items-center gap-2`}>
                  {section.isNew && <span className="text-amber-400 text-3xl">⭐</span>}
                  {t(section.keyTitle)}
                </h3>
                <p className="text-slate-300 mb-4 text-lg">{t(section.keyContent)}</p>
                <ul className="space-y-2 ml-2">
                  {section.keyList.map((key, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-200">
                      <span className={`text-${section.color}-400 font-bold`}>◆</span>
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-[30] py-12 text-center text-sm text-slate-500 border-t border-purple-500/20 bg-slate-950">
        <p>© {new Date().getFullYear()} k698 · {t('copyright')}</p>
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
