'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const LANGS = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
export type KvkLang = typeof LANGS[number];

interface Props {
  lang: KvkLang;
  onLang: (l: KvkLang) => void;
  backHref?: string;
  backLabel?: string;
}

export default function KvkHeader({ lang, onLang, backHref, backLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 9999,
      background: 'linear-gradient(90deg, #020617 0%, #0f172a 50%, #020617 100%)',
      borderBottom: '1px solid rgba(168,85,247,0.2)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 2px 32px rgba(88,28,220,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px' }}>
        {/* LEFT: logo + optional back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{
              fontWeight: 900, fontSize: 20,
              background: 'linear-gradient(90deg,#c084fc,#60a5fa,#c084fc)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px', lineHeight: 1,
            }}>k698</span>
          </Link>
          {backHref && (
            <>
              <span style={{ color: 'rgba(168,85,247,0.4)', fontWeight: 700 }}>•</span>
              <Link href={backHref} style={{ fontSize: 12, color: 'rgba(168,85,247,0.8)', textDecoration: 'none', fontWeight: 600 }}>
                {backLabel || '←'}
              </Link>
            </>
          )}
        </div>

        {/* RIGHT: lang dropdown */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              width: 42, height: 42, borderRadius: 10,
              border: '1px solid rgba(168,85,247,0.4)',
              background: 'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(37,99,235,0.1))',
              color: '#fff', fontWeight: 700, fontSize: 12,
              cursor: 'pointer', backdropFilter: 'blur(4px)',
            }}
          >{lang}</button>
          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'linear-gradient(180deg,rgba(30,41,59,0.97),rgba(15,23,42,0.97))',
              border: '1px solid rgba(168,85,247,0.3)',
              borderRadius: 10, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              zIndex: 100, minWidth: 100,
            }}>
              {LANGS.map((l, i) => (
                <button key={l} onClick={() => { onLang(l); setOpen(false); localStorage.setItem('lang', l); }} style={{
                  display: 'block', width: '100%', padding: '10px 16px',
                  textAlign: 'center', fontSize: 13, fontWeight: 600,
                  background: lang === l ? 'linear-gradient(90deg,rgba(124,58,237,0.3),rgba(37,99,235,0.3))' : 'transparent',
                  color: lang === l ? '#fff' : 'rgba(203,213,225,0.8)',
                  border: 'none', borderTop: i > 0 ? '1px solid rgba(168,85,247,0.08)' : 'none',
                  cursor: 'pointer',
                }}>{l}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
