'use client';

import React, { useState, useMemo } from 'react';

interface Player {
  pos: number;
  name: string;
  cat: 'C' | 'R' | 'N';
  p90: number;
  p60: number;
  p30: number;
  tot: number;
  priority?: boolean;
  under100?: boolean;
}

const PLAYERS: Player[] = [
  { pos: 1, name: 'Cymber', cat: 'C', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 2, name: 'Cristian', cat: 'C', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 3, name: 'Rasse', cat: 'C', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 4, name: 'Chucky', cat: 'C', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 5, name: 'Deb', cat: 'C', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 6, name: 'Revan', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 7, name: 'Abou', cat: 'C', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 8, name: 'Ivan', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 9, name: 'Hannibal', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 10, name: 'Raki', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 11, name: 'Martin', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 12, name: 'Grozman', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 13, name: 'Furioso', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 14, name: 'Dark', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 15, name: 'Vendetta', cat: 'R', p90: 0, p60: 2, p30: 0, tot: 2 },
  { pos: 16, name: 'Ahmed', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 17, name: 'Anek', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 18, name: 'H1', cat: 'N', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 19, name: 'Lumachina', cat: 'R', p90: 0, p60: 2, p30: 0, tot: 2 },
  { pos: 20, name: 'Sr Jonathan', cat: 'R', p90: 0, p60: 2, p30: 0, tot: 2 },
  { pos: 21, name: 'Moe', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 22, name: 'Dan', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 23, name: 'Little Deb', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 24, name: 'H3', cat: 'N', p90: 0, p60: 2, p30: 0, tot: 2 },
  { pos: 25, name: 'Tack', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 26, name: 'Berry', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 27, name: 'SuperAhmed', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 28, name: 'H2', cat: 'N', p90: 0, p60: 2, p30: 0, tot: 2 },
  { pos: 29, name: 'North', cat: 'N', p90: 0, p60: 2, p30: 0, tot: 2 },
  { pos: 30, name: 'Mr Blue', cat: 'R', p90: 0, p60: 2, p30: 0, tot: 2 },
  { pos: 31, name: 'Kungfupanda', cat: 'N', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 32, name: '{00f00}', cat: 'N', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 33, name: 'Ice', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 34, name: '[ff0000] Hi', cat: 'N', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 35, name: 'Martin Pobre', cat: 'N', p90: 1, p60: 1, p30: 0, tot: 2 },
  { pos: 36, name: 'Christian (bambino)', cat: 'N', p90: 1, p60: 2, p30: 0, tot: 3, priority: true },
  { pos: 37, name: 'Rinn', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 38, name: 'Adu', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 39, name: 'Belfasar', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 40, name: 'WSP', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 41, name: 'Vega', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 42, name: 'V', cat: 'N', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 43, name: 'Facu', cat: 'N', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 44, name: 'Bostik', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 45, name: 'Martin4', cat: 'N', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 46, name: 'Aragorn', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 47, name: 'Cristina', cat: 'R', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 48, name: 'Grix', cat: 'R', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 49, name: 'Smiling', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 50, name: 'monoloG', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 51, name: 'Middy', cat: 'R', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 52, name: 'Simon', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 53, name: 'SuperDracula', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 54, name: 'Lord Williams', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 55, name: 'South', cat: 'N', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 56, name: 'Martin2', cat: 'N', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 57, name: 'Angerfirst', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 58, name: 'Drinkle', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 59, name: 'Simon Farm', cat: 'N', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 60, name: 'Chance 2.0', cat: 'R', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 61, name: 'WaxWeazle', cat: 'R', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 62, name: 'Ichiro', cat: 'R', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 63, name: 'Giuann', cat: 'C', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 64, name: 'Mustafa (c48)', cat: 'N', p90: 1, p60: 1, p30: 1, tot: 3, priority: true },
  { pos: 65, name: 'Malfasar', cat: 'N', p90: 0, p60: 1, p30: 1, tot: 2 },
  { pos: 66, name: 'MylittlePony', cat: 'N', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 67, name: 'Draco', cat: 'R', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 68, name: 'Anzac Rag', cat: 'N', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 69, name: 'EvilEva', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 70, name: 'BlueMoon', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 71, name: 'Mipang', cat: 'N', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 72, name: 'Chance', cat: 'C', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 73, name: 'Blood Moon', cat: 'R', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 74, name: 'Nbah', cat: 'N', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 75, name: 'Varo', cat: 'N', p90: 0, p60: 0, p30: 2, tot: 2 },
  { pos: 76, name: 'The Alien', cat: 'N', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 77, name: 'West', cat: 'C', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 78, name: 'Geralt De Riva', cat: 'N', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 79, name: 'Ronin', cat: 'R', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 80, name: 'Lady Adia', cat: 'C', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 81, name: 'Shelby', cat: 'R', p90: 0, p60: 0, p30: 1, tot: 1 },
  { pos: 82, name: 'Victoria', cat: 'C', p90: 0, p60: 0, p30: 1, tot: 1, under100: true },
  { pos: 83, name: 'Saint', cat: 'N', p90: 0, p60: 0, p30: 1, tot: 1, under100: true },
  { pos: 84, name: 'Jani', cat: 'N', p90: 0, p60: 0, p30: 1, tot: 1, under100: true },
  { pos: 85, name: 'Lacy', cat: 'R', p90: 0, p60: 0, p30: 1, tot: 1, under100: true },
  { pos: 86, name: 'Jason', cat: 'N', p90: 0, p60: 0, p30: 1, tot: 1, under100: true },
  { pos: 87, name: 'Mustafa', cat: 'N', p90: 0, p60: 0, p30: 1, tot: 1, under100: true },
  { pos: 88, name: 'JoyBoy', cat: 'R', p90: 0, p60: 0, p30: 1, tot: 1, under100: true },
];

