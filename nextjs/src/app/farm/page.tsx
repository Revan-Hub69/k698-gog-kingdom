'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: {
    title: 'Gestione Farm',
    subtitle: 'Stato aggiornato di tutte le farm dell\'alleanza',
    castle: 'Castello', level: 'Livello', login: 'Login',
    m5: 'M5', pelicano: 'Pellicano', troops: 'truppe',
    sent: 'Data', received: 'Subita',
    nw: 'NW', hospital: 'Ospedali', notes: 'Note',
    never: 'Mai', forge: 'Forgia',
    filterAll: 'Tutti', filterPelicano: 'Con Pellicano',
    filterM5: 'Con M5', filterNw: 'NW Fatto',
    sortByReceived: 'Ordina per: Subita', sortBySent: 'Ordina per: Data',
    sortByLevel: 'Ordina per: Livello',
    addFarm: '+ Aggiungi Farm',
    editFarm: 'Modifica',
    deleteFarm: 'Elimina',
    pelicanoSent: '✈ Pellicanata fatta', pelicanoReceived: '🎯 Pellicanata subita',
    confirmDelete: 'Eliminare questa farm?',
    cancel: 'Annulla', save: 'Salva', saving: '...',
    cavalry: 'Cav.', ranged: 'Dist.', no: 'No',
    loginFunplus: 'FunPlus', loginGoogle: 'Google',
    farmName: 'Nome castello', loginName: 'Nome account',
    castleLevel: 'Livello (es. C40)',
    m5Type: 'Truppe M5', m5Count: 'Numero truppe M5',
    crystalForge: 'Forgia Cristalli', crystalForgeNote: 'Note forgia',
    pelicanoTroops: 'Truppe per pellicanata',
    nwDone: 'Evento NW completato',
    hospitalCapacity: 'Capienza ospedali',
    notesLabel: 'Note libere',
    yes: 'Sì',
    k: 'k',
  },
  EN: {
    title: 'Farm Management',
    subtitle: 'Updated status of all alliance farms',
    castle: 'Castle', level: 'Level', login: 'Login',
    m5: 'M5', pelicano: 'Pelican', troops: 'troops',
    sent: 'Sent', received: 'Received',
    nw: 'NW', hospital: 'Hospital', notes: 'Notes',
    never: 'Never', forge: 'Forge',
    filterAll: 'All', filterPelicano: 'With Pelican',
    filterM5: 'With M5', filterNw: 'NW Done',
    sortByReceived: 'Sort: Received', sortBySent: 'Sort: Sent',
    sortByLevel: 'Sort: Level',
    addFarm: '+ Add Farm',
    editFarm: 'Edit',
    deleteFarm: 'Delete',
    pelicanoSent: '✈ Pelican sent', pelicanoReceived: '🎯 Pelican received',
    confirmDelete: 'Delete this farm?',
    cancel: 'Cancel', save: 'Save', saving: '...',
    cavalry: 'Cav.', ranged: 'Rng.', no: 'No',
    loginFunplus: 'FunPlus', loginGoogle: 'Google',
    farmName: 'Castle name', loginName: 'Account name',
    castleLevel: 'Level (e.g. C40)',
    m5Type: 'M5 troops', m5Count: 'M5 troop count',
    crystalForge: 'Crystal Forge', crystalForgeNote: 'Forge notes',
    pelicanoTroops: 'Troops per pelican hit',
    nwDone: 'NW event completed',
    hospitalCapacity: 'Hospital capacity',
    notesLabel: 'Free notes',
    yes: 'Yes',
    k: 'k',
  },
  PL: { title: 'Zarządzanie Farmami', subtitle: 'Status wszystkich farm', castle: 'Zamek', level: 'Poziom', login: 'Login', m5: 'M5', pelicano: 'Pelikan', troops: 'wojsk', sent: 'Wysłany', received: 'Otrzymany', nw: 'NW', hospital: 'Szpital', notes: 'Notatki', never: 'Nigdy', forge: 'Kuźnia', filterAll: 'Wszystkie', filterPelicano: 'Z Pelikanem', filterM5: 'Z M5', filterNw: 'NW Zrobione', sortByReceived: 'Sortuj: Otrzymany', sortBySent: 'Sortuj: Wysłany', sortByLevel: 'Sortuj: Poziom', addFarm: '+ Dodaj Farmę', editFarm: 'Edytuj', deleteFarm: 'Usuń', pelicanoSent: '✈ Pelikan wysłany', pelicanoReceived: '🎯 Pelikan otrzymany', confirmDelete: 'Usunąć tę farmę?', cancel: 'Anuluj', save: 'Zapisz', saving: '...', cavalry: 'Kaw.', ranged: 'Dyst.', no: 'Nie', loginFunplus: 'FunPlus', loginGoogle: 'Google', farmName: 'Nazwa zamku', loginName: 'Nazwa konta', castleLevel: 'Poziom', m5Type: 'Wojska M5', m5Count: 'Liczba M5', crystalForge: 'Kuźnia Kryształów', crystalForgeNote: 'Notatki kuźni', pelicanoTroops: 'Wojska na pelikan', nwDone: 'Event NW ukończony', hospitalCapacity: 'Pojemność szpitala', notesLabel: 'Notatki', yes: 'Tak', k: 'k' },
  ZH: { title: '农场管理', subtitle: '联盟农场状态', castle: '城堡', level: '等级', login: '账号', m5: 'M5', pelicano: '鹈鹕', troops: '兵力', sent: '已发送', received: '已接收', nw: 'NW', hospital: '医院', notes: '备注', never: '从未', forge: '锻造', filterAll: '全部', filterPelicano: '有鹈鹕', filterM5: '有M5', filterNw: 'NW完成', sortByReceived: '排序:接收', sortBySent: '排序:发送', sortByLevel: '排序:等级', addFarm: '+ 添加农场', editFarm: '编辑', deleteFarm: '删除', pelicanoSent: '✈ 发送鹈鹕', pelicanoReceived: '🎯 接收鹈鹕', confirmDelete: '删除此农场？', cancel: '取消', save: '保存', saving: '...', cavalry: '骑兵', ranged: '远程', no: '否', loginFunplus: 'FunPlus', loginGoogle: 'Google', farmName: '城堡名称', loginName: '账号名称', castleLevel: '等级(如C40)', m5Type: 'M5部队', m5Count: 'M5数量', crystalForge: '晶体锻造', crystalForgeNote: '锻造备注', pelicanoTroops: '每次鹈鹕兵力', nwDone: 'NW事件完成', hospitalCapacity: '医院容量', notesLabel: '备注', yes: '是', k: 'k' },
  DE: { title: 'Farm-Verwaltung', subtitle: 'Aktueller Status aller Farmen', castle: 'Schloss', level: 'Stufe', login: 'Login', m5: 'M5', pelicano: 'Pelikan', troops: 'Truppen', sent: 'Gesendet', received: 'Empfangen', nw: 'NW', hospital: 'Krankenhaus', notes: 'Notizen', never: 'Nie', forge: 'Schmiede', filterAll: 'Alle', filterPelicano: 'Mit Pelikan', filterM5: 'Mit M5', filterNw: 'NW Erledigt', sortByReceived: 'Sortieren: Empfangen', sortBySent: 'Sortieren: Gesendet', sortByLevel: 'Sortieren: Stufe', addFarm: '+ Farm hinzufügen', editFarm: 'Bearbeiten', deleteFarm: 'Löschen', pelicanoSent: '✈ Pelikan gesendet', pelicanoReceived: '🎯 Pelikan empfangen', confirmDelete: 'Diese Farm löschen?', cancel: 'Abbrechen', save: 'Speichern', saving: '...', cavalry: 'Kav.', ranged: 'Fern.', no: 'Nein', loginFunplus: 'FunPlus', loginGoogle: 'Google', farmName: 'Schlossname', loginName: 'Kontoname', castleLevel: 'Stufe (z.B. C40)', m5Type: 'M5-Truppen', m5Count: 'M5-Anzahl', crystalForge: 'Kristallschmiede', crystalForgeNote: 'Schmiedenotizen', pelicanoTroops: 'Truppen pro Pelikan', nwDone: 'NW-Event abgeschlossen', hospitalCapacity: 'Krankenhauskapazität', notesLabel: 'Freie Notizen', yes: 'Ja', k: 'k' },
  FR: { title: 'Gestion des Fermes', subtitle: 'État actuel de toutes les fermes', castle: 'Château', level: 'Niveau', login: 'Login', m5: 'M5', pelicano: 'Pélican', troops: 'troupes', sent: 'Envoyé', received: 'Reçu', nw: 'NW', hospital: 'Hôpital', notes: 'Notes', never: 'Jamais', forge: 'Forge', filterAll: 'Tous', filterPelicano: 'Avec Pélican', filterM5: 'Avec M5', filterNw: 'NW Fait', sortByReceived: 'Trier: Reçu', sortBySent: 'Trier: Envoyé', sortByLevel: 'Trier: Niveau', addFarm: '+ Ajouter Ferme', editFarm: 'Modifier', deleteFarm: 'Supprimer', pelicanoSent: '✈ Pélican envoyé', pelicanoReceived: '🎯 Pélican reçu', confirmDelete: 'Supprimer cette ferme?', cancel: 'Annuler', save: 'Sauvegarder', saving: '...', cavalry: 'Cav.', ranged: 'Dist.', no: 'Non', loginFunplus: 'FunPlus', loginGoogle: 'Google', farmName: 'Nom du château', loginName: 'Nom du compte', castleLevel: 'Niveau (ex. C40)', m5Type: 'Troupes M5', m5Count: 'Nombre M5', crystalForge: 'Forge de cristaux', crystalForgeNote: 'Notes forge', pelicanoTroops: 'Troupes par pélican', nwDone: 'Événement NW terminé', hospitalCapacity: 'Capacité hôpital', notesLabel: 'Notes libres', yes: 'Oui', k: 'k' },
  RU: { title: 'Управление Фармами', subtitle: 'Актуальный статус всех ферм', castle: 'Замок', level: 'Уровень', login: 'Логин', m5: 'M5', pelicano: 'Пеликан', troops: 'войск', sent: 'Отправлен', received: 'Получен', nw: 'NW', hospital: 'Госпиталь', notes: 'Заметки', never: 'Никогда', forge: 'Кузня', filterAll: 'Все', filterPelicano: 'С Пеликаном', filterM5: 'С M5', filterNw: 'NW Выполнено', sortByReceived: 'Сортировка: Получен', sortBySent: 'Сортировка: Отправлен', sortByLevel: 'Сортировка: Уровень', addFarm: '+ Добавить Ферму', editFarm: 'Изменить', deleteFarm: 'Удалить', pelicanoSent: '✈ Пеликан отправлен', pelicanoReceived: '🎯 Пеликан получен', confirmDelete: 'Удалить эту ферму?', cancel: 'Отмена', save: 'Сохранить', saving: '...', cavalry: 'Кав.', ranged: 'Дал.', no: 'Нет', loginFunplus: 'FunPlus', loginGoogle: 'Google', farmName: 'Название замка', loginName: 'Имя аккаунта', castleLevel: 'Уровень (напр. C40)', m5Type: 'Войска M5', m5Count: 'Количество M5', crystalForge: 'Кузня кристаллов', crystalForgeNote: 'Заметки кузни', pelicanoTroops: 'Войска на пеликана', nwDone: 'Событие NW завершено', hospitalCapacity: 'Вместимость госпиталя', notesLabel: 'Свободные заметки', yes: 'Да', k: 'k' },
  ES: { title: 'Gestión de Granjas', subtitle: 'Estado actualizado de todas las granjas', castle: 'Castillo', level: 'Nivel', login: 'Login', m5: 'M5', pelicano: 'Pelícano', troops: 'tropas', sent: 'Enviado', received: 'Recibido', nw: 'NW', hospital: 'Hospital', notes: 'Notas', never: 'Nunca', forge: 'Forja', filterAll: 'Todos', filterPelicano: 'Con Pelícano', filterM5: 'Con M5', filterNw: 'NW Hecho', sortByReceived: 'Ordenar: Recibido', sortBySent: 'Ordenar: Enviado', sortByLevel: 'Ordenar: Nivel', addFarm: '+ Agregar Granja', editFarm: 'Editar', deleteFarm: 'Eliminar', pelicanoSent: '✈ Pelícano enviado', pelicanoReceived: '🎯 Pelícano recibido', confirmDelete: '¿Eliminar esta granja?', cancel: 'Cancelar', save: 'Guardar', saving: '...', cavalry: 'Cab.', ranged: 'Dist.', no: 'No', loginFunplus: 'FunPlus', loginGoogle: 'Google', farmName: 'Nombre del castillo', loginName: 'Nombre de cuenta', castleLevel: 'Nivel (ej. C40)', m5Type: 'Tropas M5', m5Count: 'Cantidad M5', crystalForge: 'Forja de cristales', crystalForgeNote: 'Notas forja', pelicanoTroops: 'Tropas por pelícano', nwDone: 'Evento NW completado', hospitalCapacity: 'Capacidad hospital', notesLabel: 'Notas libres', yes: 'Sí', k: 'k' },
};

