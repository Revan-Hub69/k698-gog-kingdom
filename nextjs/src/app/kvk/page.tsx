'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: { title:'Pacchi KVK', active:'EVENTI ATTIVI', past:'EVENTI PASSATI', newEvent:'+ Nuovo Evento KVK', noActive:'Nessun evento attivo.', noPast:'Nessun evento passato.', players:'giocatori', packs:'pacchi', isActive:'Attivo', closed:'Chiuso', editList:'✏️ Lista', assignPacks:'📦 Pacchi', deleteEvent:'🗑 Elimina', sheetListTitle:'Lista Giocatori', sheetPacksTitle:'Assegna Pacchi', sheetNewTitle:'Nuovo Evento KVK', packsLabel:'Pacchi disponibili', colName:'Nome', colScore:'Pt.', colDeaths:'Morti', addPlayer:'+ Aggiungi giocatore', saveList:'Salva Lista', remaining:'Rimanenti', assigned:'Assegnati', generateList:'🚀 Genera Lista', cancel:'Annulla', saving:'...', scoreHint:'Punti KVK in milioni (es. 1500 = 1.5B)', deathsHint:'Morti KVK', deleteConfirm:'Sei sicuro di voler eliminare tutta la lista?', confirmYes:'Elimina', confirmNo:'Annulla', maxPacksWarning:'Max 3 pacchi per giocatore' },
  EN: { title:'KVK Packages', active:'ACTIVE EVENTS', past:'PAST EVENTS', newEvent:'+ New KVK Event', noActive:'No active events.', noPast:'No past events.', players:'players', packs:'packs', isActive:'Active', closed:'Closed', editList:'✏️ List', assignPacks:'📦 Packs', deleteEvent:'🗑 Delete', sheetListTitle:'Players List', sheetPacksTitle:'Assign Packs', sheetNewTitle:'New KVK Event', packsLabel:'Available packs', colName:'Name', colScore:'Pts.', colDeaths:'Deaths', addPlayer:'+ Add player', saveList:'Save List', remaining:'Remaining', assigned:'Assigned', generateList:'🚀 Generate List', cancel:'Cancel', saving:'...', scoreHint:'KVK score in millions (e.g. 1500 = 1.5B)', deathsHint:'KVK deaths', deleteConfirm:'Are you sure you want to delete this list?', confirmYes:'Delete', confirmNo:'Cancel', maxPacksWarning:'Max 3 packs per player' },
  PL: { title:'Pakiety KvK', active:'AKTYWNE', past:'MINIONE', newEvent:'+ Nowe KVK', noActive:'Brak.', noPast:'Brak.', players:'gracze', packs:'paczki', isActive:'Aktywny', closed:'Zamknięty', editList:'✏️ Lista', assignPacks:'📦 Paczki', deleteEvent:'🗑 Usuń', sheetListTitle:'Lista graczy', sheetPacksTitle:'Przydziel paczki', sheetNewTitle:'Nowe KVK', packsLabel:'Paczki', colName:'Nazwa', colScore:'Pkt.', colDeaths:'Śmierci', addPlayer:'+ Dodaj', saveList:'Zapisz', remaining:'Pozostało', assigned:'Przydzielono', generateList:'🚀 Generuj', cancel:'Anuluj', saving:'...', scoreHint:'Punkty w milionach', deathsHint:'Śmierci', deleteConfirm:'Usunąć listę?', confirmYes:'Usuń', confirmNo:'Anuluj', maxPacksWarning:'Max 3 paczki' },
  ZH: { title:'KVK礼包', active:'活跃', past:'历史', newEvent:'+ 新KVK', noActive:'无。', noPast:'无。', players:'玩家', packs:'礼包', isActive:'活跃', closed:'已关闭', editList:'✏️ 列表', assignPacks:'📦 礼包', deleteEvent:'🗑 删除', sheetListTitle:'玩家列表', sheetPacksTitle:'分配礼包', sheetNewTitle:'新KVK', packsLabel:'可用礼包', colName:'名称', colScore:'积分', colDeaths:'死亡', addPlayer:'+ 添加', saveList:'保存', remaining:'剩余', assigned:'已分配', generateList:'🚀 生成', cancel:'取消', saving:'...', scoreHint:'积分(百万)', deathsHint:'死亡数', deleteConfirm:'确定删除列表？', confirmYes:'删除', confirmNo:'取消', maxPacksWarning:'每人最多3个礼包' },
  DE: { title:'KVK-Pakete', active:'AKTIV', past:'VERGANGEN', newEvent:'+ Neues KVK', noActive:'Keine.', noPast:'Keine.', players:'Spieler', packs:'Pakete', isActive:'Aktiv', closed:'Geschlossen', editList:'✏️ Liste', assignPacks:'📦 Pakete', deleteEvent:'🗑 Löschen', sheetListTitle:'Spielerliste', sheetPacksTitle:'Pakete zuweisen', sheetNewTitle:'Neues KVK', packsLabel:'Pakete', colName:'Name', colScore:'Pkt.', colDeaths:'Tode', addPlayer:'+ Hinzuf.', saveList:'Speichern', remaining:'Verbleibend', assigned:'Zugewiesen', generateList:'🚀 Generieren', cancel:'Abbrechen', saving:'...', scoreHint:'Punkte in Millionen', deathsHint:'Anzahl Tode', deleteConfirm:'Liste löschen?', confirmYes:'Löschen', confirmNo:'Abbrechen', maxPacksWarning:'Max 3 Pakete pro Spieler' },
  FR: { title:'Packages KvK', active:'ACTIFS', past:'PASSÉS', newEvent:'+ Nouveau KVK', noActive:'Aucun.', noPast:'Aucun.', players:'joueurs', packs:'packages', isActive:'Actif', closed:'Fermé', editList:'✏️ Liste', assignPacks:'📦 Packages', deleteEvent:'🗑 Supprimer', sheetListTitle:'Liste joueurs', sheetPacksTitle:'Attribuer packages', sheetNewTitle:'Nouveau KVK', packsLabel:'Packages', colName:'Nom', colScore:'Pts.', colDeaths:'Morts', addPlayer:'+ Ajouter', saveList:'Sauvegarder', remaining:'Restants', assigned:'Attribués', generateList:'🚀 Générer', cancel:'Annuler', saving:'...', scoreHint:'Score en millions', deathsHint:'Nombre de morts', deleteConfirm:'Supprimer la liste?', confirmYes:'Supprimer', confirmNo:'Annuler', maxPacksWarning:'Max 3 packages par joueur' },
  RU: { title:'Пакеты KvK', active:'АКТИВНЫЕ', past:'ПРОШЕДШИЕ', newEvent:'+ Новое KVK', noActive:'Нет.', noPast:'Нет.', players:'игроки', packs:'пакеты', isActive:'Активно', closed:'Закрыто', editList:'✏️ Список', assignPacks:'📦 Пакеты', deleteEvent:'🗑 Удалить', sheetListTitle:'Список игроков', sheetPacksTitle:'Назначить пакеты', sheetNewTitle:'Новое KVK', packsLabel:'Пакеты', colName:'Имя', colScore:'Очки', colDeaths:'Смерти', addPlayer:'+ Добавить', saveList:'Сохранить', remaining:'Осталось', assigned:'Назначено', generateList:'🚀 Создать', cancel:'Отмена', saving:'...', scoreHint:'Очки в миллионах', deathsHint:'Смерти', deleteConfirm:'Удалить список?', confirmYes:'Удалить', confirmNo:'Отмена', maxPacksWarning:'Макс 3 пакета на игрока' },
  ES: { title:'Paquetes KvK', active:'ACTIVOS', past:'PASADOS', newEvent:'+ Nuevo KVK', noActive:'No hay.', noPast:'No hay.', players:'jugadores', packs:'paquetes', isActive:'Activo', closed:'Cerrado', editList:'✏️ Lista', assignPacks:'📦 Paquetes', deleteEvent:'🗑 Eliminar', sheetListTitle:'Lista jugadores', sheetPacksTitle:'Asignar paquetes', sheetNewTitle:'Nuevo KVK', packsLabel:'Paquetes', colName:'Nombre', colScore:'Pts.', colDeaths:'Muertes', addPlayer:'+ Agregar', saveList:'Guardar', remaining:'Restantes', assigned:'Asignados', generateList:'🚀 Generar', cancel:'Cancelar', saving:'...', scoreHint:'Puntos en millones', deathsHint:'Muertes', deleteConfirm:'¿Eliminar la lista?', confirmYes:'Eliminar', confirmNo:'Cancelar', maxPacksWarning:'Máx 3 paquetes por jugador' },
};

