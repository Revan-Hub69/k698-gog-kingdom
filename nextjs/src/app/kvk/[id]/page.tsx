'use client';

import React, { useEffect, useState, useMemo } from 'react';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: { back:'← Indietro', available:'Disponibili', assigned:'Assegnati', remaining:'Rimanenti', players:'GIOCATORI', under100:'SOTTO 100M', noPlayers:'Nessun giocatore.', priority:'MAX', deaths:'Morti' },
  EN: { back:'← Back', available:'Available', assigned:'Assigned', remaining:'Remaining', players:'PLAYERS', under100:'UNDER 100M', noPlayers:'No players.', priority:'MAX', deaths:'Deaths' },
  PL: { back:'← Wróć', available:'Dostępne', assigned:'Przypisane', remaining:'Pozostałe', players:'GRACZE', under100:'POD 100M', noPlayers:'Brak graczy.', priority:'MAX', deaths:'Śmierci' },
  ZH: { back:'← 返回', available:'可用', assigned:'已分配', remaining:'剩余', players:'玩家', under100:'100M以下', noPlayers:'没有玩家。', priority:'优先', deaths:'死亡' },
  DE: { back:'← Zurück', available:'Verfügbar', assigned:'Zugewiesen', remaining:'Verbleibend', players:'SPIELER', under100:'UNTER 100M', noPlayers:'Keine Spieler.', priority:'MAX', deaths:'Tode' },
  FR: { back:'← Retour', available:'Disponibles', assigned:'Attribués', remaining:'Restants', players:'JOUEURS', under100:'MOINS 100M', noPlayers:'Aucun joueur.', priority:'MAX', deaths:'Morts' },
  RU: { back:'← Назад', available:'Доступно', assigned:'Назначено', remaining:'Осталось', players:'ИГРОКИ', under100:'НИЖЕ 100M', noPlayers:'Нет игроков.', priority:'MAX', deaths:'Смерти' },
  ES: { back:'← Volver', available:'Disponibles', assigned:'Asignados', remaining:'Restantes', players:'JUGADORES', under100:'MENOS 100M', noPlayers:'No hay jugadores.', priority:'MAX', deaths:'Muertes' },
};

interface Player { id: number; pos: number; name: string; score: number; notes: string | null; pack90: number; pack60: number; pack30: number; under100m: boolean }
interface KvkEvent { id: number; name: string; date: string; pack90Total: number; pack60Total: number; pack30Total: number; players: Player[] }

const PC = { '90': '#f87171', '60': '#fbbf24', '30': '#a78bfa' };

function PackBadges({ p90, p60, p30 }: { p90: number; p60: number; p30: number }) {
  const b: React.ReactNode[] = [];
  for (let i = 0; i < p90; i++) b.push(<span key={`9${i}`} style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: `${PC['90']}18`, color: PC['90'], border: `1px solid ${PC['90']}30` }}>90</span>);
  for (let i = 0; i < p60; i++) b.push(<span key={`6${i}`} style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: `${PC['60']}18`, color: PC['60'], border: `1px solid ${PC['60']}30` }}>60</span>);
  for (let i = 0; i < p30; i++) b.push(<span key={`3${i}`} style={{ fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 4, background: `${PC['30']}18`, color: PC['30'], border: `1px solid ${PC['30']}30` }}>30</span>);
  if (!b.length) return <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>—</span>;
  return <div style={{ display: 'flex', gap: 3 }}>{b}</div>;
}

