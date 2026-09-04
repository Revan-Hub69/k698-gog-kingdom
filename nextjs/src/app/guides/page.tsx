'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageProvider';

const LANGUAGES = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = typeof LANGUAGES[number];

const GUIDES: Array<{ slug: string; titleKey: string; descKey: string; icon: React.ReactNode }> = [
  { slug: 'guida-guardie', titleKey: 'guide.guardWeapons.title', descKey: 'guide.guardWeapons.desc', icon: '🛡️' },
  { slug: 'guida-curiosita', titleKey: 'guide.curiosities.title', descKey: 'guide.curiosities.desc', icon: '🔮' },
  { slug: 'guida-herbarzi', titleKey: 'guide.herbarzi.title', descKey: 'guide.herbarzi.desc', icon: '🏰' },
  { slug: 'guida-eventi', titleKey: 'guide.events.title', descKey: 'guide.events.desc', icon: '🎪' },
];

export default function GuidesIndexPage() {
  const { language, setLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    if (LANGUAGES.includes(browserLang as typeof LANGUAGES[0])) {
      setLanguage(browserLang as typeof LANGUAGES[0]);
    }
  }, [setLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-[9999] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-purple-500/20 backdrop-blur-lg shadow-2xl shadow-purple-950/30">
        <div className="w-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-shrink-0">
            <h1 className="font-black text-lg sm:text-2xl bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight leading-none">k698</h1>
            <span className="text-purple-500/40 font-bold">&#x25CF;</span>
            <p className="text-xs sm:text-sm text-purple-400/80 font-semibold tracking-widest leading-none">{t('renaissance')}</p>
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-purple-500/40 bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-white font-bold text-xs hover:border-purple-500/60 transition-all backdrop-blur-sm"
            >
              <span className="text-sm sm:text-base">{language}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2.5 bg-gradient-to-b from-slate-800/95 to-slate-900/95 border border-purple-500/30 rounded-lg shadow-2xl z-50 min-w-40 backdrop-blur-xl overflow-hidden">
                {LANGUAGES.map((lang, idx) => (
                  <button key={lang} onClick={() => { setLanguage(lang); setDropdownOpen(false); }}
                    className={`w-full px-4 py-3 text-sm font-semibold transition-all text-center ${idx !== 0 ? 'border-t border-purple-500/10' : ''} ${language === lang ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white' : 'text-slate-300 hover:text-white hover:bg-purple-500/10'}`}>
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20 md:pb-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 border border-purple-500/20 rounded-lg rotate-45 opacity-50"></div>
          <div className="absolute bottom-1/4 left-1/3 w-32 h-32 border border-blue-500/20 rounded-full opacity-50"></div>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-8 tracking-tight drop-shadow-lg">
            {t('guides.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-10 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow">
            {t('guides.subtitle')}
          </p>
        </div>
      </section>

      {/* GUIDES GRID */}
      <section className="py-12 sm:py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GUIDES.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-6 sm:p-8 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 flex flex-col h-full">
                <div className="text-5xl mb-4">{guide.icon}</div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {t(guide.titleKey)}
                </h3>
                <p className="text-slate-300 leading-relaxed flex-1">
                  {t(guide.descKey)}
                </p>
                <div className="mt-auto pt-4 border-t border-purple-500/20">
                  <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">
                    {t('guides.readMore')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 sm:py-8 md:py-12 px-4 text-center border-t border-purple-500/20 bg-slate-950">
        <p className="text-xs sm:text-sm text-slate-500">{'©'} {new Date().getFullYear()} k698 {'\u00b7'} {t('copyright')}</p>
        <p className="text-xs text-slate-600 mt-2">Guns of Glory Kingdom Manager</p>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}