interface Farm {
  id: number;
  loginType: string;
  loginName: string;
  castleName: string;
  castleLevel: string;
  m5Type: string;
  m5Count: number;
  crystalForge: boolean;
  crystalForgeNote: string | null;
  pelicano: boolean;
  pelicanoTroops: number;
  lastPelicanSent: string | null;
  lastPelicanReceived: string | null;
  nwDone: boolean;
  hospitalCapacity: number;
  notes: string | null;
  sortOrder: number;
}

const EMPTY_FARM: Omit<Farm, 'id' | 'sortOrder'> = {
  loginType: 'funplus', loginName: '', castleName: '', castleLevel: '',
  m5Type: 'no', m5Count: 0, crystalForge: false, crystalForgeNote: null,
  pelicano: false, pelicanoTroops: 0, lastPelicanSent: null, lastPelicanReceived: null,
  nwDone: false, hospitalCapacity: 0, notes: null,
};

function fmtDate(d: string | null, never: string): string {
  if (!d) return never;
  return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function fmtTroops(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.', ',') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k';
  return String(n);
}

const IN: React.CSSProperties = { background: '#16161a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none', padding: '8px 10px', boxSizing: 'border-box', width: '100%' };
const SEL: React.CSSProperties = { ...IN, cursor: 'pointer', appearance: 'none' } as React.CSSProperties;

type SortKey = 'received' | 'sent' | 'level' | 'default';
type FilterKey = 'all' | 'pelicano' | 'm5' | 'nw';

export default function FarmPage() {
  const [lang, setLang] = useState<Lang>('IT');
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');
  const [sort, setSort] = useState<SortKey>('default');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sheetMode, setSheetMode] = useState<'add' | 'edit' | null>(null);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState<Omit<Farm, 'id' | 'sortOrder'>>(EMPTY_FARM);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [pelicanoLoading, setPelicanoLoading] = useState<Record<number, string>>({});

  const t = (k: string) => T[lang]?.[k] || T['EN'][k] || k;

  useEffect(() => {
    const s = localStorage.getItem('lang') as Lang | null;
    if (s && LANGS.includes(s)) setLang(s);
    else { const br = navigator.language.split('-')[0].toUpperCase() as Lang; if (LANGS.includes(br)) setLang(br); }
    const tok = localStorage.getItem('token') || '';
    setToken(tok);
    if (tok) {
      try { const p = JSON.parse(atob(tok.split('.')[1])); if (p.isAdmin) setIsAdmin(true); } catch {}
    }
    fetch('/api/farms').then(r => r.json()).then(d => { setFarms(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const handleAuthChange = useCallback((tok: string | null, _n: string | null, admin: boolean) => {
    setToken(tok || ''); setIsAdmin(admin);
  }, []);

  const reload = () => fetch('/api/farms').then(r => r.json()).then(d => setFarms(Array.isArray(d) ? d : []));

  const openAdd = () => { setFormData({ ...EMPTY_FARM }); setEditingFarm(null); setSheetMode('add'); };
  const openEdit = (f: Farm) => { setFormData({ ...f }); setEditingFarm(f); setSheetMode('edit'); };

  const saveFarm = async () => {
    setSaving(true);
    if (sheetMode === 'add') {
      await fetch('/api/farms', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
    } else if (editingFarm) {
      await fetch(`/api/farms/${editingFarm.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
    }
    await reload(); setSaving(false); setSheetMode(null);
  };

  const deleteFarm = async (id: number) => {
    await fetch(`/api/farms/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    await reload(); setConfirmDeleteId(null);
  };

  const pelicanoAction = async (id: number, type: 'sent' | 'received') => {
    setPelicanoLoading(p => ({ ...p, [id]: type }));
    await fetch(`/api/farms/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(type === 'sent' ? { pelicanoSentNow: true } : { pelicanoReceivedNow: true }),
    });
    await reload();
    setPelicanoLoading(p => { const n = { ...p }; delete n[id]; return n; });
  };

  const filtered = useMemo(() => {
    let list = [...farms];
    if (filter === 'pelicano') list = list.filter(f => f.pelicano);
    if (filter === 'm5') list = list.filter(f => f.m5Type !== 'no');
    if (filter === 'nw') list = list.filter(f => f.nwDone);
    if (sort === 'received') list.sort((a, b) => {
      if (!a.lastPelicanReceived && !b.lastPelicanReceived) return 0;
      if (!a.lastPelicanReceived) return 1;
      if (!b.lastPelicanReceived) return -1;
      return new Date(a.lastPelicanReceived).getTime() - new Date(b.lastPelicanReceived).getTime();
    });
    if (sort === 'sent') list.sort((a, b) => {
      if (!a.lastPelicanSent && !b.lastPelicanSent) return 0;
      if (!a.lastPelicanSent) return 1;
      if (!b.lastPelicanSent) return -1;
      return new Date(a.lastPelicanSent).getTime() - new Date(b.lastPelicanSent).getTime();
    });
    if (sort === 'level') list.sort((a, b) => a.castleLevel.localeCompare(b.castleLevel));
    return list;
  }, [farms, filter, sort]);

  const upd = (k: keyof typeof formData, v: unknown) => setFormData(p => ({ ...p, [k]: v }));

  const S = {
    page: { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' } as React.CSSProperties,
    btn: (primary: boolean): React.CSSProperties => ({ padding: '8px 14px', borderRadius: 9, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', background: primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff' }),
    btnXs: (col: string): React.CSSProperties => ({ padding: '4px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700, border: `1px solid ${col}30`, background: `${col}10`, color: col, cursor: 'pointer', whiteSpace: 'nowrap' }),
    chip: (active: boolean): React.CSSProperties => ({ padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', background: active ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: active ? '#fff' : 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }),
    card: { padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 6 } as React.CSSProperties,
  };

  return (
    <div style={S.page}>
      <KvkHeader lang={lang} onLang={l => { setLang(l); localStorage.setItem('lang', l); }} onAuthChange={handleAuthChange} />

      {/* Title */}
      <div style={{ padding: '14px 16px 10px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 3px', background: 'linear-gradient(135deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title')}</h1>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{t('subtitle')}</p>
      </div>

      {/* Controls */}
      <div style={{ padding: '0 16px 12px', maxWidth: 640, margin: '0 auto' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {(['all', 'pelicano', 'm5', 'nw'] as FilterKey[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={S.chip(filter === f)}>
              {t({ all: 'filterAll', pelicano: 'filterPelicano', m5: 'filterM5', nw: 'filterNw' }[f])}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
            style={{ ...SEL, width: 'auto', padding: '5px 10px', fontSize: 11, fontWeight: 700, minWidth: 140 }}>
            <option value="default">Ordine default</option>
            <option value="received">{t('sortByReceived')}</option>
            <option value="sent">{t('sortBySent')}</option>
            <option value="level">{t('sortByLevel')}</option>
          </select>
        </div>
        {isAdmin && <button onClick={openAdd} style={{ ...S.btn(true), width: '100%', marginBottom: 4 }}>{t('addFarm')}</button>}
      </div>

      {/* Farm cards */}
      <div style={{ padding: '0 16px 40px', maxWidth: 640, margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '24px 0' }}>...</p>}
        {!loading && filtered.length === 0 && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>—</p>}

        {filtered.map(farm => (
          <div key={farm.id} style={S.card}>
            {/* Row 1: Castle name + level + login */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{farm.castleName}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 5, background: 'rgba(124,58,237,0.15)', color: '#c084fc', border: '1px solid rgba(124,58,237,0.25)' }}>{farm.castleLevel}</span>
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 5, background: farm.loginType === 'funplus' ? 'rgba(251,191,36,0.12)' : 'rgba(96,165,250,0.12)', color: farm.loginType === 'funplus' ? '#fbbf24' : '#60a5fa', border: `1px solid ${farm.loginType === 'funplus' ? '#fbbf2422' : '#60a5fa22'}` }}>
                    {farm.loginType === 'funplus' ? t('loginFunplus') : t('loginGoogle')}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{farm.loginName}</div>
              </div>
              {/* NW badge */}
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: farm.nwDone ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.05)', color: farm.nwDone ? '#4ade80' : 'rgba(255,255,255,0.3)', border: `1px solid ${farm.nwDone ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`, flexShrink: 0 }}>NW {farm.nwDone ? t('yes') : t('no')}</span>
            </div>

            {/* Row 2: M5 + Forge + Pelicano + Hospital */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {/* M5 */}
              <div style={{ padding: '4px 9px', borderRadius: 7, background: farm.m5Type !== 'no' ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${farm.m5Type !== 'no' ? 'rgba(248,113,113,0.25)' : 'rgba(255,255,255,0.07)'}` }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: farm.m5Type !== 'no' ? '#f87171' : 'rgba(255,255,255,0.4)' }}>M5: </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: farm.m5Type !== 'no' ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                  {farm.m5Type === 'no' ? t('no') : `${farm.m5Type === 'cavalry' ? t('cavalry') : t('ranged')} ${fmtTroops(farm.m5Count)}`}
                </span>
              </div>
              {/* Forge */}
              <div style={{ padding: '4px 9px', borderRadius: 7, background: farm.crystalForge ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${farm.crystalForge ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.07)'}` }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: farm.crystalForge ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}>⚗ </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: farm.crystalForge ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}>
                  {farm.crystalForge ? t('yes') : (farm.crystalForgeNote || t('no'))}
                </span>
              </div>
              {/* Pelicano */}
              {farm.pelicano && (
                <div style={{ padding: '4px 9px', borderRadius: 7, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa' }}>🦢 </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa' }}>{fmtTroops(farm.pelicanoTroops)}</span>
                </div>
              )}
              {/* Hospital */}
              {farm.hospitalCapacity > 0 && (
                <div style={{ padding: '4px 9px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>🏥 </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{fmtTroops(farm.hospitalCapacity)}</span>
                </div>
              )}
            </div>

            {/* Row 3: Pelican dates */}
            {farm.pelicano && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(167,139,250,0.7)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>✈ {t('sent')}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: farm.lastPelicanSent ? '#fff' : 'rgba(255,255,255,0.3)' }}>{fmtDate(farm.lastPelicanSent, t('never'))}</div>
                </div>
                <div style={{ flex: 1, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(248,113,113,0.7)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>🎯 {t('received')}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: farm.lastPelicanReceived ? '#fff' : 'rgba(255,255,255,0.3)' }}>{fmtDate(farm.lastPelicanReceived, t('never'))}</div>
                </div>
              </div>
            )}
            {/* No pelicano — show M5-based note for received */}
            {!farm.pelicano && farm.m5Type === 'no' && (
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 6, fontStyle: 'italic' }}>
                🎯 {t('received')}: {t('never')} (no M5)
              </div>
            )}

            {/* Notes */}
            {farm.notes && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', marginBottom: 8 }}>📝 {farm.notes}</div>}

            {/* Admin actions */}
            {isAdmin && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {farm.pelicano && <>
                  <button onClick={() => pelicanoAction(farm.id, 'sent')} disabled={!!pelicanoLoading[farm.id]} style={S.btnXs('#a78bfa')}>
                    {pelicanoLoading[farm.id] === 'sent' ? '...' : t('pelicanoSent')}
                  </button>
                  <button onClick={() => pelicanoAction(farm.id, 'received')} disabled={!!pelicanoLoading[farm.id]} style={S.btnXs('#f87171')}>
                    {pelicanoLoading[farm.id] === 'received' ? '...' : t('pelicanoReceived')}
                  </button>
                </>}
                <button onClick={() => openEdit(farm)} style={S.btnXs('#c084fc')}>{t('editFarm')}</button>
                <button onClick={() => setConfirmDeleteId(farm.id)} style={S.btnXs('#f87171')}>{t('deleteFarm')}</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm delete */}
      {confirmDeleteId && (
        <div onClick={() => setConfirmDeleteId(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#111115', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 16, padding: '24px 20px', maxWidth: 320, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 18 }}>{t('confirmDelete')}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDeleteId(null)} style={{ ...S.btn(false), flex: 1 }}>{t('cancel')}</button>
              <button onClick={() => deleteFarm(confirmDeleteId)} style={{ ...S.btn(false), flex: 1, background: 'rgba(239,68,68,0.2)', color: '#f87171' }}>{t('deleteFarm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit sheet */}
      {sheetMode && (
        <>
          <div onClick={() => !saving && setSheetMode(null)} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }} />
          <div style={{ position: 'fixed', zIndex: 10001, left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: '100%', maxWidth: 560, background: '#111114', display: 'flex', flexDirection: 'column', boxShadow: '0 0 80px rgba(0,0,0,0.9)' }}>
            <div style={{ flexShrink: 0, paddingTop: 'max(12px, env(safe-area-inset-top))', background: '#111114', borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px 12px', gap: 8 }}>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 800, color: '#fff' }}>{sheetMode === 'add' ? t('addFarm') : t('editFarm')}</div>
                <button onClick={() => setSheetMode(null)} style={{ width: 44, height: 44, borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', cursor: 'pointer', fontSize: 18 }}>✕</button>
              </div>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '14px 16px 20px' }}>
              {/* Login type */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Login</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['funplus', 'google'].map(lt => (
                    <button key={lt} onClick={() => upd('loginType', lt)} style={{ flex: 1, padding: '9px', borderRadius: 9, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', background: formData.loginType === lt ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: formData.loginType === lt ? '#fff' : '#94a3b8' }}>
                      {lt === 'funplus' ? t('loginFunplus') : t('loginGoogle')}
                    </button>
                  ))}
                </div>
              </div>

              {[
                ['loginName', t('loginName'), 'text'],
                ['castleName', t('farmName'), 'text'],
                ['castleLevel', t('castleLevel'), 'text'],
              ].map(([k, label, type]) => (
                <div key={k} style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input type={type} style={IN} value={(formData as Record<string, unknown>)[k] as string || ''} onChange={e => upd(k as keyof typeof formData, e.target.value)} />
                </div>
              ))}

              {/* M5 */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>{t('m5Type')}</label>
                <div style={{ display: 'flex', gap: 6, marginBottom: formData.m5Type !== 'no' ? 8 : 0 }}>
                  {['no', 'cavalry', 'ranged'].map(v => (
                    <button key={v} onClick={() => upd('m5Type', v)} style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', background: formData.m5Type === v ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: formData.m5Type === v ? '#fff' : '#94a3b8' }}>
                      {v === 'no' ? t('no') : v === 'cavalry' ? t('cavalry') : t('ranged')}
                    </button>
                  ))}
                </div>
                {formData.m5Type !== 'no' && (
                  <input type="number" style={IN} placeholder={t('m5Count')} value={formData.m5Count || ''} onChange={e => upd('m5Count', Number(e.target.value))} />
                )}
              </div>

              {/* Crystal Forge */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>{t('crystalForge')}</label>
                <div style={{ display: 'flex', gap: 6, marginBottom: !formData.crystalForge ? 8 : 0 }}>
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => upd('crystalForge', v)} style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', background: formData.crystalForge === v ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: formData.crystalForge === v ? '#fff' : '#94a3b8' }}>
                      {v ? t('yes') : t('no')}
                    </button>
                  ))}
                </div>
                {!formData.crystalForge && (
                  <input type="text" style={IN} placeholder={t('crystalForgeNote')} value={formData.crystalForgeNote || ''} onChange={e => upd('crystalForgeNote', e.target.value)} />
                )}
              </div>

              {/* Pelicano */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>🦢 {t('pelicano')}</label>
                <div style={{ display: 'flex', gap: 6, marginBottom: formData.pelicano ? 8 : 0 }}>
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => upd('pelicano', v)} style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', background: formData.pelicano === v ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: formData.pelicano === v ? '#fff' : '#94a3b8' }}>
                      {v ? t('yes') : t('no')}
                    </button>
                  ))}
                </div>
                {formData.pelicano && (
                  <input type="number" style={IN} placeholder={t('pelicanoTroops')} value={formData.pelicanoTroops || ''} onChange={e => upd('pelicanoTroops', Number(e.target.value))} />
                )}
              </div>

              {/* NW Done */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>{t('nwDone')}</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => upd('nwDone', v)} style={{ flex: 1, padding: '8px', borderRadius: 8, fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer', background: formData.nwDone === v ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: formData.nwDone === v ? '#fff' : '#94a3b8' }}>
                      {v ? t('yes') : t('no')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hospital + Notes */}
              {[
                ['hospitalCapacity', t('hospitalCapacity'), 'number'],
                ['notes', t('notesLabel'), 'text'],
              ].map(([k, label, type]) => (
                <div key={k} style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input type={type} style={IN} value={(formData as Record<string, unknown>)[k] as string || ''} onChange={e => upd(k as keyof typeof formData, type === 'number' ? Number(e.target.value) : e.target.value)} />
                </div>
              ))}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button onClick={() => setSheetMode(null)} style={{ ...S.btn(false), flex: 1 }}>{t('cancel')}</button>
                <button onClick={saveFarm} disabled={saving} style={{ ...S.btn(true), flex: 2 }}>{saving ? t('saving') : t('save')}</button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.35);border-radius:2px}
        *{scrollbar-width:thin;scrollbar-color:rgba(124,58,237,0.35) transparent}
        select option{background:#111114}
      `}</style>
    </div>
  );
}