export default function KvkPackPage() {
  const [lang, setLang] = useState<'IT' | 'EN'>('IT');

  const mainPlayers = useMemo(() => PLAYERS.filter(p => !p.under100), []);
  const under100Players = useMemo(() => PLAYERS.filter(p => p.under100), []);

  const totals = useMemo(() => {
    const all = [...mainPlayers, ...under100Players];
    return {
      p90: all.reduce((s, p) => s + p.p90, 0),
      p60: all.reduce((s, p) => s + p.p60, 0),
      p30: all.reduce((s, p) => s + p.p30, 0),
      tot: all.reduce((s, p) => s + p.tot, 0),
    };
  }, [mainPlayers, under100Players]);

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      IT: {
        title: 'Assegnazione Pacchi KVK 30/08',
        main: 'PRINCIPALI',
        under100: 'SOTTO 100M PUNTI',
        packs: 'Pacchi',
        available: 'Disponibili',
        assigned: 'Assegnati',
      },
      EN: {
        title: 'KVK Package Assignment 30/08',
        main: 'MAIN',
        under100: 'UNDER 100M POINTS',
        packs: 'Packs',
        available: 'Available',
        assigned: 'Assigned',
      },
    };
    return dict[lang][key] || key;
  };

  const catColor = (cat: string) => {
    if (cat === 'C') return '#60a5fa';
    if (cat === 'R') return '#fbbf24';
    return 'rgba(255,255,255,0.35)';
  };

  const packBadges = (p90: number, p60: number, p30: number) => {
    const badges: React.ReactNode[] = [];
    const colors: Record<string, string> = { '90': '#f87171', '60': '#fbbf24', '30': '#a78bfa' };
    for (let i = 0; i < p90; i++) badges.push(<span key={`90-${i}`} style={{ fontSize: 12, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: `${colors['90']}18`, color: colors['90'], border: `1px solid ${colors['90']}30` }}>90</span>);
    for (let i = 0; i < p60; i++) badges.push(<span key={`60-${i}`} style={{ fontSize: 12, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: `${colors['60']}18`, color: colors['60'], border: `1px solid ${colors['60']}30` }}>60</span>);
    for (let i = 0; i < p30; i++) badges.push(<span key={`30-${i}`} style={{ fontSize: 12, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: `${colors['30']}18`, color: colors['30'], border: `1px solid ${colors['30']}30` }}>30</span>);
    return badges;
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* HEADER */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(9,9,10,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(124,58,237,0.15)',
        padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: '#fff',
          }}>k</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>698</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['IT', 'EN'].map(l => (
            <button key={l} onClick={() => setLang(l as 'IT' | 'EN')} style={{
              padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              background: lang === l ? 'linear-gradient(135deg, #7c3aed, #2563eb)' : 'rgba(255,255,255,0.06)',
              color: lang === l ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* TITLE */}
      <div style={{ padding: '20px 16px 16px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(1.1rem, 4.5vw, 1.5rem)', fontWeight: 900, color: '#fff',
          margin: 0, lineHeight: 1.2,
          background: 'linear-gradient(135deg, #c084fc, #60a5fa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>{t('title')}</h1>
      </div>

      {/* AVAILABLE PACKS */}
      <div style={{ padding: '0 12px 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap',
          padding: '10px 16px', borderRadius: 12,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('available')}:</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#f87171' }}>3×90</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24' }}>33×60</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa' }}>140×30</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>=</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>176</span>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div style={{ padding: '0 12px' }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4,
        }}>{t('main')} ({mainPlayers.length})</div>

        {mainPlayers.map(p => (
          <div key={p.pos} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 12, marginBottom: 4,
            background: p.priority ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${p.priority ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', width: 24, flexShrink: 0 }}>
                {p.pos}
              </span>
              <span style={{
                fontSize: 14, fontWeight: 600, color: '#fff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{p.name}</span>
              {p.priority && (
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 4,
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)', color: '#fff', flexShrink: 0,
                }}>MAX</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 8 }}>
              {packBadges(p.p90, p.p60, p.p30)}
            </div>
          </div>
        ))}
      </div>

      {/* UNDER 100M SECTION */}
      <div style={{ padding: '20px 12px 0' }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)',
          letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4,
        }}>{t('under100')} ({under100Players.length})</div>

        {under100Players.map(p => (
          <div key={p.pos} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 12, marginBottom: 4,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', width: 24, flexShrink: 0 }}>
                {p.pos}
              </span>
              <span style={{
                fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{p.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0, marginLeft: 8 }}>
              {packBadges(p.p90, p.p60, p.p30)}
            </div>
          </div>
        ))}
      </div>

      {/* TOTALS */}
      <div style={{ padding: '24px 12px 40px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderRadius: 12,
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
        }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('assigned')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f87171' }}>{totals.p90}×90</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fbbf24' }}>{totals.p60}×60</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#a78bfa' }}>{totals.p30}×30</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>=</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{totals.tot}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
