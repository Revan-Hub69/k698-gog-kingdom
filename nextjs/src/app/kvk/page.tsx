'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: { title: 'Pacchi KVK', active: 'EVENTI ATTIVI', past: 'EVENTI PASSATI', newEvent: '+ Nuovo Evento KVK', noActive: 'Nessun evento attivo.', noPast: 'Nessun evento passato.', players: 'giocatori', packs: 'pacchi', isActive: 'Attivo', closed: 'Chiuso', edit: '✏️ Modifica', view: 'Visualizza', sheetTitle: 'Nuovo Evento KVK', sheetEditTitle: 'Modifica Evento KVK', secPacks: '① Pacchi Disponibili', secPacksHint: 'Quanti pacchi hai da distribuire?', savePacks: 'Salva Pacchi', secPlayers: '② Lista Giocatori', secPlayersHint: 'Aggiungi i giocatori con punti e morti KVK', colName: 'Nome', colScore: 'Punti KVK', colDeaths: 'Morti', addPlayer: '+ Aggiungi giocatore', savePlayers: 'Salva Lista', secAssign: '③ Assegna Pacchi', secAssignHint: 'Assegna i pacchi a ogni giocatore', remaining: 'Rimanenti', assigned: 'Assegnati', generateList: '🚀 Genera Lista', cancel: 'Annulla', saved: 'Salvato ✓', saving: '...', scoreHint: 'Es: 1500 = 1.5 miliardi', deathsHint: 'Numero di morti in KVK' },
  EN: { title: 'KVK Packages', active: 'ACTIVE EVENTS', past: 'PAST EVENTS', newEvent: '+ New KVK Event', noActive: 'No active events.', noPast: 'No past events.', players: 'players', packs: 'packs', isActive: 'Active', closed: 'Closed', edit: '✏️ Edit', view: 'View', sheetTitle: 'New KVK Event', sheetEditTitle: 'Edit KVK Event', secPacks: '① Available Packs', secPacksHint: 'How many packs do you have to distribute?', savePacks: 'Save Packs', secPlayers: '② Players List', secPlayersHint: 'Add players with KVK score and deaths', colName: 'Name', colScore: 'KVK Score', colDeaths: 'Deaths', addPlayer: '+ Add player', savePlayers: 'Save List', secAssign: '③ Assign Packs', secAssignHint: 'Assign packs to each player', remaining: 'Remaining', assigned: 'Assigned', generateList: '🚀 Generate List', cancel: 'Cancel', saved: 'Saved ✓', saving: '...', scoreHint: 'e.g. 1500 = 1.5B', deathsHint: 'KVK deaths count' },
  PL: { title: 'Pakiety KvK', active: 'AKTYWNE', past: 'MINIONE', newEvent: '+ Nowe KVK', noActive: 'Brak.', noPast: 'Brak.', players: 'gracze', packs: 'paczki', isActive: 'Aktywny', closed: 'Zamknięty', edit: '✏️ Edytuj', view: 'Zobacz', sheetTitle: 'Nowe KVK', sheetEditTitle: 'Edytuj KVK', secPacks: '① Dostępne Paczki', secPacksHint: 'Ile paczek masz do rozdania?', savePacks: 'Zapisz', secPlayers: '② Lista Graczy', secPlayersHint: 'Dodaj graczy z punktami i śmiertelnością', colName: 'Nazwa', colScore: 'Punkty KVK', colDeaths: 'Śmierci', addPlayer: '+ Dodaj', savePlayers: 'Zapisz listę', secAssign: '③ Przydziel Paczki', secAssignHint: 'Przydziel paczki każdemu graczowi', remaining: 'Pozostało', assigned: 'Przydzielono', generateList: '🚀 Generuj listę', cancel: 'Anuluj', saved: 'Zapisano ✓', saving: '...', scoreHint: 'np. 1500 = 1.5B', deathsHint: 'Liczba śmierci' },
  ZH: { title: 'KVK礼包', active: '活跃', past: '历史', newEvent: '+ 新KVK', noActive: '无。', noPast: '无。', players: '玩家', packs: '礼包', isActive: '活跃', closed: '已关闭', edit: '✏️ 编辑', view: '查看', sheetTitle: '新KVK活动', sheetEditTitle: '编辑KVK', secPacks: '① 可用礼包', secPacksHint: '您有多少礼包可分配？', savePacks: '保存', secPlayers: '② 玩家列表', secPlayersHint: '添加玩家KVK积分和死亡数', colName: '名称', colScore: 'KVK积分', colDeaths: '死亡数', addPlayer: '+ 添加', savePlayers: '保存列表', secAssign: '③ 分配礼包', secAssignHint: '为每个玩家分配礼包', remaining: '剩余', assigned: '已分配', generateList: '🚀 生成列表', cancel: '取消', saved: '已保存 ✓', saving: '...', scoreHint: '例: 1500 = 1.5B', deathsHint: 'KVK死亡数' },
  DE: { title: 'KVK-Pakete', active: 'AKTIV', past: 'VERGANGEN', newEvent: '+ Neues KVK', noActive: 'Keine.', noPast: 'Keine.', players: 'Spieler', packs: 'Pakete', isActive: 'Aktiv', closed: 'Geschlossen', edit: '✏️ Bearbeiten', view: 'Ansehen', sheetTitle: 'Neues KVK', sheetEditTitle: 'KVK bearbeiten', secPacks: '① Verfügbare Pakete', secPacksHint: 'Wie viele Pakete haben Sie zu verteilen?', savePacks: 'Speichern', secPlayers: '② Spielerliste', secPlayersHint: 'Spieler mit KVK-Punkten und Toden', colName: 'Name', colScore: 'KVK-Punkte', colDeaths: 'Tode', addPlayer: '+ Hinzufügen', savePlayers: 'Liste speichern', secAssign: '③ Pakete zuweisen', secAssignHint: 'Pakete jedem Spieler zuweisen', remaining: 'Verbleibend', assigned: 'Zugewiesen', generateList: '🚀 Liste generieren', cancel: 'Abbrechen', saved: 'Gespeichert ✓', saving: '...', scoreHint: 'z.B. 1500 = 1.5B', deathsHint: 'Anzahl der Tode' },
  FR: { title: 'Packages KvK', active: 'ACTIFS', past: 'PASSÉS', newEvent: '+ Nouveau KVK', noActive: 'Aucun.', noPast: 'Aucun.', players: 'joueurs', packs: 'packages', isActive: 'Actif', closed: 'Fermé', edit: '✏️ Modifier', view: 'Voir', sheetTitle: 'Nouveau KVK', sheetEditTitle: 'Modifier KVK', secPacks: '① Packages disponibles', secPacksHint: 'Combien de packages avez-vous à distribuer?', savePacks: 'Enregistrer', secPlayers: '② Liste des joueurs', secPlayersHint: 'Ajoutez les joueurs avec score et morts KvK', colName: 'Nom', colScore: 'Score KvK', colDeaths: 'Morts', addPlayer: '+ Ajouter', savePlayers: 'Sauvegarder', secAssign: '③ Attribuer packages', secAssignHint: 'Attribuez des packages à chaque joueur', remaining: 'Restants', assigned: 'Attribués', generateList: '🚀 Générer la liste', cancel: 'Annuler', saved: 'Sauvegardé ✓', saving: '...', scoreHint: 'ex: 1500 = 1.5B', deathsHint: 'Nombre de morts' },
  RU: { title: 'Пакеты KvK', active: 'АКТИВНЫЕ', past: 'ПРОШЕДШИЕ', newEvent: '+ Новое KVK', noActive: 'Нет.', noPast: 'Нет.', players: 'игроки', packs: 'пакеты', isActive: 'Активно', closed: 'Закрыто', edit: '✏️ Изменить', view: 'Просмотр', sheetTitle: 'Новое KVK', sheetEditTitle: 'Изменить KVK', secPacks: '① Доступные пакеты', secPacksHint: 'Сколько пакетов вы можете раздать?', savePacks: 'Сохранить', secPlayers: '② Список игроков', secPlayersHint: 'Добавьте игроков с очками и смертями KvK', colName: 'Имя', colScore: 'Очки KvK', colDeaths: 'Смерти', addPlayer: '+ Добавить', savePlayers: 'Сохранить список', secAssign: '③ Назначить пакеты', secAssignHint: 'Назначьте пакеты каждому игроку', remaining: 'Осталось', assigned: 'Назначено', generateList: '🚀 Создать список', cancel: 'Отмена', saved: 'Сохранено ✓', saving: '...', scoreHint: 'напр. 1500 = 1.5B', deathsHint: 'Количество смертей' },
  ES: { title: 'Paquetes KvK', active: 'ACTIVOS', past: 'PASADOS', newEvent: '+ Nuevo KVK', noActive: 'No hay.', noPast: 'No hay.', players: 'jugadores', packs: 'paquetes', isActive: 'Activo', closed: 'Cerrado', edit: '✏️ Editar', view: 'Ver', sheetTitle: 'Nuevo KVK', sheetEditTitle: 'Editar KVK', secPacks: '① Paquetes disponibles', secPacksHint: '¿Cuántos paquetes tienes para distribuir?', savePacks: 'Guardar', secPlayers: '② Lista de jugadores', secPlayersHint: 'Agrega jugadores con puntos y muertes KvK', colName: 'Nombre', colScore: 'Puntos KvK', colDeaths: 'Muertes', addPlayer: '+ Agregar', savePlayers: 'Guardar lista', secAssign: '③ Asignar paquetes', secAssignHint: 'Asigna paquetes a cada jugador', remaining: 'Restantes', assigned: 'Asignados', generateList: '🚀 Generar lista', cancel: 'Cancelar', saved: '¡Guardado ✓', saving: '...', scoreHint: 'ej: 1500 = 1.5B', deathsHint: 'Número de muertes' },
};

