'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: { title: 'Pacchi KVK', active: 'EVENTI ATTIVI', past: 'EVENTI PASSATI', newEvent: '+ Nuovo Evento KVK', noActive: 'Nessun evento attivo.', noPast: 'Nessun evento passato.', players: 'giocatori', packs: 'pacchi', isActive: 'Attivo', closed: 'Chiuso', cancel: 'Annulla', saving: 'Salvataggio...', packsLabel: 'Pacchi disponibili', playersLabel: 'Lista Giocatori', addPlayer: '+ Aggiungi', colName: 'Nome', colScore: 'Punti (M)', step1: 'Passo 1: Giocatori', step2: 'Passo 2: Assegna Pacchi', generateList: 'Genera Lista', next: 'Avanti →', back: '← Indietro', remaining: 'rimanenti', total: 'totale' },
  EN: { title: 'KVK Packages', active: 'ACTIVE EVENTS', past: 'PAST EVENTS', newEvent: '+ New KVK Event', noActive: 'No active events.', noPast: 'No past events.', players: 'players', packs: 'packs', isActive: 'Active', closed: 'Closed', cancel: 'Cancel', saving: 'Saving...', packsLabel: 'Available packs', playersLabel: 'Players List', addPlayer: '+ Add', colName: 'Name', colScore: 'Score (M)', step1: 'Step 1: Players', step2: 'Step 2: Assign Packs', generateList: 'Generate List', next: 'Next →', back: '← Back', remaining: 'remaining', total: 'total' },
  PL: { title: 'Pakiety KvK', active: 'AKTYWNE', past: 'MINIONE', newEvent: '+ Nowe KVK', noActive: 'Brak.', noPast: 'Brak.', players: 'gracze', packs: 'paczki', isActive: 'Aktywny', closed: 'Zamknięty', cancel: 'Anuluj', saving: '...', packsLabel: 'Paczki', playersLabel: 'Lista graczy', addPlayer: '+ Dodaj', colName: 'Nazwa', colScore: 'Pkt (M)', step1: 'Krok 1', step2: 'Krok 2', generateList: 'Generuj listę', next: 'Dalej →', back: '← Wróć', remaining: 'pozostało', total: 'suma' },
  ZH: { title: 'KVK礼包', active: '活跃', past: '历史', newEvent: '+ 新KVK', noActive: '无。', noPast: '无。', players: '玩家', packs: '礼包', isActive: '活跃', closed: '已关闭', cancel: '取消', saving: '...', packsLabel: '可用礼包', playersLabel: '玩家列表', addPlayer: '+ 添加', colName: '名称', colScore: '积分(M)', step1: '第1步', step2: '第2步', generateList: '生成列表', next: '下一步 →', back: '← 返回', remaining: '剩余', total: '总计' },
  DE: { title: 'KVK-Pakete', active: 'AKTIV', past: 'VERGANGEN', newEvent: '+ Neues KVK', noActive: 'Keine.', noPast: 'Keine.', players: 'Spieler', packs: 'Pakete', isActive: 'Aktiv', closed: 'Geschlossen', cancel: 'Abbrechen', saving: '...', packsLabel: 'Pakete', playersLabel: 'Spielerliste', addPlayer: '+ Hinzufügen', colName: 'Name', colScore: 'Pkt (M)', step1: 'Schritt 1', step2: 'Schritt 2', generateList: 'Liste generieren', next: 'Weiter →', back: '← Zurück', remaining: 'verbleibend', total: 'gesamt' },
  FR: { title: 'Packages KvK', active: 'ACTIFS', past: 'PASSÉS', newEvent: '+ Nouveau KVK', noActive: 'Aucun.', noPast: 'Aucun.', players: 'joueurs', packs: 'packages', isActive: 'Actif', closed: 'Fermé', cancel: 'Annuler', saving: '...', packsLabel: 'Packages', playersLabel: 'Liste joueurs', addPlayer: '+ Ajouter', colName: 'Nom', colScore: 'Score (M)', step1: 'Étape 1', step2: 'Étape 2', generateList: 'Générer la liste', next: 'Suivant →', back: '← Retour', remaining: 'restants', total: 'total' },
  RU: { title: 'Пакеты KvK', active: 'АКТИВНЫЕ', past: 'ПРОШЕДШИЕ', newEvent: '+ Новое KVK', noActive: 'Нет.', noPast: 'Нет.', players: 'игроки', packs: 'пакеты', isActive: 'Активно', closed: 'Закрыто', cancel: 'Отмена', saving: '...', packsLabel: 'Пакеты', playersLabel: 'Список игроков', addPlayer: '+ Добавить', colName: 'Имя', colScore: 'Очки (M)', step1: 'Шаг 1', step2: 'Шаг 2', generateList: 'Создать список', next: 'Далее →', back: '← Назад', remaining: 'осталось', total: 'всего' },
  ES: { title: 'Paquetes KvK', active: 'ACTIVOS', past: 'PASADOS', newEvent: '+ Nuevo KVK', noActive: 'No hay.', noPast: 'No hay.', players: 'jugadores', packs: 'paquetes', isActive: 'Activo', closed: 'Cerrado', cancel: 'Cancelar', saving: '...', packsLabel: 'Paquetes', playersLabel: 'Lista jugadores', addPlayer: '+ Agregar', colName: 'Nombre', colScore: 'Puntos (M)', step1: 'Paso 1', step2: 'Paso 2', generateList: 'Generar lista', next: 'Siguiente →', back: '← Volver', remaining: 'restantes', total: 'total' },
};