export default function KvkEventPage() {
  const [id, setId] = useState('');
  const [lang, setLang] = useState<Lang>('IT');
  const [event, setEvent] = useState<KvkEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const t = (k: string) => T[lang]?.[k] || T['EN'][k] || k;

  useEffect(() => {
    const seg = window.location.pathname.split('/').pop() || '';
    setId(seg);
    const s = localStorage.getItem('lang') as Lang | null;
    if (s && LANGS.includes(s)) setLang(s);
    else { const br = navigator.language.split('-')[0].toUpperCase() as Lang; if (LANGS.includes(br)) setLang(br); }
    fetch(`/api/kvk/events/${seg}`).then(r => r.json()).then(d => { setEvent(d); setLoading(false); });
  }, []);

  const totals = useMemo(() => event?.players.reduce((s, p) => ({ p90: s.p90+p.pack90, p60: s.p60+p.pack60, p30: s.p30+p.pack30 }), { p90:0, p60:0, p30:0 }) ?? { p90:0, p60:0, p30:0 }, [event]);
  const rem = useMemo(() => event ? { p90: event.pack90Total-totals.p90, p60: event.pack60Total-totals.p60, p30: event.pack30Total-totals.p30 } : { p90:0, p60:0, p30:0 }, [event, totals]);

  const mainPlayers = useMemo(() => event?.players.filter(p => !p.under100m) ?? [], [event]);
  const under100 = useMemo(() => event?.players.filter(p => p.under100m) ?? [], [event]);
  const isPriority = (p: Player) => p.pack90 + p.pack60 + p.pack30 >= 3;

  const page: React.CSSProperties = { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', paddingBottom: 40 };

  if (loading) return <div style={{ ...page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>...</div>;
  if (!event || !event.id) return <div style={{ ...page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>Not found</div>;

  const StatBox = ({ label, p90, p60, p30, neg }: { label: string; p90: number; p60: number; p30: number; neg?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 0' }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 0.5, width: 72, flexShrink: 0 }}>{label}</span>
      {([['90',p90,PC['90']],['60',p60,PC['60']],['30',p30,PC['30']]] as const).map(([type,val,color]) => (
        <div key={type} style={{ flex: 1, textAlign: 'center', padding: '5px 0', borderRadius: 8, background: `${neg && val < 0 ? '#ef4444' : color}10`, border: `1px solid ${neg && val < 0 ? '#ef4444' : color}18` }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: neg && val < 0 ? '#ef4444' : color, lineHeight: 1 }}>{val}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>×{type}</div>
        </div>
      ))}
    </div>
  );

  const PlayerRow = ({ p, idx, under }: { p: Player; idx: number; under?: boolean }) => {
    const deaths = p.notes?.replace('morti: ', '');
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 12px',
        background: isPriority(p) ? 'rgba(124,58,237,0.1)' : idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
        borderLeft: isPriority(p) ? '3px solid rgba(124,58,237,0.5)' : '3px solid transparent',
        borderRadius: 0,
      }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', width: 24, flexShrink: 0, textAlign: 'right' }}>{p.pos}</span>
        <span style={{ fontSize: 13, fontWeight: isPriority(p) ? 700 : 500, color: under ? 'rgba(255,255,255,0.6)' : '#fff', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
        {p.score > 0 && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{(p.score/1e6 >= 1000 ? (p.score/1e9).toFixed(1)+'B' : (p.score/1e6).toFixed(0)+'M')}</span>}
        {deaths && <span style={{ fontSize: 10, color: 'rgba(248,113,113,0.5)', flexShrink: 0 }}>{Number(deaths) >= 1000 ? (Number(deaths)/1000).toFixed(1)+'B' : deaths+'M'} 💀</span>}
        <PackBadges p90={p.pack90} p60={p.pack60} p30={p.pack30} />
      </div>
    );
  };

  return (
    <div style={page}>
      <KvkHeader lang={lang} onLang={l => { setLang(l); localStorage.setItem('lang', l); }} backHref="/kvk" backLabel={t('back')} />

      <div style={{ padding: '14px 16px 6px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(0.95rem,4vw,1.3rem)', fontWeight: 900, margin: '0 0 2px', background: 'linear-gradient(135deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{event.name}</h1>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{event.date}</p>
      </div>

      {/* stats */}
      <div style={{ padding: '6px 16px 10px', maxWidth: 480, margin: '0 auto', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <StatBox label={t('available')} p90={event.pack90Total} p60={event.pack60Total} p30={event.pack30Total} />
        <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />
        <StatBox label={t('assigned')} p90={totals.p90} p60={totals.p60} p30={totals.p30} />
        <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />
        <StatBox label={t('remaining')} p90={rem.p90} p60={rem.p60} p30={rem.p30} neg />
      </div>

      {/* player list */}
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        {event.players.length === 0 && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '20px' }}>{t('noPlayers')}</p>}

        {mainPlayers.length > 0 && (
          <>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5, textTransform: 'uppercase', padding: '10px 16px 4px' }}>{t('players')} ({mainPlayers.length})</div>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', margin: '0 12px' }}>
              {mainPlayers.map((p, i) => <PlayerRow key={p.id} p={p} idx={i} />)}
            </div>
          </>
        )}

        {under100.length > 0 && (
          <>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.2)', letterSpacing: 1.5, textTransform: 'uppercase', padding: '14px 16px 4px' }}>{t('under100')} ({under100.length})</div>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', margin: '0 12px', opacity: 0.8 }}>
              {under100.map((p, i) => <PlayerRow key={p.id} p={p} idx={i} under />)}
            </div>
          </>
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.35);border-radius:2px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(124,58,237,0.6)}
        *{scrollbar-width:thin;scrollbar-color:rgba(124,58,237,0.35) transparent}
      `}</style>
    </div>
  );
}