interface PlayerRow { id: number; name: string; score: string; deaths: string; p90: number; p60: number; p30: number }
interface KvkEvent { id: number; name: string; date: string; pack90Total: number; pack60Total: number; pack30Total: number; isActive: boolean; _count: { players: number } }

let _uid = 1;
const mkRow = (): PlayerRow => ({ id: _uid++, name: '', score: '', deaths: '', p90: 0, p60: 0, p30: 0 });
const PC = { '90': '#f87171', '60': '#fbbf24', '30': '#a78bfa' };

// Format a value in M: accepts "1200", "1.200", "1,2", "0.001" etc → "1.200M", "1,2M", "0,001M"
function fmt(val: string | number): string {
  if (val === '' || val === undefined || val === null) return '';
  const raw = String(val).replace(/\.(?=\d{3}(?:[,.]|$))/g, '').replace(',', '.');
  const n = parseFloat(raw);
  if (isNaN(n) || n === 0) return '';
  // determine decimal places needed
  let decimals = 0;
  if (n < 0.01) decimals = 3;
  else if (n < 0.1) decimals = 2;
  else if (n !== Math.floor(n)) decimals = 1;
  const rounded = parseFloat(n.toFixed(decimals));
  const intPart = Math.floor(rounded);
  const decPart = Math.round((rounded - intPart) * Math.pow(10, decimals));
  const intStr = intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decimals > 0 && decPart > 0 ? `${intStr},${String(decPart).padStart(decimals, '0')}M` : `${intStr}M`;
}
const IN: React.CSSProperties = { background: '#111115', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, color: '#fff', fontSize: 13, outline: 'none', padding: '7px 8px', boxSizing: 'border-box', width: '100%' };

