'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/LanguageProvider';

const LANGUAGES = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;

export default function HomePage() {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'guard' | 'curiosities' | 'coa'>('guard');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-[999] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-purple-500/20 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO & BRANDING */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center font-black text-white">
              K
            </div>
            <div>
              <h1 className="font-black text-lg text-white tracking-tight">k698</h1>
              <p className="text-xs text-purple-400">Kingdom Manager</p>
            </div>
          </div>

          {/* LANGUAGE SELECTOR */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            className="px-4 py-2 bg-slate-800/50 border border-purple-500/50 rounded-lg text-sm font-bold text-white hover:border-purple-400 transition-all cursor-pointer focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30"
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
      <section className="relative pt-24 pb-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {t('headerBranding')}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            {t('headerSubtitle')}
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* GEOMETRIC SEPARATOR */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg opacity-30 hover:opacity-50 transition-opacity"
                style={{
                  animation: `pulse ${2 + i * 0.1}s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SPIRITUAL POWER SECTION - 3 TABS */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-white mb-12 text-center">
            {t('spiritualPowerTitle')}
          </h2>

          {/* TAB BUTTONS */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setActiveTab('guard')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'guard'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t('guardWeapons')}
            </button>
            <button
              onClick={() => setActiveTab('curiosities')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'curiosities'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t('curiosities')}
            </button>
            <button
              onClick={() => setActiveTab('coa')}
              className={`px-6 py-3 rounded-lg font-bold transition-all relative ${
                activeTab === 'coa'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t('coatsOfArms')}
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-red-500 text-xs font-black px-2 py-1 rounded-full text-slate-900">
                {t('newBadge')}
              </span>
            </button>
          </div>

          {/* TAB CONTENT WITH IMAGES */}
          <div className="relative bg-slate-800/50 border border-purple-500/30 rounded-2xl p-8 backdrop-blur">
            {activeTab === 'guard' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">{t('guardWeapons')}</h3>
                <div className="relative w-full h-96 bg-slate-900 rounded-lg overflow-hidden">
                  <Image
                    src="/images/guard-weapons.png"
                    alt="Guard Weapons"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <p className="text-slate-300">{t('guardWeaponsStrategy')}</p>
              </div>
            )}
            {activeTab === 'curiosities' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">{t('curiosities')}</h3>
                <div className="relative w-full h-96 bg-slate-900 rounded-lg overflow-hidden">
                  <Image
                    src="/images/Curiosities.png"
                    alt="Curiosities"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-slate-300">{t('curiositiesManagement')}</p>
              </div>
            )}
            {activeTab === 'coa' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">{t('coatsOfArms')}</h3>
                <div className="relative w-full h-96 bg-slate-900 rounded-lg overflow-hidden">
                  <Image
                    src="/images/COA.png"
                    alt="Coats of Arms"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-slate-300">{t('coaNew')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EVENTS SECTION - Parallax Effect */}
      <section style={{ height: '200vh' }} className="relative pt-16">
        <div className="sticky top-[73px] h-screen z-50 overflow-auto bg-gradient-to-b from-slate-900 via-slate-950 to-black">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <h2 className="text-4xl font-black text-white mb-8">
              {t('eventsTitle')}
            </h2>
            <p className="text-xl text-slate-300 mb-12">
              {t('eventsDesc')}
            </p>

            <div className="space-y-8">
              <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4">{t('guardWeaponsStrategy')}</h3>
                <p className="text-slate-300 mb-3">{t('guardWeaponsContent')}</p>
                <ul className="text-slate-400 space-y-2 ml-4">
                  <li>• {t('equipStrategically')}</li>
                  <li>• {t('manageTroops')}</li>
                  <li>• {t('exceptionLeaders')}</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4">{t('curiositiesManagement')}</h3>
                <p className="text-slate-300 mb-3">{t('optimizeCollection')}</p>
                <ul className="text-slate-400 space-y-2 ml-4">
                  <li>• {t('collectCombine')}</li>
                  <li>• {t('trackPowerChanges')}</li>
                  <li>• {t('planLoadouts')}</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-amber-400 mb-4">⭐ {t('coaNew')}</h3>
                <p className="text-slate-300 mb-3">{t('newestFeature')}</p>
                <ul className="text-slate-400 space-y-2 ml-4">
                  <li>• {t('applyCoa')}</li>
                  <li>• {t('calculateImpact')}</li>
                  <li>• {t('maximizePerformance')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-[30] py-6 text-center text-xs text-slate-600 border-t border-white/5 bg-slate-950">
        © {new Date().getFullYear()} k698 · {t('copyright')}
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
