'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageProvider';
import Link from 'next/link';

const LANGUAGES = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = typeof LANGUAGES[number];

// Guide content registry - add new guides here
const GUIDE_CONTENT: Record<string, { titleKey: string; sections: Array<{ id: string; titleKey: string; content: React.ReactNode }> }> = {
  'guida-guardie': {
    titleKey: 'guide.guardWeapons.title',
    sections: [
      { id: 'intro', titleKey: 'guide.guardWeapons.sections.intro.title', content: null },
      { id: 'cavalry', titleKey: 'guide.guardWeapons.sections.cavalry.title', content: null },
      { id: 'ranged', titleKey: 'guide.guardWeapons.sections.ranged.title', content: null },
      { id: 'infantry', titleKey: 'guide.guardWeapons.sections.infantry.title', content: null },
      { id: 'exceptions', titleKey: 'guide.guardWeapons.sections.exceptions.title', content: null },
    ],
  },
  'guida-curiosita': {
    titleKey: 'guide.curiosities.title',
    sections: [
      { id: 'intro', titleKey: 'guide.curiosities.sections.intro.title', content: null },
      { id: 'cavalry', titleKey: 'guide.curiosities.sections.cavalry.title', content: null },
      { id: 'ranged', titleKey: 'guide.curiosities.sections.ranged.title', content: null },
      { id: 'infantry', titleKey: 'guide.curiosities.sections.infantry.title', content: null },
    ],
  },
  'guida-herbarzi': {
    titleKey: 'guide.herbarzi.title',
    sections: [
      { id: 'intro', titleKey: 'guide.herbarzi.sections.intro.title', content: null },
      { id: 'cavalry', titleKey: 'guide.herbarzi.sections.cavalry.title', content: null },
      { id: 'ranged', titleKey: 'guide.herbarzi.sections.ranged.title', content: null },
      { id: 'infantry', titleKey: 'guide.herbarzi.sections.infantry.title', content: null },
    ],
  },
  'guida-eventi': {
    titleKey: 'guide.events.title',
    sections: [
      { id: 'intro', titleKey: 'guide.events.sections.intro.title', content: null },
      { id: 'step1', titleKey: 'guide.events.sections.step1.title', content: null },
      { id: 'step2', titleKey: 'guide.guide.events.step2.title', content: null },
      { id: 'step3', titleKey: 'guide.events.sections.step3.title', content: null },
      { id: 'step4', titleKey: 'guide.events.sections.step4.title', content: null },
      { id: 'step5', titleKey: 'guide.events.sections.step5.title', content: null },
    ],
  },
};

export default function GuidePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const guide = GUIDE_CONTENT[slug];
    if (guide && guide.sections.length > 0) {
      setActiveSection(guide.sections[0].id);
    }
    const browserLang = navigator.language.split('-')[0].toUpperCase();
    if (['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'].includes(browserLang)) {
      setLanguage(browserLang as typeof LANGUAGES[number]);
    }
  }, [slug, setLanguage]);

  const guide = GUIDE_CONTENT[slug];
  if (!guide) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Guida non trovata</h1>
          <Link href="/guides" className="text-purple-400 hover:underline">
            Torna alle guide
          </Link>
        </div>
      </div>
    );
  }

  const sections = guide.sections;
  const activeSectionData = sections.find(s => s.id === activeSection);

  // Extract first section as active by default
  useEffect(() => {
    if (!activeSection && sections.length > 0) {
      setActiveSection(sections[0].id);
    }
  }, [sections, activeSection]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-[9999] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-purple-500/20 backdrop-blur-lg shadow-2xl shadow-purple-950/30">
        <div className="w-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/guides" className="flex items-center gap-2 flex-shrink-0">
              <h1 className="font-black text-lg sm:text-2xl bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight leading-none">k698</h1>
              <span className="text-purple-500/40 font-bold">&#x25CF;</span>
            </Link>
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
                {['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'].map((lang, idx) => (
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
        </div>
        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            {t(guide.titleKey)}
          </h1>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-12 sm:py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto w-full">
          <div className="lg:grid lg:grid-cols-4 gap-8">
            {/* SIDEBAR - Table of Contents */}
            <aside className="lg:sticky lg:top-24 lg:self-start h-fit order-2 lg:order-1">
              <nav className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-4 sm:p-5 md:p-6 backdrop-blur w-full">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4">{t('guides.tableOfContents')}</h3>
                <ul className="space-y-2">
                  {guide.sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        }`}
                      >
                        {t(section.titleKey)}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* MAIN CONTENT */}
            <article className="order-2 lg:order-1 lg:col-span-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-2xl p-4 sm:p-5 md:p-8 lg:p-10 backdrop-blur w-full">
              {activeSectionData && (
                <div className="space-y-6 sm:space-y-8">
                  <header className="pb-6 border-b border-purple-500/20">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
                      {t(activeSectionData.titleKey)}
                    </h2>
                    <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                  </header>
                  <div className="prose prose-invert max-w-none prose-slate prose-headings:text-white prose-a:text-purple-400 no-prose">
                    {activeSectionData.content}
                  </div>
                </div>
              )}
              {(!activeSectionData || !activeSectionData.content) && (
                <div className="text-center py-16 text-slate-400">
                  <p>Contenuto in preparazione per questa sezione.</p>
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 sm:py-8 md:py-12 px-4 text-center border-t border-purple-500/20 bg-slate-950">
        <Link href="/guides" className="inline-block text-purple-400 hover:underline mb-4">
          ← {t('guides.backToIndex')}
        </Link>
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