interface PlayerRow { id: number; name: string; score: string; p90: number; p60: number; p30: number }
interface KvkEvent { id: number; name: string; date: string; pack90Total: number; pack60Total: number; pack30Total: number; isActive: boolean; _count: { players: number } }

let _id = 1;
const mkRow = (): PlayerRow => ({ id: _id++, name: '', score: '', p90: 0, p60: 0, p30: 0 });

const PACK_COLOR: Record<string, string> = { '90': '#f87171', '60': '#fbbf24', '30': '#a78bfa' };

export default function KvkPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('IT');
  const [events, setEvents] = useState<KvkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');

  // Sheet state
  const [showSheet, setShowSheet] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [packs, setPacks] = useState({ p90: '3', p60: '33', p30: '140' });
  const [rows, setRows] = useState<PlayerRow[]>([mkRow(), mkRow(), mkRow()]);
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

  const updateRow = (id: number, field: keyof PlayerRow, value: string | number) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const addRow = () => setRows(prev => [...prev, mkRow()]);
  const removeRow = (id: number) => setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);

  // pack delta for step2
  const changePack = (id: number, type: 'p90' | 'p60' | 'p30', delta: number) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, [type]: Math.max(0, r[type] + delta) };
    }));
  };

  // totals assigned
  const assigned = rows.reduce((s, r) => ({ p90: s.p90 + r.p90, p60: s.p60 + r.p60, p30: s.p30 + r.p30 }), { p90: 0, p60: 0, p30: 0 });
  const avail = { p90: Number(packs.p90), p60: Number(packs.p60), p30: Number(packs.p30) };
  const rem = { p90: avail.p90 - assigned.p90, p60: avail.p60 - assigned.p60, p30: avail.p30 - assigned.p30 };

  const goStep2 = () => {
    if (!rows.some(r => r.name.trim())) return;
    setStep(2);
  };

  const generateList = async () => {
    setSaving(true);
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
    const evRes = await fetch('/api/kvk/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `Lista Pacchi KVK ${date}`, date, pack90Total: avail.p90, pack60Total: avail.p60, pack30Total: avail.p30 }),
    });
    if (!evRes.ok) { setSaving(false); return; }
    const ev = await evRes.json();
    const valid = rows.filter(r => r.name.trim());
    if (valid.length > 0) {
      // first import players
      await fetch('/api/kvk/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          eventId: ev.id,
          players: valid.map((r, i) => ({
            pos: i + 1, name: r.name.trim(),
            alliance: null,
            score: Math.round(Number(r.score.replace(',', '.')) * 1e6) || 0,
            under100m: false, notes: null,
          })),
        }),
      });
      // then patch packs on each player
      const playersRes = await fetch(`/api/kvk/players?eventId=${ev.id}`);
      const playersList = await playersRes.json();
      await Promise.all(playersList.map((p: { id: number; name: string }, idx: number) => {
        const row = valid[idx];
        if (!row || (row.p90 === 0 && row.p60 === 0 && row.p30 === 0)) return Promise.resolve();
        return fetch(`/api/kvk/players/${p.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ pack90: row.p90, pack60: row.p60, pack30: row.p30 }),
        });
      }));
    }
    router.push(`/kvk/${ev.id}`);
  };

  const openSheet = () => {
    setStep(1);
    setRows([mkRow(), mkRow(), mkRow()]);
    setPacks({ p90: '3', p60: '33', p30: '140' });
    setShowSheet(true);
  };

  const activeEvents = events.filter(e => e.isActive);
  const pastEvents = events.filter(e => !e.isActive);

  const S = {
    page: { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' } as React.CSSProperties,
    sectionLabel: { fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 6, marginLeft: 2 },
    card: (active: boolean) => ({ display: 'block', padding: '11px 14px', borderRadius: 12, marginBottom: 6, background: active ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)'}`, textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties),
    btn: (primary: boolean, danger?: boolean) => ({ padding: '10px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: danger ? 'rgba(239,68,68,0.15)' : primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: danger ? '#f87171' : '#fff', whiteSpace: 'nowrap' as const }),
    input: { background: '#16161a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 7, color: '#fff', fontSize: 13, outline: 'none', padding: '8px 10px', width: '100%', boxSizing: 'border-box' as const },
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
        {([['90', ev.pack90Total, '#f87171'], ['60', ev.pack60Total, '#fbbf24'], ['30', ev.pack30Total, '#a78bfa']] as const).map(([type, count, color]) => (
          <span key={type} style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: `${color}14`, color, border: `1px solid ${color}22` }}>{count}×{type}</span>
        ))}
        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)' }}>= {ev.pack90Total + ev.pack60Total + ev.pack30Total} {t('packs')}</span>
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
          <button onClick={openSheet} style={{ ...S.btn(true), width: '100%' }}>{t('newEvent')}</button>
        </div>
      )}

      <div style={{ padding: '0 16px 40px', maxWidth: 560, margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '24px 0' }}>...</p>}
        {!loading && <>
          <div style={S.sectionLabel}>{t('active')} ({activeEvents.length})</div>
          {activeEvents.length === 0 ? <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginBottom: 20 }}>{t('noActive')}</p> : activeEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
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
          <div style={{ position: 'fixed', zIndex: 999, left: 0, right: 0, bottom: 0, maxHeight: '92dvh', background: 'linear-gradient(180deg,#111113,#0d0d10)', borderTop: '1px solid rgba(124,58,237,0.25)', borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column', boxShadow: '0 -16px 60px rgba(0,0,0,0.7)' }}>

            {/* handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px', flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 10px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{step === 1 ? t('step1') : t('step2')}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  {[1, 2].map(s => <div key={s} style={{ height: 3, width: 28, borderRadius: 2, background: step >= s ? 'linear-gradient(90deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.1)' }} />)}
                </div>
              </div>
              <button onClick={() => setShowSheet(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer', padding: 0 }}>✕</button>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div style={{ overflowY: 'auto', flex: 1, padding: '14px 16px 20px' }}>
                {/* packs */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('packsLabel')}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {([['p90', '90', '#f87171'], ['p60', '60', '#fbbf24'], ['p30', '30', '#a78bfa']] as const).map(([k, label, color]) => (
                      <div key={k} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 4 }}>×{label}</div>
                        <input type="number" min="0" value={packs[k]} onChange={e => setPacks(p => ({ ...p, [k]: e.target.value }))}
                          style={{ ...S.input, textAlign: 'center', fontSize: 15, fontWeight: 700, padding: '9px 4px', border: `1px solid ${color}33` }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* players */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                    {t('playersLabel')} ({rows.filter(r => r.name.trim()).length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {rows.map((row, idx) => (
                      <div key={row.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', width: 18, flexShrink: 0, textAlign: 'right' }}>{idx + 1}</span>
                        <input style={{ ...S.input, flex: 2 }} placeholder={t('colName')} value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value)} />
                        <input style={{ ...S.input, flex: 1, textAlign: 'center' }} placeholder="M" type="number" min="0" value={row.score} onChange={e => updateRow(row.id, 'score', e.target.value)} />
                        <button onClick={() => removeRow(row.id)} style={{ width: 28, height: 34, borderRadius: 7, border: '1px solid rgba(255,255,255,0.06)', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 14, flexShrink: 0 }}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addRow} style={{ marginTop: 8, width: '100%', padding: '7px', borderRadius: 8, border: '1px dashed rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)', color: 'rgba(124,58,237,0.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {t('addPlayer')}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowSheet(false)} style={{ ...S.btn(false), flex: 1 }}>{t('cancel')}</button>
                  <button onClick={goStep2} style={{ ...S.btn(true), flex: 2 }} disabled={!rows.some(r => r.name.trim())}>{t('next')}</button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={{ overflowY: 'auto', flex: 1, padding: '14px 16px 20px' }}>
                {/* remaining counter */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginRight: 4 }}>{t('remaining')}:</span>
                  {([['90', rem.p90, '#f87171'], ['60', rem.p60, '#fbbf24'], ['30', rem.p30, '#a78bfa']] as const).map(([type, val, color]) => (
                    <span key={type} style={{ fontSize: 13, fontWeight: 800, color: val < 0 ? '#ef4444' : color }}>
                      {val}×{type}
                    </span>
                  ))}
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>
                    {t('total')}: {assigned.p90 + assigned.p60 + assigned.p30}
                  </span>
                </div>

                {/* player pack rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {rows.filter(r => r.name.trim()).map((row, idx) => (
                    <div key={row.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {/* name + score */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', width: 18, flexShrink: 0 }}>{idx + 1}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', flex: 1 }}>{row.name}</span>
                        {row.score && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{row.score}M</span>}
                        {/* pack badges */}
                        <div style={{ display: 'flex', gap: 3 }}>
                          {([['p90', '90', '#f87171'], ['p60', '60', '#fbbf24'], ['p30', '30', '#a78bfa']] as const).map(([k, label, color]) =>
                            row[k] > 0 ? Array.from({ length: row[k] }).map((_, i) => (
                              <span key={`${k}-${i}`} style={{ fontSize: 10, fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: `${color}18`, color, border: `1px solid ${color}30` }}>{label}</span>
                            )) : null
                          )}
                        </div>
                      </div>
                      {/* +/- controls */}
                      <div style={{ display: 'flex', gap: 8 }}>
                        {([['p90', '90', '#f87171'], ['p60', '60', '#fbbf24'], ['p30', '30', '#a78bfa']] as const).map(([k, label, color]) => (
                          <div key={k} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, background: `${color}08`, borderRadius: 8, padding: '4px 6px', border: `1px solid ${color}18` }}>
                            <button onClick={() => changePack(row.id, k, -1)} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.06)', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>−</button>
                            <span style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 800, color }}>{row[k]}</span>
                            <button onClick={() => changePack(row.id, k, +1)} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: `${color}22`, color, cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>+</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(1)} style={{ ...S.btn(false), flex: 1 }}>{t('back')}</button>
                  <button onClick={generateList} style={{ ...S.btn(true), flex: 2 }} disabled={saving}>
                    {saving ? t('saving') : t('generateList')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
