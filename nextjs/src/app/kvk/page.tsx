'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: { title: 'Pacchi KVK', active: 'EVENTI ATTIVI', past: 'EVENTI PASSATI', newEvent: '+ Nuovo Evento KVK', noActive: 'Nessun evento attivo.', noPast: 'Nessun evento passato.', players: 'giocatori', packs: 'pacchi', isActive: 'Attivo', closed: 'Chiuso', create: 'Crea e Apri', cancel: 'Annulla', saving: 'Salvataggio...', packsLabel: 'Pacchi disponibili', playersLabel: 'Lista Giocatori', addPlayer: '+ Aggiungi giocatore', colName: 'Nome', colAlliance: 'Alleanza', colScore: 'Punti (M)', colUnder: '<100M', colNotes: 'Note' },
  EN: { title: 'KVK Packages', active: 'ACTIVE EVENTS', past: 'PAST EVENTS', newEvent: '+ New KVK Event', noActive: 'No active events.', noPast: 'No past events.', players: 'players', packs: 'packs', isActive: 'Active', closed: 'Closed', create: 'Create & Open', cancel: 'Cancel', saving: 'Saving...', packsLabel: 'Available packs', playersLabel: 'Players List', addPlayer: '+ Add player', colName: 'Name', colAlliance: 'Alliance', colScore: 'Score (M)', colUnder: '<100M', colNotes: 'Notes' },
  PL: { title: 'Pakiety KvK', active: 'AKTYWNE', past: 'MINIONE', newEvent: '+ Nowe KVK', noActive: 'Brak.', noPast: 'Brak.', players: 'gracze', packs: 'paczki', isActive: 'Aktywny', closed: 'Zamknięty', create: 'Utwórz i Otwórz', cancel: 'Anuluj', saving: '...', packsLabel: 'Paczki', playersLabel: 'Lista Graczy', addPlayer: '+ Dodaj gracza', colName: 'Nazwa', colAlliance: 'Sojusz', colScore: 'Pkt (M)', colUnder: '<100M', colNotes: 'Notatki' },
  ZH: { title: 'KVK礼包', active: '活跃', past: '历史', newEvent: '+ 新KVK', noActive: '无。', noPast: '无。', players: '玩家', packs: '礼包', isActive: '活跃', closed: '已关闭', create: '创建并打开', cancel: '取消', saving: '...', packsLabel: '可用礼包', playersLabel: '玩家列表', addPlayer: '+ 添加玩家', colName: '名称', colAlliance: '联盟', colScore: '积分(M)', colUnder: '<100M', colNotes: '备注' },
  DE: { title: 'KVK-Pakete', active: 'AKTIV', past: 'VERGANGEN', newEvent: '+ Neues KVK', noActive: 'Keine.', noPast: 'Keine.', players: 'Spieler', packs: 'Pakete', isActive: 'Aktiv', closed: 'Geschlossen', create: 'Erstellen & Öffnen', cancel: 'Abbrechen', saving: '...', packsLabel: 'Pakete', playersLabel: 'Spielerliste', addPlayer: '+ Spieler hinzufügen', colName: 'Name', colAlliance: 'Allianz', colScore: 'Pkt (M)', colUnder: '<100M', colNotes: 'Notizen' },
  FR: { title: 'Packages KvK', active: 'ACTIFS', past: 'PASSÉS', newEvent: '+ Nouveau KVK', noActive: 'Aucun.', noPast: 'Aucun.', players: 'joueurs', packs: 'packages', isActive: 'Actif', closed: 'Fermé', create: 'Créer & Ouvrir', cancel: 'Annuler', saving: '...', packsLabel: 'Packages', playersLabel: 'Liste des Joueurs', addPlayer: '+ Ajouter joueur', colName: 'Nom', colAlliance: 'Alliance', colScore: 'Score (M)', colUnder: '<100M', colNotes: 'Notes' },
  RU: { title: 'Пакеты KvK', active: 'АКТИВНЫЕ', past: 'ПРОШЕДШИЕ', newEvent: '+ Новое KVK', noActive: 'Нет.', noPast: 'Нет.', players: 'игроки', packs: 'пакеты', isActive: 'Активно', closed: 'Закрыто', create: 'Создать и Открыть', cancel: 'Отмена', saving: '...', packsLabel: 'Пакеты', playersLabel: 'Список игроков', addPlayer: '+ Добавить игрока', colName: 'Имя', colAlliance: 'Альянс', colScore: 'Очки (M)', colUnder: '<100M', colNotes: 'Заметки' },
  ES: { title: 'Paquetes KvK', active: 'ACTIVOS', past: 'PASADOS', newEvent: '+ Nuevo KVK', noActive: 'No hay.', noPast: 'No hay.', players: 'jugadores', packs: 'paquetes', isActive: 'Activo', closed: 'Cerrado', create: 'Crear y Abrir', cancel: 'Cancelar', saving: '...', packsLabel: 'Paquetes', playersLabel: 'Lista de Jugadores', addPlayer: '+ Agregar jugador', colName: 'Nombre', colAlliance: 'Alianza', colScore: 'Puntos (M)', colUnder: '<100M', colNotes: 'Notas' },
};

