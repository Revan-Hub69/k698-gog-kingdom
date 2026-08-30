'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: {
    title: 'Pacchi KVK', active: 'EVENTI ATTIVI', past: 'EVENTI PASSATI',
    newEvent: '+ Nuovo Evento KVK', noActive: 'Nessun evento attivo.', noPast: 'Nessun evento passato.',
    players: 'giocatori', packs: 'pacchi', isActive: 'Attivo', closed: 'Chiuso',
    create: 'Crea e Apri', cancel: 'Annulla', saving: 'Creazione...',
    packsLabel: 'Pacchi disponibili', playersLabel: 'Giocatori',
    playersHint: 'pos,nome,alleanza,punti,sotto100m(0/1),note — una per riga\nEsempio: 1,Cymber,k698,1500000000,0',
    playersHintShort: 'pos,nome,alleanza,punti,sotto100m,note',
  },
  EN: {
    title: 'KVK Packages', active: 'ACTIVE EVENTS', past: 'PAST EVENTS',
    newEvent: '+ New KVK Event', noActive: 'No active events.', noPast: 'No past events.',
    players: 'players', packs: 'packs', isActive: 'Active', closed: 'Closed',
    create: 'Create & Open', cancel: 'Cancel', saving: 'Creating...',
    packsLabel: 'Available packs', playersLabel: 'Players',
    playersHint: 'pos,name,alliance,score,under100m(0/1),notes — one per line\nExample: 1,Cymber,k698,1500000000,0',
    playersHintShort: 'pos,name,alliance,score,under100m,notes',
  },
  PL: { title: 'Pakiety KvK', active: 'AKTYWNE', past: 'MINIONE', newEvent: '+ Nowe KVK', noActive: 'Brak.', noPast: 'Brak.', players: 'gracze', packs: 'paczki', isActive: 'Aktywny', closed: 'Zamknięty', create: 'Utwórz i Otwórz', cancel: 'Anuluj', saving: '...', packsLabel: 'Dostępne paczki', playersLabel: 'Gracze', playersHint: 'poz,nazwa,sojusz,punkty,pod100m,notatki', playersHintShort: 'poz,nazwa,sojusz,punkty,pod100m,notatki' },
  ZH: { title: 'KVK礼包', active: '活跃', past: '历史', newEvent: '+ 新KVK', noActive: '无活跃活动。', noPast: '无历史活动。', players: '玩家', packs: '礼包', isActive: '活跃', closed: '已关闭', create: '创建并打开', cancel: '取消', saving: '...', packsLabel: '可用礼包', playersLabel: '玩家', playersHint: '位置,名称,联盟,积分,100M以下,备注', playersHintShort: '位置,名称,联盟,积分,100M以下,备注' },
  DE: { title: 'KVK-Pakete', active: 'AKTIV', past: 'VERGANGEN', newEvent: '+ Neues KVK', noActive: 'Keine.', noPast: 'Keine.', players: 'Spieler', packs: 'Pakete', isActive: 'Aktiv', closed: 'Geschlossen', create: 'Erstellen & Öffnen', cancel: 'Abbrechen', saving: '...', packsLabel: 'Verfügbare Pakete', playersLabel: 'Spieler', playersHint: 'pos,name,allianz,punkte,unter100m,notizen', playersHintShort: 'pos,name,allianz,punkte,unter100m,notizen' },
  FR: { title: 'Packages KvK', active: 'ACTIFS', past: 'PASSÉS', newEvent: '+ Nouveau KVK', noActive: 'Aucun.', noPast: 'Aucun.', players: 'joueurs', packs: 'packages', isActive: 'Actif', closed: 'Fermé', create: 'Créer & Ouvrir', cancel: 'Annuler', saving: '...', packsLabel: 'Packages disponibles', playersLabel: 'Joueurs', playersHint: 'pos,nom,alliance,score,moins100m,notes', playersHintShort: 'pos,nom,alliance,score,moins100m,notes' },
  RU: { title: 'Пакеты KvK', active: 'АКТИВНЫЕ', past: 'ПРОШЕДШИЕ', newEvent: '+ Новое KVK', noActive: 'Нет.', noPast: 'Нет.', players: 'игроки', packs: 'пакеты', isActive: 'Активно', closed: 'Закрыто', create: 'Создать и Открыть', cancel: 'Отмена', saving: '...', packsLabel: 'Доступные пакеты', playersLabel: 'Игроки', playersHint: 'поз,имя,альянс,очки,ниже100м,заметки', playersHintShort: 'поз,имя,альянс,очки,ниже100м,заметки' },
  ES: { title: 'Paquetes KvK', active: 'ACTIVOS', past: 'PASADOS', newEvent: '+ Nuevo KVK', noActive: 'No hay.', noPast: 'No hay.', players: 'jugadores', packs: 'paquetes', isActive: 'Activo', closed: 'Cerrado', create: 'Crear y Abrir', cancel: 'Cancelar', saving: '...', packsLabel: 'Paquetes disponibles', playersLabel: 'Jugadores', playersHint: 'pos,nombre,alianza,puntos,menos100m,notas', playersHintShort: 'pos,nombre,alianza,puntos,menos100m,notas' },
};