export default function KvkPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('IT');
  const [events, setEvents] = useState<KvkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');
  const [sheetMode, setSheetMode] = useState<null | 'new' | 'list' | 'packs'>(null);
  const [newTab, setNewTab] = useState<'packs' | 'list'>('packs');
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [packs, setPacks] = useState({ p90: '3', p60: '33', p30: '140' });
  const [rows, setRows] = useState<PlayerRow[]>([mkRow()]);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  const t = (k: string) => T[lang]?.[k] || T['EN'][k] || k;

  useEffect(() => {
    const s = localStorage.getItem('lang') as Lang | null;
    if (s && LANGS.includes(s)) setLang(s);
    else { const br = navigator.language.split('-')[0].toUpperCase() as Lang; if (LANGS.includes(br)) setLang(br); }
    fetch('/api/kvk/events').then(r => r.json()).then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const handleAuthChange = useCallback((tok: string | null, _n: string | null, admin: boolean) => {
    setToken(tok || ''); setIsAdmin(admin);
  }, []);

  const updateRow = (id: number, field: keyof PlayerRow, value: string) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const removeRow = (id: number) =>
    setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : [{ ...mkRow() }]);

  const addRow = () => {
    setRows(prev => [...prev, mkRow()]);
    setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
  };

  // max 3 total packs per player
  const changePack = (id: number, type: 'p90' | 'p60' | 'p30', delta: number) =>
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const next = Math.max(0, r[type] + delta);
      const total = (type === 'p90' ? next : r.p90) + (type === 'p60' ? next : r.p60) + (type === 'p30' ? next : r.p30);
      if (total > 3) return r;
      return { ...r, [type]: next };
    }));

  const assigned = rows.reduce((s, r) => ({ p90: s.p90 + r.p90, p60: s.p60 + r.p60, p30: s.p30 + r.p30 }), { p90: 0, p60: 0, p30: 0 });
  const avail = { p90: Number(packs.p90), p60: Number(packs.p60), p30: Number(packs.p30) };
  const rem = { p90: avail.p90 - assigned.p90, p60: avail.p60 - assigned.p60, p30: avail.p30 - assigned.p30 };

  const loadEventData = async (ev: KvkEvent) => {
    setPacks({ p90: String(ev.pack90Total), p60: String(ev.pack60Total), p30: String(ev.pack30Total) });
    setEditingEventId(ev.id);
    const pls = await (await fetch(`/api/kvk/players?eventId=${ev.id}`)).json();
    setRows(Array.isArray(pls) && pls.length > 0
      ? pls.map((p: { name: string; score: number; notes: string | null; pack90: number; pack60: number; pack30: number }) => ({
          id: _uid++, name: p.name,
          score: p.score > 0 ? String(p.score / 1e6) : '',
          deaths: p.notes ? p.notes.replace('morti: ', '') : '',
          p90: p.pack90, p60: p.pack60, p30: p.pack30,
        }))
      : [mkRow()]);
  };

  const reloadEvents = () => fetch('/api/kvk/events').then(r => r.json()).then(d => setEvents(Array.isArray(d) ? d : []));

  const saveList = async () => {
    setSaving(true);
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
    const valid = rows.filter(r => r.name.trim());
    let eventId = editingEventId;
    if (!eventId) {
      const r = await fetch('/api/kvk/events', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ name: `Lista Pacchi KVK ${date}`, date, pack90Total: avail.p90, pack60Total: avail.p60, pack30Total: avail.p30 }) });
      if (!r.ok) { setSaving(false); return; }
      eventId = (await r.json()).id; setEditingEventId(eventId);
    } else {
      await fetch(`/api/kvk/events/${eventId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ pack90Total: avail.p90, pack60Total: avail.p60, pack30Total: avail.p30 }) });
    }
    await fetch('/api/kvk/players', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ eventId, players: valid.map((r, i) => ({ pos: i+1, name: r.name.trim(), alliance: null, score: Math.round(Number(r.score.replace(',','.')) * 1e6) || 0, under100m: false, notes: r.deaths ? `morti: ${r.deaths.replace(',','.')}` : null })) }) });
    await reloadEvents();
    setSaving(false); setSheetMode(null);
  };

  const savePacks = async () => {
    if (!editingEventId) return;
    setSaving(true);
    await fetch(`/api/kvk/events/${editingEventId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ pack90Total: avail.p90, pack60Total: avail.p60, pack30Total: avail.p30 }) });
    await reloadEvents();
    setSaving(false);
  };

  const generateList = async () => {
    setSaving(true);
    const valid = rows.filter(r => r.name.trim());
    if (!editingEventId || !valid.length) { setSaving(false); return; }
    await fetch(`/api/kvk/events/${editingEventId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ pack90Total: avail.p90, pack60Total: avail.p60, pack30Total: avail.p30 }) });
    await fetch('/api/kvk/players', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ eventId: editingEventId, players: valid.map((r, i) => ({ pos: i+1, name: r.name.trim(), alliance: null, score: Math.round(Number(r.score.replace(',','.')) * 1e6) || 0, under100m: false, notes: r.deaths ? `morti: ${r.deaths.replace(',','.')}` : null })) }) });
    const pList = await (await fetch(`/api/kvk/players?eventId=${editingEventId}`)).json();
    await Promise.all(pList.map((p: { id: number }, idx: number) => {
      const row = valid[idx]; if (!row) return Promise.resolve();
      return fetch(`/api/kvk/players/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ pack90: row.p90, pack60: row.p60, pack30: row.p30 }) });
    }));
    router.push(`/kvk/${editingEventId}`);
  };

  const deleteEvent = async (id: number) => {
    await fetch(`/api/kvk/events/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    await reloadEvents(); setConfirmDeleteId(null);
  };

  const [inlinePackEdit, setInlinePackEdit] = useState<number | null>(null);
  const [inlinePacks, setInlinePacks] = useState({ p90: '', p60: '', p30: '' });
  const [inlineSaving, setInlineSaving] = useState(false);

  const saveInlinePacks = async (eventId: number) => {
    setInlineSaving(true);
    await fetch(`/api/kvk/events/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pack90Total: Number(inlinePacks.p90), pack60Total: Number(inlinePacks.p60), pack30Total: Number(inlinePacks.p30) }),
    });
    await reloadEvents();
    setInlineSaving(false);
    setInlinePackEdit(null);
  };

  const activeEvents = events.filter(e => e.isActive);
  const pastEvents = events.filter(e => !e.isActive);

  const S = {
    page: { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' } as React.CSSProperties,
    sl: { fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 6, marginLeft: 2 },
    card: { display: 'block', padding: '11px 14px', borderRadius: 12, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties,
    cardPast: { display: 'block', padding: '11px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties,
    btn: (primary: boolean): React.CSSProperties => ({ padding: '10px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff' }),
    btnXs: (col: string): React.CSSProperties => ({ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, border: `1px solid ${col}30`, cursor: 'pointer', background: `${col}10`, color: col }),
  };

  const EventCard = ({ ev }: { ev: KvkEvent }) => (
    <div style={{ marginBottom: 8 }}>
      <Link href={`/kvk/${ev.id}`} style={ev.isActive ? S.card : S.cardPast}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{ev.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{ev.date} · {ev._count.players} {t('players')}</div>
          </div>
          <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 5, background: ev.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: ev.isActive ? '#4ade80' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
            {ev.isActive ? t('isActive') : t('closed')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {([['90','#f87171'],['60','#fbbf24'],['30','#a78bfa']] as const).map(([type, color]) => (
            <span key={type} style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: `${color}14`, color, border: `1px solid ${color}22` }}>
              {type === '90' ? ev.pack90Total : type === '60' ? ev.pack60Total : ev.pack30Total}×{type}
            </span>
          ))}
        </div>
      </Link>
      {isAdmin && (
        <>
          <div style={{ display: 'flex', gap: 5, marginTop: 4, paddingLeft: 2 }}>
            <button onClick={() => loadEventData(ev).then(() => setSheetMode('list'))} style={S.btnXs('#c084fc')}>{t('editList')}</button>
            <button onClick={() => loadEventData(ev).then(() => setSheetMode('packs'))} style={S.btnXs('#60a5fa')}>{t('assignPacks')}</button>
            <button onClick={() => { setInlinePackEdit(ev.id); setInlinePacks({ p90: String(ev.pack90Total), p60: String(ev.pack60Total), p30: String(ev.pack30Total) }); }} style={S.btnXs('#fbbf24')}>📦 {t('packsLabel')}</button>
            <button onClick={() => setConfirmDeleteId(ev.id)} style={S.btnXs('#f87171')}>{t('deleteEvent')}</button>
          </div>
          {inlinePackEdit === ev.id && (
            <div style={{ marginTop: 6, padding: '10px 12px', borderRadius: 10, background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', display: 'flex', gap: 8, alignItems: 'center' }}>
              {([['p90','90','#f87171'],['p60','60','#fbbf24'],['p30','30','#a78bfa']] as const).map(([k, label, color]) => (
                <div key={k} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color, marginBottom: 3 }}>×{label}</div>
                  <input type="number" min="0" value={inlinePacks[k]} onChange={e => setInlinePacks(p => ({ ...p, [k]: e.target.value }))}
                    style={{ ...IN, textAlign: 'center', fontSize: 14, fontWeight: 800, padding: '6px 4px', border: `1px solid ${color}40` }} />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button onClick={() => saveInlinePacks(ev.id)} disabled={inlineSaving} style={{ padding: '5px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                  {inlineSaving ? '...' : '💾'}
                </button>
                <button onClick={() => setInlinePackEdit(null)} style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>✕</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div style={S.page}>
      <KvkHeader lang={lang} onLang={l => { setLang(l); localStorage.setItem('lang', l); }} onAuthChange={handleAuthChange} />

      <div style={{ padding: '14px 16px 10px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title')}</h1>
      </div>

      {isAdmin && (
        <div style={{ padding: '0 16px 10px', maxWidth: 480, margin: '0 auto' }}>
          <button onClick={() => { setEditingEventId(null); setRows([mkRow()]); setPacks({ p90: '3', p60: '33', p30: '140' }); setSheetMode('new'); }} style={{ ...S.btn(true), width: '100%' }}>{t('newEvent')}</button>
        </div>
      )}

      <div style={{ padding: '0 16px 40px', maxWidth: 480, margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '24px 0' }}>...</p>}
        {!loading && <>
          <div style={S.sl}>{t('active')} ({activeEvents.length})</div>
          {activeEvents.length === 0 ? <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginBottom: 20 }}>{t('noActive')}</p> : activeEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
          {pastEvents.length > 0 && <div style={{ marginTop: 18 }}>
            <div style={S.sl}>{t('past')} ({pastEvents.length})</div>
            {pastEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
          </div>}
        </>}
      </div>

      {/* ── CONFIRM DELETE ── */}
      {confirmDeleteId && (
        <div onClick={() => setConfirmDeleteId(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111115', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 16, padding: '24px 20px', maxWidth: 320, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 18 }}>{t('deleteConfirm')}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDeleteId(null)} style={{ ...S.btn(false), flex: 1 }}>{t('confirmNo')}</button>
              <button onClick={() => deleteEvent(confirmDeleteId)} style={{ ...S.btn(false), flex: 1, background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>{t('confirmYes')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SHEET ── */}
      {sheetMode && (
        <>
          <div onClick={() => !saving && setSheetMode(null)} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', zIndex: 10001, left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: '100%', maxWidth: 560, background: '#111114', display: 'flex', flexDirection: 'column', boxShadow: '0 0 80px rgba(0,0,0,0.9)' }}>

            {/* ── HEADER ── */}
            <div style={{ flexShrink: 0, paddingTop: 'max(12px, env(safe-area-inset-top))', background: '#111114', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
              {/* title row */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 12px', gap: 8 }}>
                <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
                  {sheetMode === 'list' ? t('sheetListTitle') : sheetMode === 'packs' ? t('sheetPacksTitle') : t('sheetNewTitle')}
                </div>
                {/* ✕ — 44×44 touch target */}
                <button
                  onClick={() => setSheetMode(null)}
                  aria-label="Chiudi"
                  style={{ width: 44, height: 44, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >✕</button>
              </div>

              {/* tabs (new mode only) */}
              {sheetMode === 'new' && (
                <div style={{ display: 'flex', gap: 6, padding: '0 16px 12px' }}>
                  {([['packs', `📦 ${t('packsLabel')}`], ['list', `👥 ${t('sheetListTitle')}`]] as const).map(([tab, label]) => (
                    <button key={tab} onClick={() => setNewTab(tab)} style={{
                      flex: 1, padding: '10px 0', borderRadius: 9, fontSize: 13, fontWeight: 700,
                      border: newTab === tab ? 'none' : '1px solid rgba(255,255,255,0.12)',
                      cursor: 'pointer',
                      background: newTab === tab ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)',
                      color: newTab === tab ? '#ffffff' : '#94a3b8', // #94a3b8 = ~4.5:1 on #111114
                    }}>{label}</button>
                  ))}
                </div>
              )}
            </div>

            {/* ── STATS BAR (packs mode) ── */}
            {sheetMode === 'packs' && (() => {
              const validRows = rows.filter(r => r.name.trim());
              const withoutPacks = validRows.filter(r => r.p90 + r.p60 + r.p30 === 0).length;
              const totalRem = rem.p90 + rem.p60 + rem.p30;
              const media = withoutPacks > 0 ? (totalRem / withoutPacks) : 0;
              return (
                <div style={{ flexShrink: 0, display: 'flex', background: '#18181c', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
                  {/* Rimanenti */}
                  <div style={{ flex: 1, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Rimanenti</div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {([['90',rem.p90,PC['90']],['60',rem.p60,PC['60']],['30',rem.p30,PC['30']]] as const).map(([type,val,color]) => (
                        <span key={type} style={{ fontSize: 13, fontWeight: 900, color: val < 0 ? '#f87171' : color }}>{val}×{type}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />
                  {/* Media */}
                  <div style={{ flex: 1, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Media/player</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#c084fc', lineHeight: 1 }}>{withoutPacks > 0 ? media.toFixed(2).replace('.', ',') : '—'}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>({withoutPacks})</span>
                    </div>
                  </div>
                  <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />
                  {/* Assegnati */}
                  <div style={{ flex: 1, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Assegnati</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#f1f5f9', lineHeight: 1 }}>{assigned.p90+assigned.p60+assigned.p30}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>/{avail.p90+avail.p60+avail.p30}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── SCROLLABLE BODY ── */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '14px 16px 16px', width: '100%', boxSizing: 'border-box' }}>

              {/* PACKS INPUT */}
              {(sheetMode === 'packs' || (sheetMode === 'new' && newTab === 'packs')) && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 10 }}>{t('packsLabel')}</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {([['p90','90',PC['90']],['p60','60',PC['60']],['p30','30',PC['30']]] as const).map(([k, label, color]) => (
                      <div key={k} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>×{label}</div>
                        <input type="number" min="0" value={packs[k]} onChange={e => setPacks(p => ({ ...p, [k]: e.target.value }))}
                          style={{ ...IN, textAlign: 'center', fontSize: 18, fontWeight: 800, padding: '10px 4px', border: `1.5px solid ${color}50` }} />
                      </div>
                    ))}
                  </div>
                  {sheetMode === 'packs' && <div style={{ height: 1, background: 'rgba(255,255,255,0.09)', margin: '16px 0 0' }} />}
                  {sheetMode === 'new' && newTab === 'packs' && (
                    <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                      <button onClick={() => setSheetMode(null)} style={{ ...S.btn(false), flex: 1 }}>{t('cancel')}</button>
                      <button onClick={() => setNewTab('list')} style={{ ...S.btn(true), flex: 2 }}>👥 {t('sheetListTitle')} →</button>
                    </div>
                  )}
                </div>
              )}

              {/* PLAYER LIST */}
              {(sheetMode === 'list' || (sheetMode === 'new' && newTab === 'list')) && (
                <>
                  {/* column headers */}
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '0 3px 6px', marginLeft: 21 }}>
                    <span style={{ flex: 3, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{t('colName')}</span>
                    <span style={{ flex: 2, fontSize: 11, color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>
                      {t('colScore')} <span title={T[lang]?.scoreHint} style={{ color: '#a78bfa', cursor: 'help', fontSize: 12 }}>ⓘ</span>
                    </span>
                    <span style={{ flex: 2, fontSize: 11, color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>
                      {t('colDeaths')} <span title={T[lang]?.deathsHint} style={{ color: '#a78bfa', cursor: 'help', fontSize: 12 }}>ⓘ</span>
                    </span>
                    <span style={{ width: 44 }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {rows.map((row, idx) => (
                      <div key={row.id} style={{ display: 'flex', gap: 5, alignItems: 'center', background: idx % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)', borderRadius: 8, padding: '4px 4px' }}>
                        <span style={{ fontSize: 11, color: '#64748b', width: 18, flexShrink: 0, textAlign: 'right' }}>{idx + 1}</span>
                        <input style={{ ...IN, flex: 3 }} placeholder={t('colName')} value={row.name}
                          autoFocus={idx === rows.length - 1 && rows.length > 1}
                          onChange={e => updateRow(row.id, 'name', e.target.value)} />
                        <input style={{ ...IN, flex: 2, textAlign: 'center', padding: '8px 4px' }} placeholder="1200" inputMode="decimal" value={row.score} onChange={e => updateRow(row.id, 'score', e.target.value)} />
                        <input style={{ ...IN, flex: 2, textAlign: 'center', padding: '8px 4px' }} placeholder="0.7" inputMode="decimal" value={row.deaths} onChange={e => updateRow(row.id, 'deaths', e.target.value)} />
                        {/* 44×44 delete touch target */}
                        <button onClick={() => removeRow(row.id)} aria-label="Rimuovi giocatore" style={{ width: 44, height: 44, borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', cursor: 'pointer', color: '#f87171', fontSize: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}
                    <div ref={listEndRef} />
                  </div>

                  {/* Add player — 44px height */}
                  <button onClick={addRow} style={{ marginTop: 10, width: '100%', minHeight: 44, padding: '0 16px', borderRadius: 10, border: '1.5px dashed rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.06)', color: '#a78bfa', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    {t('addPlayer')}
                  </button>
                  <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <button onClick={() => setSheetMode(null)} style={{ ...S.btn(false), flex: 1 }}>{t('cancel')}</button>
                    <button onClick={saveList} disabled={saving || !rows.some(r => r.name.trim())} style={{ ...S.btn(true), flex: 2 }}>
                      {saving ? t('saving') : t('saveList')}
                    </button>
                  </div>
                </>
              )}

              {/* ASSIGN PACKS */}
              {sheetMode === 'packs' && (
                <>
                  <div style={{ fontSize: 12, color: '#fbbf24', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span>⚠</span><span>{t('maxPacksWarning')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {rows.filter(r => r.name.trim()).map((row, idx) => {
                      const total = row.p90 + row.p60 + row.p30;
                      const done = total >= 3;
                      return (
                        <div key={row.id} style={{
                          padding: '11px 12px', borderRadius: 12,
                          background: done ? 'rgba(74,222,128,0.06)' : idx % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${done ? 'rgba(74,222,128,0.25)' : total > 0 ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.07)'}`,
                        }}>
                          {/* ROW 1: info */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
                            <span style={{ fontSize: 11, color: '#64748b', width: 18, flexShrink: 0, textAlign: 'right' }}>{idx+1}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
                            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
                              {row.score && <span style={{ fontSize: 11, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>Pt. {fmt(row.score)}</span>}
                              {row.deaths && <span style={{ fontSize: 11, color: '#fca5a5', fontVariantNumeric: 'tabular-nums' }}>💀 {fmt(row.deaths)}</span>}
                              <span style={{ fontSize: 12, fontWeight: 800, minWidth: 28, textAlign: 'right', color: done ? '#4ade80' : total > 0 ? '#fbbf24' : '#475569' }}>{total}/3</span>
                            </div>
                          </div>
                          {/* ROW 2: controls — 44px height each button */}
                          <div style={{ display: 'flex', gap: 8 }}>
                            {([['p90','90',PC['90']],['p60','60',PC['60']],['p30','30',PC['30']]] as const).map(([k, label, color]) => (
                              <div key={k} style={{ flex: 1, display: 'flex', alignItems: 'center', borderRadius: 10, overflow: 'hidden', border: `1.5px solid ${row[k] > 0 ? color + '50' : 'rgba(255,255,255,0.1)'}`, background: row[k] > 0 ? `${color}12` : 'rgba(255,255,255,0.03)' }}>
                                {/* − button — 44px */}
                                <button
                                  onClick={() => changePack(row.id, k, -1)}
                                  aria-label={`Togli pacco ${label}`}
                                  style={{ width: 44, height: 44, border: 'none', background: 'transparent', color: row[k] > 0 ? '#e2e8f0' : '#475569', cursor: row[k] > 0 ? 'pointer' : 'default', fontSize: 20, lineHeight: 1, flexShrink: 0 }}
                                >−</button>
                                {/* count + label */}
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                  <div style={{ fontSize: 16, fontWeight: 900, color: row[k] > 0 ? color : '#475569', lineHeight: 1 }}>{row[k]}</div>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: row[k] > 0 ? color : '#475569', marginTop: 1 }}>×{label}</div>
                                </div>
                                {/* + button — 44px */}
                                <button
                                  onClick={() => changePack(row.id, k, +1)}
                                  disabled={done}
                                  aria-label={`Aggiungi pacco ${label}`}
                                  style={{ width: 44, height: 44, border: 'none', background: done ? 'transparent' : `${color}20`, color: done ? '#334155' : color, cursor: done ? 'not-allowed' : 'pointer', fontSize: 20, lineHeight: 1, flexShrink: 0 }}
                                >+</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* ── STICKY FOOTER BUTTONS ── */}
            {sheetMode === 'packs' && (
              <div style={{ flexShrink: 0, padding: '12px 16px', paddingBottom: 'max(12px, env(safe-area-inset-bottom))', borderTop: '1px solid rgba(255,255,255,0.09)', background: '#111114', display: 'flex', gap: 8 }}>
                <button onClick={() => setSheetMode(null)} style={{ flex: 1, minHeight: 48, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{t('cancel')}</button>
                <button onClick={savePacks} disabled={saving} style={{ flex: 1, minHeight: 48, borderRadius: 10, border: '1px solid rgba(124,58,237,0.4)', background: 'rgba(124,58,237,0.12)', color: '#c084fc', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                  {saving ? '...' : '💾 Pacchi'}
                </button>
                <button onClick={generateList} disabled={saving} style={{ flex: 2, minHeight: 48, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#ffffff', cursor: 'pointer', fontSize: 13, fontWeight: 800 }}>
                  {saving ? '...' : t('generateList')}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.35); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.6); }
        * { scrollbar-width: thin; scrollbar-color: rgba(124,58,237,0.35) transparent; }
      `}</style>
    </div>
  );
}