interface PlayerRow { id: number; name: string; alliance: string; score: string; under100m: boolean; notes: string }
interface KvkEvent { id: number; name: string; date: string; pack90Total: number; pack60Total: number; pack30Total: number; isActive: boolean; _count: { players: number } }

let nextId = 1;
const newRow = (): PlayerRow => ({ id: nextId++, name: '', alliance: '', score: '', under100m: false, notes: '' });

const IN: React.CSSProperties = { background: '#16161a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#fff', fontSize: 13, outline: 'none', padding: '7px 9px', width: '100%', boxSizing: 'border-box' };

export default function KvkPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('IT');
  const [events, setEvents] = useState<KvkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [packs, setPacks] = useState({ p90: '3', p60: '33', p30: '140' });
  const [rows, setRows] = useState<PlayerRow[]>([newRow()]);
  const [saving, setSaving] = useState(false);

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

  const updateRow = (id: number, field: keyof PlayerRow, value: string | boolean) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const addRow = () => setRows(prev => [...prev, newRow()]);
  const removeRow = (id: number) => setRows(prev => prev.filter(r => r.id !== id));

  const createAndOpen = async () => {
    setSaving(true);
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
    const evRes = await fetch('/api/kvk/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `Lista Pacchi KVK ${date}`, date, pack90Total: Number(packs.p90), pack60Total: Number(packs.p60), pack30Total: Number(packs.p30) }),
    });
    if (!evRes.ok) { setSaving(false); return; }
    const ev = await evRes.json();
    const validRows = rows.filter(r => r.name.trim());
    if (validRows.length > 0) {
      await fetch('/api/kvk/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          eventId: ev.id,
          players: validRows.map((r, i) => ({
            pos: i + 1, name: r.name.trim(),
            alliance: r.alliance.trim() || null,
            score: Math.round(Number(r.score.replace(',', '.')) * 1e6) || 0,
            under100m: r.under100m,
            notes: r.notes.trim() || null,
          })),
        }),
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
    btn: (primary: boolean) => ({ padding: '10px 14px', borderRadius: 9, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff', whiteSpace: 'nowrap' as const }),
  };

  const EventCard = ({ ev }: { ev: KvkEvent }) => (
    <Link href={`/kvk/${ev.id}`} style={S.card(ev.isActive)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{ev.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{ev.date} · {ev._count.players} {t('players')}</div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: ev.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: ev.isActive ? '#4ade80' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
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

      {isAdmin && (
        <div style={{ padding: '0 16px 10px', maxWidth: 560, margin: '0 auto' }}>
          <button onClick={() => setShowSheet(true)} style={{ ...S.btn(true), width: '100%' }}>{t('newEvent')}</button>
        </div>
      )}

      <div style={{ padding: '0 16px 40px', maxWidth: 560, margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '24px 0' }}>...</p>}
        {!loading && <>
          <div style={S.sectionLabel}>{t('active')} ({activeEvents.length})</div>
          {activeEvents.length === 0
            ? <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginBottom: 20 }}>{t('noActive')}</p>
            : activeEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
          {pastEvents.length > 0 && <div style={{ marginTop: 18 }}>
            <div style={S.sectionLabel}>{t('past')} ({pastEvents.length})</div>
            {pastEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
          </div>}
        </>}
      </div>

      {/* ── SHEET ── */}
      {showSheet && (
        <>
          <div onClick={() => !saving && setShowSheet(false)} style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }} />
          <div style={{
            position: 'fixed', zIndex: 999, left: 0, right: 0, bottom: 0,
            maxHeight: '92dvh', background: 'linear-gradient(180deg,#111113,#0d0d10)',
            borderTop: '1px solid rgba(124,58,237,0.25)', borderRadius: '20px 20px 0 0',
            display: 'flex', flexDirection: 'column', boxShadow: '0 -16px 60px rgba(0,0,0,0.7)',
          }}>
            {/* handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px', flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 10px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{t('newEvent')}</div>
              <button onClick={() => setShowSheet(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            {/* scrollable body */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 16px 24px' }}>

              {/* packs */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('packsLabel')}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[['p90', '90', '#f87171'], ['p60', '60', '#fbbf24'], ['p30', '30', '#a78bfa']].map(([k, label, color]) => (
                    <div key={k} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: color as string, marginBottom: 4 }}>×{label}</div>
                      <input type="number" min="0" value={packs[k as keyof typeof packs]}
                        onChange={e => setPacks(p => ({ ...p, [k]: e.target.value }))}
                        style={{ ...IN, textAlign: 'center', fontSize: 15, fontWeight: 700, padding: '9px 4px', border: `1px solid ${color as string}33` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* players table */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  {t('playersLabel')} ({rows.filter(r => r.name.trim()).length})
                </div>

                {/* column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr auto auto', gap: 4, marginBottom: 4, padding: '0 4px' }}>
                  {[t('colName'), t('colAlliance'), t('colScore'), t('colUnder'), ''].map((h, i) => (
                    <div key={i} style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: i === 3 ? 'center' : 'left' }}>{h}</div>
                  ))}
                </div>

                {/* rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {rows.map((row, idx) => (
                    <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr auto auto', gap: 4, alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '4px 6px' }}>
                      {/* # */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', width: 14, flexShrink: 0 }}>{idx + 1}</span>
                        <input style={IN} placeholder={t('colName')} value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value)} />
                      </div>
                      <input style={IN} placeholder="—" value={row.alliance} onChange={e => updateRow(row.id, 'alliance', e.target.value)} />
                      <input style={{ ...IN, textAlign: 'center' }} placeholder="0" type="number" min="0" value={row.score} onChange={e => updateRow(row.id, 'score', e.target.value)} />
                      {/* under 100m checkbox */}
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                          onClick={() => updateRow(row.id, 'under100m', !row.under100m)}
                          style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${row.under100m ? '#f87171' : 'rgba(255,255,255,0.1)'}`, background: row.under100m ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', fontSize: 13, color: row.under100m ? '#f87171' : 'rgba(255,255,255,0.2)' }}
                        >{row.under100m ? '✓' : ''}</button>
                      </div>
                      {/* delete */}
                      <button onClick={() => removeRow(row.id)} style={{ width: 28, height: 28, borderRadius: 7, border: '1px solid rgba(255,255,255,0.06)', background: 'none', cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.2)' }}>✕</button>
                    </div>
                  ))}
                </div>

                <button onClick={addRow} style={{ marginTop: 8, width: '100%', padding: '8px', borderRadius: 8, border: '1px dashed rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)', color: 'rgba(124,58,237,0.8)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {t('addPlayer')}
                </button>
              </div>

              {/* action buttons */}
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
