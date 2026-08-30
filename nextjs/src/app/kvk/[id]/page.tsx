'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: { back: '← Lista eventi', available: 'Disponibili', assigned: 'Assegnati', remaining: 'Rimanenti', players: 'PRINCIPALI', under100: 'SOTTO 100M', noPlayers: 'Nessun giocatore.', priority: 'MAX' },
  EN: { back: '← Events', available: 'Available', assigned: 'Assigned', remaining: 'Remaining', players: 'PLAYERS', under100: 'UNDER 100M', noPlayers: 'No players.', priority: 'MAX' },
  PL: { back: '← Lista', available: 'Dostępne', assigned: 'Przypisane', remaining: 'Pozostałe', players: 'GRACZE', under100: 'POD 100M', noPlayers: 'Brak graczy.', priority: 'MAX' },
  ZH: { back: '← 返回', available: '可用', assigned: '已分配', remaining: '剩余', players: '玩家', under100: '100M以下', noPlayers: '没有玩家。', priority: '优先' },
  DE: { back: '← Zurück', available: 'Verfügbar', assigned: 'Zugewiesen', remaining: 'Verbleibend', players: 'SPIELER', under100: 'UNTER 100M', noPlayers: 'Keine Spieler.', priority: 'MAX' },
  FR: { back: '← Retour', available: 'Disponibles', assigned: 'Attribués', remaining: 'Restants', players: 'JOUEURS', under100: 'MOINS 100M', noPlayers: 'Aucun joueur.', priority: 'MAX' },
  RU: { back: '← Назад', available: 'Доступно', assigned: 'Назначено', remaining: 'Осталось', players: 'ИГРОКИ', under100: 'НИЖЕ 100M', noPlayers: 'Нет игроков.', priority: 'MAX' },
  ES: { back: '← Volver', available: 'Disponibles', assigned: 'Asignados', remaining: 'Restantes', players: 'JUGADORES', under100: 'MENOS 100M', noPlayers: 'No hay jugadores.', priority: 'MAX' },
};

interface Player { id: number; pos: number; name: string; score: number; pack90: number; pack60: number; pack30: number; under100m: boolean }
interface KvkEvent { id: number; name: string; date: string; pack90Total: number; pack60Total: number; pack30Total: number; isActive: boolean; players: Player[] }

const PACK_COLOR = { '90': '#f87171', '60': '#fbbf24', '30': '#a78bfa' };

function PackBadges({ p90, p60, p30 }: { p90: number; p60: number; p30: number }) {
  const badges: React.ReactNode[] = [];
  for (let i = 0; i < p90; i++) badges.push(<span key={`90-${i}`} style={{ fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: `${PACK_COLOR['90']}18`, color: PACK_COLOR['90'], border: `1px solid ${PACK_COLOR['90']}30` }}>90</span>);
  for (let i = 0; i < p60; i++) badges.push(<span key={`60-${i}`} style={{ fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: `${PACK_COLOR['60']}18`, color: PACK_COLOR['60'], border: `1px solid ${PACK_COLOR['60']}30` }}>60</span>);
  for (let i = 0; i < p30; i++) badges.push(<span key={`30-${i}`} style={{ fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: `${PACK_COLOR['30']}18`, color: PACK_COLOR['30'], border: `1px solid ${PACK_COLOR['30']}30` }}>30</span>);
  if (badges.length === 0) return <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>—</span>;
  return <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>{badges}</div>;
}