interface PlayerRow { id: number; name: string; score: string; deaths: string; p90: number; p60: number; p30: number }
interface KvkEvent { id: number; name: string; date: string; pack90Total: number; pack60Total: number; pack30Total: number; isActive: boolean; _count: { players: number } }

let _uid = 1;
const mkRow = (): PlayerRow => ({ id: _uid++, name: '', score: '', deaths: '', p90: 0, p60: 0, p30: 0 });

const PC = { '90': '#f87171', '60': '#fbbf24', '30': '#a78bfa' };
const IN: React.CSSProperties = { background: '#16161a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', padding: '9px 10px', boxSizing: 'border-box', width: '100%' };
const SEC: React.CSSProperties = { marginBottom: 28 };
const SEC_TITLE: React.CSSProperties = { fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 3 };
const SEC_HINT: React.CSSProperties = { fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 14 };

export default function KvkPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('IT');
  const [events, setEvents] = useState<KvkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');

  const [showSheet, setShowSheet] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);

  // Section 1: packs
  const [packs, setPacks] = useState({ p90: '3', p60: '33', p30: '140' });
  const [packsSaved, setPacksSaved] = useState(false);

  // Section 2: players
  const [rows, setRows] = useState<PlayerRow[]>([mkRow()]);
  const [playersSaved, setPlayersSaved] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  // Section 3: assign
  const [generating, setGenerating] = useState(false);

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

  const addRow = () => {
    setRows(prev => [...prev, mkRow()]);
    setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 50);
  };

  const removeRow = (id: number) => setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);

  const changePack = (id: number, type: 'p90' | 'p60' | 'p30', delta: number) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [type]: Math.max(0, r[type] + delta) } : r));

  const assigned = rows.reduce((s, r) => ({ p90: s.p90 + r.p90, p60: s.p60 + r.p60, p30: s.p30 + r.p30 }), { p90: 0, p60: 0, p30: 0 });
  const avail = { p90: Number(packs.p90), p60: Number(packs.p60), p30: Number(packs.p30) };
  const rem = { p90: avail.p90 - assigned.p90, p60: avail.p60 - assigned.p60, p30: avail.p30 - assigned.p30 };

  const generateList = async () => {
    setGenerating(true);
    const today = new Date();
    const date = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}/${today.getFullYear()}`;
    const valid = rows.filter(r => r.name.trim());

    let eventId: number;
    if (editingEventId) {
      await fetch(`/api/kvk/events/${editingEventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pack90Total: avail.p90, pack60Total: avail.p60, pack30Total: avail.p30 }),
      });
      eventId = editingEventId;
    } else {
      const evRes = await fetch('/api/kvk/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: `Lista Pacchi KVK ${date}`, date, pack90Total: avail.p90, pack60Total: avail.p60, pack30Total: avail.p30 }),
      });
      if (!evRes.ok) { setGenerating(false); return; }
      eventId = (await evRes.json()).id;
    }

    if (valid.length > 0) {
      await fetch('/api/kvk/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          eventId,
          players: valid.map((r, i) => ({
            pos: i + 1, name: r.name.trim(), alliance: null,
            score: Math.round(Number(r.score.replace(',', '.')) * 1e6) || 0,
            under100m: false, notes: r.deaths ? `morti: ${r.deaths}` : null,
          })),
        }),
      });
      const pList = await (await fetch(`/api/kvk/players?eventId=${eventId}`)).json();
      await Promise.all(pList.map((p: { id: number }, idx: number) => {
        const row = valid[idx];
        if (!row || (row.p90 === 0 && row.p60 === 0 && row.p30 === 0)) return Promise.resolve();
        return fetch(`/api/kvk/players/${p.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ pack90: row.p90, pack60: row.p60, pack30: row.p30 }),
        });
      }));
    }
    router.push(`/kvk/${eventId}`);
  };

  const openSheet = () => {
    setEditingEventId(null);
    setRows([mkRow()]);
    setPacks({ p90: '3', p60: '33', p30: '140' });
    setPacksSaved(false); setPlayersSaved(false);
    setShowSheet(true);
  };

  const openEditSheet = async (ev: KvkEvent) => {
    setEditingEventId(ev.id);
    setPacks({ p90: String(ev.pack90Total), p60: String(ev.pack60Total), p30: String(ev.pack30Total) });
    setPacksSaved(true);
    const res = await fetch(`/api/kvk/players?eventId=${ev.id}`);
    const pls = await res.json();
    setRows(Array.isArray(pls) && pls.length > 0
      ? pls.map((p: { name: string; score: number; notes: string | null; pack90: number; pack60: number; pack30: number }) => ({
          id: _uid++, name: p.name,
          score: p.score > 0 ? String(Math.round(p.score / 1e6)) : '',
          deaths: p.notes?.replace('morti: ', '') ?? '',
          p90: p.pack90, p60: p.pack60, p30: p.pack30,
        }))
      : [mkRow()]);
    setPlayersSaved(true);
    setShowSheet(true);
  };

  const activeEvents = events.filter(e => e.isActive);
  const pastEvents = events.filter(e => !e.isActive);

  const S = {
    page: { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' } as React.CSSProperties,
    sectionLabel: { fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 6, marginLeft: 2 },
    card: (active: boolean): React.CSSProperties => ({ display: 'block', padding: '11px 14px', borderRadius: 12, background: active ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)'}`, textDecoration: 'none', cursor: 'pointer' }),
    btn: (primary: boolean): React.CSSProperties => ({ padding: '10px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff', whiteSpace: 'nowrap' }),
    btnSm: (primary: boolean): React.CSSProperties => ({ padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', background: primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff', whiteSpace: 'nowrap' }),
    savedBadge: { fontSize: 11, fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(74,222,128,0.2)' } as React.CSSProperties,
  };

  const EventCard = ({ ev }: { ev: KvkEvent }) => (
    <div style={{ position: 'relative', marginBottom: 6 }}>
      <Link href={`/kvk/${ev.id}`} style={{ ...S.card(ev.isActive), display: 'block', paddingRight: isAdmin ? 96 : 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{ev.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{ev.date} · {ev._count.players} {t('players')}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {([['90', ev.pack90Total, '#f87171'], ['60', ev.pack60Total, '#fbbf24'], ['30', ev.pack30Total, '#a78bfa']] as const).map(([type, count, color]) => (
            <span key={type} style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 5, background: `${color}14`, color, border: `1px solid ${color}22` }}>{count}×{type}</span>
          ))}
        </div>
      </Link>
      {isAdmin && (
        <button onClick={() => openEditSheet(ev)} style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', ...S.btnSm(false), border: '1px solid rgba(124,58,237,0.25)', color: '#c084fc' }}>
          {t('edit')}
        </button>
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
          <button onClick={openSheet} style={{ ...S.btn(true), width: '100%' }}>{t('newEvent')}</button>
        </div>
      )}

      <div style={{ padding: '0 16px 40px', maxWidth: 480, margin: '0 auto' }}>
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
          <div onClick={() => !generating && setShowSheet(false)} style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'fixed', zIndex: 999, left: 0, right: 0, bottom: 0, maxHeight: '94dvh', background: '#0d0d10', borderTop: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column', boxShadow: '0 -20px 80px rgba(0,0,0,0.8)' }}>

            {/* handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0', flexShrink: 0 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 18px 12px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{editingEventId ? t('sheetEditTitle') : t('sheetTitle')}</div>
              <button onClick={() => setShowSheet(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 22, cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
            </div>

            {/* scrollable content */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '20px 18px 32px', maxWidth: 560, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

              {/* ── SECTION 1: PACKS ── */}
              <div style={SEC}>
                <div style={SEC_TITLE}>{t('secPacks')}</div>
                <div style={SEC_HINT}>{t('secPacksHint')}</div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  {([['p90', '90', PC['90']], ['p60', '60', PC['60']], ['p30', '30', PC['30']]] as const).map(([k, label, color]) => (
                    <div key={k} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color, marginBottom: 6 }}>×{label}</div>
                      <input type="number" min="0" value={packs[k]} onChange={e => { setPacks(p => ({ ...p, [k]: e.target.value })); setPacksSaved(false); }}
                        style={{ ...IN, textAlign: 'center', fontSize: 18, fontWeight: 800, padding: '10px 4px', border: `1px solid ${color}40` }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => setPacksSaved(true)} style={{ ...S.btn(true), flex: 1 }}>{t('savePacks')}</button>
                  {packsSaved && <span style={S.savedBadge}>{t('saved')}</span>}
                </div>
              </div>

              {/* ── SECTION 2: PLAYERS ── */}
              <div style={SEC}>
                <div style={SEC_TITLE}>{t('secPlayers')}</div>
                <div style={SEC_HINT}>{t('secPlayersHint')}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rows.map((row, idx) => (
                    <div key={row.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', width: 18, flexShrink: 0 }}>{idx + 1}</span>
                        <input
                          style={{ ...IN, flex: 1 }}
                          placeholder={t('colName')}
                          value={row.name}
                          autoFocus={idx === rows.length - 1}
                          onChange={e => { updateRow(row.id, 'name', e.target.value); setPlayersSaved(false); }}
                        />
                        <button onClick={() => { removeRow(row.id); setPlayersSaved(false); }} style={{ width: 30, height: 36, borderRadius: 7, border: '1px solid rgba(255,255,255,0.06)', background: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', fontSize: 14, flexShrink: 0 }}>✕</button>
                      </div>
                      <div style={{ display: 'flex', gap: 8, paddingLeft: 24 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{t('colScore')}</span>
                            <span title={t('scoreHint')} style={{ fontSize: 10, color: 'rgba(124,58,237,0.6)', cursor: 'help' }}>ⓘ</span>
                          </div>
                          <input style={{ ...IN, textAlign: 'center' }} placeholder="M" type="number" min="0" value={row.score} onChange={e => { updateRow(row.id, 'score', e.target.value); setPlayersSaved(false); }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{t('colDeaths')}</span>
                            <span title={t('deathsHint')} style={{ fontSize: 10, color: 'rgba(124,58,237,0.6)', cursor: 'help' }}>ⓘ</span>
                          </div>
                          <input style={{ ...IN, textAlign: 'center' }} placeholder="0" type="number" min="0" value={row.deaths} onChange={e => { updateRow(row.id, 'deaths', e.target.value); setPlayersSaved(false); }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={listEndRef} />
                </div>

                <button onClick={addRow} style={{ marginTop: 8, width: '100%', padding: '9px', borderRadius: 9, border: '1px dashed rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.05)', color: 'rgba(124,58,237,0.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {t('addPlayer')}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                  <button onClick={() => setPlayersSaved(true)} style={{ ...S.btn(true), flex: 1 }} disabled={!rows.some(r => r.name.trim())}>{t('savePlayers')}</button>
                  {playersSaved && <span style={S.savedBadge}>{t('saved')}</span>}
                </div>
              </div>

              {/* ── SECTION 3: ASSIGN PACKS ── */}
              <div style={{ ...SEC, opacity: playersSaved ? 1 : 0.4, pointerEvents: playersSaved ? 'auto' : 'none' }}>
                <div style={SEC_TITLE}>{t('secAssign')}</div>
                <div style={SEC_HINT}>{t('secAssignHint')}</div>

                {/* remaining bar */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginRight: 4, alignSelf: 'center' }}>{t('remaining')}:</span>
                  {([['90', rem.p90, PC['90']], ['60', rem.p60, PC['60']], ['30', rem.p30, PC['30']]] as const).map(([type, val, color]) => (
                    <span key={type} style={{ fontSize: 14, fontWeight: 900, color: val < 0 ? '#ef4444' : color }}>{val}×{type}</span>
                  ))}
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.25)', alignSelf: 'center' }}>
                    {t('assigned')}: {assigned.p90 + assigned.p60 + assigned.p30}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                  {rows.filter(r => r.name.trim()).map((row, idx) => (
                    <div key={row.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', width: 18, flexShrink: 0 }}>{idx + 1}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
                        {row.score && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{row.score}M</span>}
                        <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                          {([['p90', '90', PC['90']], ['p60', '60', PC['60']], ['p30', '30', PC['30']]] as const).map(([k, label, color]) =>
                            Array.from({ length: row[k] }).map((_, i) => (
                              <span key={`${k}-${i}`} style={{ fontSize: 10, fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: `${color}18`, color, border: `1px solid ${color}30` }}>{label}</span>
                            ))
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {([['p90', '90', PC['90']], ['p60', '60', PC['60']], ['p30', '30', PC['30']]] as const).map(([k, label, color]) => (
                          <div key={k} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 3, background: `${color}08`, borderRadius: 8, padding: '5px 6px', border: `1px solid ${color}18` }}>
                            <button onClick={() => changePack(row.id, k, -1)} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.06)', color: '#fff', cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>−</button>
                            <span style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 800, color }}>{row[k]}</span>
                            <button onClick={() => changePack(row.id, k, +1)} style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: `${color}22`, color, cursor: 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>+</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={generateList} disabled={generating} style={{ ...S.btn(true), width: '100%', fontSize: 14, padding: '13px', opacity: generating ? 0.7 : 1 }}>
                  {generating ? t('saving') : t('generateList')}
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