interface KvkEvent { id: number; name: string; date: string; pack90Total: number; pack60Total: number; pack30Total: number; isActive: boolean; _count: { players: number } }

export default function KvkPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('IT');
  const [events, setEvents] = useState<KvkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [packs, setPacks] = useState({ p90: '3', p60: '33', p30: '140' });
  const [playersText, setPlayersText] = useState('');
  const [saving, setSaving] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const t = (k: string) => T[lang]?.[k] || T['EN'][k] || k;

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored && LANGS.includes(stored)) setLang(stored);
    else { const br = navigator.language.split('-')[0].toUpperCase() as Lang; if (LANGS.includes(br)) setLang(br); }
    fetch('/api/kvk/events').then(r => r.json()).then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const handleAuthChange = useCallback((tok: string | null, _n: string | null, admin: boolean) => {
    setToken(tok || ''); setIsAdmin(admin);
  }, []);

  const createAndOpen = async () => {
    setSaving(true);
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
    const name = `Lista Pacchi KVK ${date}`;
    const evRes = await fetch('/api/kvk/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, date, pack90Total: Number(packs.p90), pack60Total: Number(packs.p60), pack30Total: Number(packs.p30) }),
    });
    if (!evRes.ok) { setSaving(false); return; }
    const ev = await evRes.json();

    // Import players if any
    if (playersText.trim()) {
      const lines = playersText.trim().split('\n').filter(l => l.trim());
      const players = lines.map((line, i) => {
        const p = line.split(',').map(s => s.trim());
        return { pos: Number(p[0]) || i+1, name: p[1] || `Player ${i+1}`, alliance: p[2] || null, score: Number(p[3]) || 0, under100m: p[4] === '1', notes: p[5] || null };
      });
      await fetch('/api/kvk/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ eventId: ev.id, players }),
      });
    }

    router.push(`/kvk/${ev.id}`);
  };

  const activeEvents = events.filter(e => e.isActive);
  const pastEvents = events.filter(e => !e.isActive);

  const S = {
    page: { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' } as React.CSSProperties,
    sectionLabel: { fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 6, marginLeft: 2 },
    card: (active: boolean) => ({ display: 'block', padding: '11px 14px', borderRadius: 12, marginBottom: 6, background: active ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)'}`, textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties),
    input: { padding: '9px 10px', borderRadius: 8, background: '#1a1a1f', border: '1px solid rgba(124,58,237,0.2)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, width: '100%' },
    btn: (primary: boolean) => ({ padding: '10px 14px', borderRadius: 9, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff' }),
  };

  const EventCard = ({ ev }: { ev: KvkEvent }) => (
    <Link href={`/kvk/${ev.id}`} style={S.card(ev.isActive)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{ev.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{ev.date} · {ev._count.players} {t('players')}</div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: ev.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: ev.isActive ? '#4ade80' : 'rgba(255,255,255,0.3)', flexShrink: 0, whiteSpace: 'nowrap' }}>
          {ev.isActive ? t('isActive') : t('closed')}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
        {[['90', ev.pack90Total, '#f87171'], ['60', ev.pack60Total, '#fbbf24'], ['30', ev.pack30Total, '#a78bfa']].map(([type, count, color]) => (
          <span key={type as string} style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: `${color as string}14`, color: color as string, border: `1px solid ${color as string}22` }}>
            {count as number}×{type}
          </span>
        ))}
        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}>
          = {ev.pack90Total + ev.pack60Total + ev.pack30Total} {t('packs')}
        </span>
      </div>
    </Link>
  );

  return (
    <div style={S.page}>
      <KvkHeader lang={lang} onLang={l => { setLang(l); localStorage.setItem('lang', l); }} onAuthChange={handleAuthChange} />

      <div style={{ padding: '14px 16px 10px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title')}</h1>
      </div>

      {/* CREATE BUTTON */}
      {isAdmin && (
        <div style={{ padding: '0 16px 10px', maxWidth: 560, margin: '0 auto' }}>
          <button onClick={() => setShowSheet(true)} style={{ ...S.btn(true), width: '100%' }}>{t('newEvent')}</button>
        </div>
      )}

      {/* EVENTS LIST */}
      <div style={{ padding: '0 16px 40px', maxWidth: 560, margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '24px 0' }}>...</p>}
        {!loading && <>
          <div style={S.sectionLabel}>{t('active')} ({activeEvents.length})</div>
          {activeEvents.length === 0
            ? <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginBottom: 20 }}>{t('noActive')}</p>
            : activeEvents.map(ev => <EventCard key={ev.id} ev={ev} />)
          }
          {pastEvents.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <div style={S.sectionLabel}>{t('past')} ({pastEvents.length})</div>
              {pastEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
            </div>
          )}
        </>}
      </div>

      {/* ── SHEET ── */}
      {showSheet && (
        <>
          {/* backdrop */}
          <div onClick={() => !saving && setShowSheet(false)} style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} />

          {/* sheet — bottom on mobile, centered on desktop */}
          <div ref={sheetRef} style={{
            position: 'fixed', zIndex: 999,
            left: 0, right: 0, bottom: 0,
            maxHeight: '90dvh',
            background: 'linear-gradient(180deg,#111113,#0d0d10)',
            borderTop: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '20px 20px 0 0',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 -16px 60px rgba(0,0,0,0.7)',
          }}>
            {/* drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>

            <div style={{ overflowY: 'auto', padding: '0 20px 32px', flex: 1 }}>
              {/* title */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{t('newEvent')}</div>
                <button onClick={() => setShowSheet(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: '0 0 0 12px' }}>✕</button>
              </div>

              {/* packs */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('packsLabel')}</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['p90', '90', '#f87171'], ['p60', '60', '#fbbf24'], ['p30', '30', '#a78bfa']].map(([k, label, color]) => (
                    <div key={k} style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: color as string, textAlign: 'center', marginBottom: 4 }}>×{label}</div>
                      <input
                        type="number" min="0"
                        value={packs[k as keyof typeof packs]}
                        onChange={e => setPacks(p => ({ ...p, [k]: e.target.value }))}
                        style={{ ...S.input, textAlign: 'center', padding: '10px 4px', fontSize: 16, fontWeight: 700, border: `1px solid ${color as string}33` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* players textarea */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>{t('playersLabel')}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{t('playersHintShort')}</div>
                </div>
                <textarea
                  value={playersText}
                  onChange={e => setPlayersText(e.target.value)}
                  placeholder={t('playersHint')}
                  rows={10}
                  style={{
                    ...S.input, resize: 'vertical', fontFamily: 'monospace',
                    fontSize: 12, lineHeight: 1.6, minHeight: 160,
                    padding: '10px 12px',
                  }}
                />
              </div>

              {/* buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowSheet(false)} style={{ ...S.btn(false), flex: 1 }} disabled={saving}>{t('cancel')}</button>
                <button onClick={createAndOpen} style={{ ...S.btn(true), flex: 2 }} disabled={saving}>
                  {saving ? t('saving') : t('create')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