function StatRow({ label, p90, p60, p30, neg }: { label: string; p90: number; p60: number; p30: number; neg?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, width: 70, flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', gap: 6, flex: 1 }}>
        {([['90', p90, PACK_COLOR['90']], ['60', p60, PACK_COLOR['60']], ['30', p30, PACK_COLOR['30']]] as const).map(([type, val, color]) => (
          <div key={type} style={{ flex: 1, textAlign: 'center', padding: '6px 4px', borderRadius: 8, background: `${neg && val < 0 ? '#ef4444' : color}10`, border: `1px solid ${neg && val < 0 ? '#ef4444' : color}20` }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: neg && val < 0 ? '#ef4444' : color }}>{val}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>×{type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KvkEventPage() {
  const params = useParams();
  const id = params?.id as string;
  const [lang, setLang] = useState<Lang>('IT');
  const [event, setEvent] = useState<KvkEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const t = (k: string) => T[lang]?.[k] || T['EN'][k] || k;

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored && LANGS.includes(stored)) setLang(stored);
    else { const br = navigator.language.split('-')[0].toUpperCase() as Lang; if (LANGS.includes(br)) setLang(br); }
    fetch(`/api/kvk/events/${id}`).then(r => r.json()).then(d => { setEvent(d); setLoading(false); });
  }, [id]);

  const totals = useMemo(() => {
    if (!event) return { p90: 0, p60: 0, p30: 0 };
    return event.players.reduce((s, p) => ({ p90: s.p90 + p.pack90, p60: s.p60 + p.pack60, p30: s.p30 + p.pack30 }), { p90: 0, p60: 0, p30: 0 });
  }, [event]);

  const remaining = useMemo(() => event ? {
    p90: event.pack90Total - totals.p90,
    p60: event.pack60Total - totals.p60,
    p30: event.pack30Total - totals.p30,
  } : { p90: 0, p60: 0, p30: 0 }, [event, totals]);

  const mainPlayers = useMemo(() => event?.players.filter(p => !p.under100m) ?? [], [event]);
  const under100Players = useMemo(() => event?.players.filter(p => p.under100m) ?? [], [event]);
  const isPriority = (p: Player) => p.pack90 + p.pack60 + p.pack30 >= 3;

  if (loading) return <div style={{ minHeight: '100vh', background: '#09090a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'sans-serif' }}>...</div>;
  if (!event) return <div style={{ minHeight: '100vh', background: '#09090a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontFamily: 'sans-serif' }}>Not found</div>;

  const page: React.CSSProperties = { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', paddingBottom: 40 };
  const rowStyle = (priority: boolean, under: boolean): React.CSSProperties => ({
    padding: '11px 14px', borderRadius: 12, marginBottom: 4,
    background: priority ? 'rgba(124,58,237,0.12)' : under ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${priority ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)'}`,
  });

  return (
    <div style={page}>
      <KvkHeader lang={lang} onLang={l => { setLang(l); localStorage.setItem('lang', l); }} backHref="/kvk" backLabel={t('back')} />

      {/* title */}
      <div style={{ padding: '16px 16px 8px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1rem,4vw,1.4rem)', fontWeight: 900, margin: '0 0 3px', background: 'linear-gradient(135deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{event.name}</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{event.date}</p>
      </div>

      {/* stats */}
      <div style={{ padding: '8px 16px 12px', maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <StatRow label={t('available')} p90={event.pack90Total} p60={event.pack60Total} p30={event.pack30Total} />
        <StatRow label={t('assigned')} p90={totals.p90} p60={totals.p60} p30={totals.p30} />
        <StatRow label={t('remaining')} p90={remaining.p90} p60={remaining.p60} p30={remaining.p30} neg />
      </div>

      {/* player list */}
      <div style={{ padding: '0 12px', maxWidth: 560, margin: '0 auto' }}>
        {event.players.length === 0 && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>{t('noPlayers')}</p>}

        {mainPlayers.length > 0 && <>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, marginLeft: 2 }}>{t('players')} ({mainPlayers.length})</div>
          {mainPlayers.map(p => (
            <div key={p.id} style={rowStyle(isPriority(p), false)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', width: 22, flexShrink: 0 }}>#{p.pos}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                {isPriority(p) && <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', flexShrink: 0 }}>{t('priority')}</span>}
                {p.score > 0 && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{(p.score / 1e6).toFixed(0)}M</span>}
              </div>
              <div style={{ marginTop: 6, paddingLeft: 30 }}>
                <PackBadges p90={p.pack90} p60={p.pack60} p30={p.pack30} />
              </div>
            </div>
          ))}
        </>}

        {under100Players.length > 0 && <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, marginLeft: 2 }}>{t('under100')} ({under100Players.length})</div>
          {under100Players.map(p => (
            <div key={p.id} style={rowStyle(false, true)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', width: 22, flexShrink: 0 }}>#{p.pos}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', flex: 1 }}>{p.name}</span>
              </div>
              <div style={{ marginTop: 6, paddingLeft: 30 }}>
                <PackBadges p90={p.pack90} p60={p.pack60} p30={p.pack30} />
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
}
