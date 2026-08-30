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
          deaths: p.notes?.replace('morti: ', '') ?? '',
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
          {([['90','#f87171'],[`60`,'#fbbf24'],['30','#a78bfa']] as const).map(([type, color]) => (
            <span key={type} style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: `${color}14`, color, border: `1px solid ${color}22` }}>
              {type === '90' ? ev.pack90Total : type === '60' ? ev.pack60Total : ev.pack30Total}×{type}
            </span>
          ))}
        </div>
      </Link>
      {isAdmin && (
        <div style={{ display: 'flex', gap: 5, marginTop: 4, paddingLeft: 2 }}>
          <button onClick={() => loadEventData(ev).then(() => setSheetMode('list'))} style={S.btnXs('#c084fc')}>{t('editList')}</button>
          <button onClick={() => loadEventData(ev).then(() => setSheetMode('packs'))} style={S.btnXs('#60a5fa')}>{t('assignPacks')}</button>
          <button onClick={() => setConfirmDeleteId(ev.id)} style={S.btnXs('#f87171')}>{t('deleteEvent')}</button>
        </div>
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
          <div onClick={() => !saving && setSheetMode(null)} style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'fixed', zIndex: 999, left: 0, right: 0, bottom: 0, maxHeight: '92dvh', background: '#0d0d10', borderTop: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column', boxShadow: '0 -20px 80px rgba(0,0,0,0.8)' }}>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0', flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px 0', flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
                {sheetMode === 'list' ? t('sheetListTitle') : sheetMode === 'packs' ? t('sheetPacksTitle') : t('sheetNewTitle')}
              </div>
              <button onClick={() => setSheetMode(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 22, cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
            </div>

            {/* tab switcher for new mode */}
            {sheetMode === 'new' && (
              <div style={{ display: 'flex', gap: 4, padding: '10px 18px 0', flexShrink: 0 }}>
                {([['packs', `📦 ${t('packsLabel')}`], ['list', `👥 ${t('sheetListTitle')}`]] as const).map(([tab, label]) => (
                  <button key={tab} onClick={() => setNewTab(tab)} style={{ flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', background: newTab === tab ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.05)', color: newTab === tab ? '#fff' : 'rgba(255,255,255,0.4)' }}>{label}</button>
                ))}
              </div>
            )}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '10px 0 0', flexShrink: 0 }} />

            {/* scrollable body — thin modern scrollbar */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 18px 28px', maxWidth: 520, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

              {/* PACKS INPUT */}
              {(sheetMode === 'packs' || (sheetMode === 'new' && newTab === 'packs')) && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('packsLabel')}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {([['p90','90',PC['90']],['p60','60',PC['60']],['p30','30',PC['30']]] as const).map(([k, label, color]) => (
                      <div key={k} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 5 }}>×{label}</div>
                        <input type="number" min="0" value={packs[k]} onChange={e => setPacks(p => ({ ...p, [k]: e.target.value }))}
                          style={{ ...IN, textAlign: 'center', fontSize: 16, fontWeight: 800, padding: '8px 4px', border: `1px solid ${color}35` }} />
                      </div>
                    ))}
                  </div>
                  {sheetMode === 'packs' && <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '16px 0 0' }} />}
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
                  <div style={{ display: 'grid', gridTemplateColumns: '16px 1fr 56px 50px 28px', gap: 5, alignItems: 'center', padding: '0 4px', marginBottom: 5 }}>
                    <span />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>{t('colName')}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700, textAlign: 'center' }}>
                      {t('colScore')} <span title={T[lang]?.scoreHint} style={{ color: 'rgba(124,58,237,0.6)', cursor: 'help' }}>ⓘ</span>
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 700, textAlign: 'center' }}>
                      {t('colDeaths')} <span title={T[lang]?.deathsHint} style={{ color: 'rgba(124,58,237,0.6)', cursor: 'help' }}>ⓘ</span>
                    </span>
                    <span />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {rows.map((row, idx) => (
                      <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '16px 1fr 56px 50px 28px', gap: 5, alignItems: 'center', background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderRadius: 8, padding: '4px' }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', textAlign: 'right', paddingRight: 2 }}>{idx + 1}</span>
                        <input style={IN} placeholder={t('colName')} value={row.name}
                          autoFocus={idx === rows.length - 1 && rows.length > 1}
                          onChange={e => updateRow(row.id, 'name', e.target.value)} />
                        <input style={{ ...IN, textAlign: 'center', padding: '7px 4px' }} placeholder="M" inputMode="decimal" value={row.score} onChange={e => updateRow(row.id, 'score', e.target.value)} />
                        <input style={{ ...IN, textAlign: 'center', padding: '7px 4px' }} placeholder="M" inputMode="decimal" value={row.deaths} onChange={e => updateRow(row.id, 'deaths', e.target.value)} />
                        <button onClick={() => removeRow(row.id)} style={{ width: 28, height: 32, borderRadius: 6, border: '1px solid rgba(255,80,80,0.15)', background: 'rgba(255,80,80,0.06)', cursor: 'pointer', color: 'rgba(255,100,100,0.5)', fontSize: 13 }}>✕</button>
                      </div>
                    ))}
                    <div ref={listEndRef} />
                  </div>

                  <button onClick={addRow} style={{ marginTop: 8, width: '100%', padding: '8px', borderRadius: 8, border: '1px dashed rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)', color: 'rgba(124,58,237,0.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    {t('addPlayer')}
                  </button>
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
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
                  {/* remaining */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12, padding: '9px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginRight: 2 }}>{t('remaining')}:</span>
                    {([['90',rem.p90,PC['90']],['60',rem.p60,PC['60']],['30',rem.p30,PC['30']]] as const).map(([type, val, color]) => (
                      <span key={type} style={{ fontSize: 14, fontWeight: 900, color: val < 0 ? '#ef4444' : color }}>{val}×{type}</span>
                    ))}
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{t('assigned')}: {assigned.p90+assigned.p60+assigned.p30}</span>
                  </div>
                  {/* max warning note */}
                  <div style={{ fontSize: 11, color: 'rgba(255,200,100,0.6)', marginBottom: 10 }}>⚠ {t('maxPacksWarning')}</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 16 }}>
                    {rows.filter(r => r.name.trim()).map((row, idx) => {
                      const total = row.p90 + row.p60 + row.p30;
                      return (
                        <div key={row.id} style={{ background: idx % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)', borderRadius: 10, padding: '9px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', width: 18, flexShrink: 0 }}>{idx+1}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
                            {row.score && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{row.score}M</span>}
                            <span style={{ fontSize: 11, fontWeight: 800, color: total >= 3 ? '#4ade80' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{total}/3</span>
                            <div style={{ display: 'flex', gap: 3 }}>
                              {([['p90','90',PC['90']],['p60','60',PC['60']],['p30','30',PC['30']]] as const).map(([k,label,color]) =>
                                Array.from({length: row[k]}).map((_,i) => (
                                  <span key={`${k}-${i}`} style={{ fontSize: 10, fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: `${color}18`, color, border: `1px solid ${color}30` }}>{label}</span>
                                ))
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {([['p90',PC['90']],['p60',PC['60']],['p30',PC['30']]] as const).map(([k, color]) => (
                              <div key={k} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3, background: `${color}08`, borderRadius: 8, padding: '4px 5px', border: `1px solid ${color}18` }}>
                                <button onClick={() => changePack(row.id, k, -1)} style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: 'rgba(255,255,255,0.06)', color: '#fff', cursor: 'pointer', fontSize: 15, lineHeight: 1 }}>−</button>
                                <span style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 900, color }}>{row[k]}</span>
                                <button onClick={() => changePack(row.id, k, +1)} disabled={total >= 3} style={{ width: 26, height: 26, borderRadius: 5, border: 'none', background: total >= 3 ? 'rgba(255,255,255,0.03)' : `${color}22`, color: total >= 3 ? 'rgba(255,255,255,0.15)' : color, cursor: total >= 3 ? 'not-allowed' : 'pointer', fontSize: 15, lineHeight: 1 }}>+</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setSheetMode(null)} style={{ ...S.btn(false), flex: 1 }}>{t('cancel')}</button>
                    <button onClick={generateList} disabled={saving} style={{ ...S.btn(true), flex: 2, fontSize: 14, padding: '12px' }}>
                      {saving ? t('saving') : t('generateList')}
                    </button>
                  </div>
                </>
              )}
            </div>
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
