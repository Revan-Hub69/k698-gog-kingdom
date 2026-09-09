'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

// ── NW SCHEDULE ──────────────────────────────────────────────────────────────
const NW_REFERENCE   = new Date('2026-09-08T00:00:00Z');
const NW_CYCLE_MS    = 14 * 24 * 60 * 60 * 1000;
const NW_DURATION_MS = 2  * 24 * 60 * 60 * 1000;
function getNwStatus(now = new Date()) {
  const pos = ((now.getTime() - NW_REFERENCE.getTime()) % NW_CYCLE_MS + NW_CYCLE_MS) % NW_CYCLE_MS;
  return pos < NW_DURATION_MS
    ? { active: true,  ms: NW_DURATION_MS - pos }
    : { active: false, ms: NW_CYCLE_MS - pos };
}
// Returns start of the current/last NW cycle
function currentCycleStart(now = new Date()): Date {
  const ms = now.getTime() - NW_REFERENCE.getTime();
  const offset = ((ms % NW_CYCLE_MS) + NW_CYCLE_MS) % NW_CYCLE_MS;
  return new Date(now.getTime() - offset);
}
// Was nwLastDone within the current NW cycle?
function nwDoneInCurrentCycle(nwLastDone: string | null): boolean {
  if (!nwLastDone) return false;
  const done = new Date(nwLastDone);
  const cycleStart = currentCycleStart();
  const cycleEnd   = new Date(cycleStart.getTime() + NW_DURATION_MS);
  return done >= cycleStart && done <= cycleEnd;
}
function fmtCountdown(ms: number) {
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
  return h >= 48 ? `${Math.ceil(h/24)} gg` : h > 0 ? `${h}h ${m}m` : `${m}m`;
}
// ─────────────────────────────────────────────────────────────────────────────

const LANGS = ['IT','EN','PL','ZH','DE','FR','RU','ES'] as const;
type Lang = typeof LANGS[number];

const T: Record<Lang, Record<string,string>> = {
  IT: { title:'Farm', add:'+ Aggiungi', edit:'Modifica', del:'Elimina', cancel:'Annulla', save:'Salva', saving:'...', confirmDel:'Eliminare questa farm?',
        col_castle:'CASTELLO', col_lvl:'LVL', col_m5:'M5', col_forge:'FORGIA',
        col_pel:'PELLICANO', col_sent:'ULT. INVIATA', col_recv:'ULT. SUBITA', col_nw:'NW', col_hosp:'OSP.',
        nwActive:'NEW WORLD ATTIVO', nwInactive:'Prossimo New World', nwEnds:'termina tra', nwStarts:'tra',
        sentBtn:'Segna: Pellicanata inviata', recvBtn:'Segna: Pellicanata subita',
        fM5No:'No M5', fM5Cav:'M5 Cav.', fM5Rng:'M5 Dist.',
        fForgeY:'Forgia Sì', fForgeN:'Forgia No',
        fNwY:'NW Sì', fNwN:'NW No',
        never:'—', yes:'Sì', no:'No', cav:'Cav.', rng:'Dist.', fp:'FP', goo:'GO',
        lName:'Account', cName:'Castello', cLvl:'Livello (es. C40)', lType:'Login',
        m5Type:'Truppe M5', m5Cnt:'Numero truppe M5', forge:'Forgia cristalli',
        forgeNote:'Motivo (es. missioni iniziali)', pelicano:'Pellicano', pelTroops:'Truppe per pellicanata',
        nwDone:'New World completato', hosp:'Capienza ospedali', notes:'Note libere',
        actionTitle:'Azioni', cavalry:'Cavalleria', ranged:'Distanza' },
  EN: { title:'Farm', add:'+ Add farm', edit:'Edit', del:'Delete', cancel:'Cancel', save:'Save', saving:'...', confirmDel:'Delete this farm?',
        col_castle:'CASTLE', col_lvl:'LVL', col_m5:'M5', col_forge:'FORGE',
        col_pel:'PELICAN', col_sent:'LAST SENT', col_recv:'LAST RECV.', col_nw:'NW', col_hosp:'HOSP.',
        nwActive:'NEW WORLD ACTIVE', nwInactive:'Next New World', nwEnds:'ends in', nwStarts:'in',
        sentBtn:'Mark: Pelican sent', recvBtn:'Mark: Pelican received',
        fM5No:'No M5', fM5Cav:'M5 Cav.', fM5Rng:'M5 Rng.',
        fForgeY:'Forge Yes', fForgeN:'Forge No',
        fNwY:'NW Yes', fNwN:'NW No',
        never:'—', yes:'Yes', no:'No', cav:'Cav.', rng:'Rng.', fp:'FP', goo:'GO',
        lName:'Account', cName:'Castle name', cLvl:'Level (e.g. C40)', lType:'Login type',
        m5Type:'M5 troops', m5Cnt:'M5 troop count', forge:'Crystal forge',
        forgeNote:'Reason (e.g. finish missions)', pelicano:'Has pelican', pelTroops:'Troops per pelican',
        nwDone:'NW done', hosp:'Hospital capacity', notes:'Free notes',
        actionTitle:'Actions', cavalry:'Cavalry', ranged:'Ranged' },
  PL: { title:'Farmy', add:'+ Dodaj', edit:'Edytuj', del:'Usuń', cancel:'Anuluj', save:'Zapisz', saving:'...', confirmDel:'Usunąć farmę?', col_castle:'ZAMEK', col_lvl:'POZ', col_m5:'M5', col_forge:'KUŹNIA', col_pel:'PELIKAN', col_sent:'OST. WYSŁ.', col_recv:'OST. OTRZ.', col_nw:'NW', col_hosp:'SZPIT.', nwActive:'NEW WORLD AKTYWNE', nwInactive:'Następne NW', nwEnds:'kończy za', nwStarts:'za', sentBtn:'Zaznacz: Pelikan wysłany', recvBtn:'Zaznacz: Pelikan otrzymany', fM5No:'Brak M5', fM5Cav:'M5 Kaw.', fM5Rng:'M5 Dys.', fForgeY:'Kuźnia Tak', fForgeN:'Kuźnia Nie', fNwY:'NW Tak', fNwN:'NW Nie', never:'—', yes:'Tak', no:'Nie', cav:'Kaw.', rng:'Dys.', fp:'FP', goo:'GO', lName:'Konto', cName:'Zamek', cLvl:'Poziom', lType:'Login', m5Type:'M5', m5Cnt:'Liczba M5', forge:'Kuźnia kryształów', forgeNote:'Uwagi', pelicano:'Pelikan', pelTroops:'Wojska', nwDone:'NW', hosp:'Szpital', notes:'Notatki', actionTitle:'Akcje', cavalry:'Kawaleria', ranged:'Dystans' },
  ZH: { title:'农场', add:'+ 添加', edit:'编辑', del:'删除', cancel:'取消', save:'保存', saving:'...', confirmDel:'删除此农场？', col_castle:'城堡', col_lvl:'等级', col_m5:'M5', col_forge:'锻造', col_pel:'鹈鹕', col_sent:'上次发', col_recv:'上次收', col_nw:'NW', col_hosp:'医院', nwActive:'NW活跃', nwInactive:'下次NW', nwEnds:'结束', nwStarts:'开始', sentBtn:'标记：已发送', recvBtn:'标记：已接收', fM5No:'无M5', fM5Cav:'M5骑', fM5Rng:'M5远', fForgeY:'锻造是', fForgeN:'锻造否', fNwY:'NW是', fNwN:'NW否', never:'—', yes:'是', no:'否', cav:'骑', rng:'远', fp:'FP', goo:'GO', lName:'账号', cName:'城堡', cLvl:'等级', lType:'登录', m5Type:'M5', m5Cnt:'M5数', forge:'锻造', forgeNote:'备注', pelicano:'鹈鹕', pelTroops:'兵力', nwDone:'NW', hosp:'医院', notes:'备注', actionTitle:'操作', cavalry:'骑兵', ranged:'远程' },
  DE: { title:'Farmen', add:'+ Hinzuf.', edit:'Bearbeiten', del:'Löschen', cancel:'Abbrechen', save:'Speichern', saving:'...', confirmDel:'Farm löschen?', col_castle:'SCHLOSS', col_lvl:'STF', col_m5:'M5', col_forge:'SCHM.', col_pel:'PELIKAN', col_sent:'LETZT.GES.', col_recv:'LETZT.EMP.', col_nw:'NW', col_hosp:'KH', nwActive:'NW AKTIV', nwInactive:'Nächstes NW', nwEnds:'endet in', nwStarts:'in', sentBtn:'Markieren: Gesendet', recvBtn:'Markieren: Empfangen', fM5No:'Kein M5', fM5Cav:'M5 Kav.', fM5Rng:'M5 Fern.', fForgeY:'Schm. Ja', fForgeN:'Schm. Nein', fNwY:'NW Ja', fNwN:'NW Nein', never:'—', yes:'Ja', no:'Nein', cav:'Kav.', rng:'Fern.', fp:'FP', goo:'GO', lName:'Konto', cName:'Schloss', cLvl:'Stufe', lType:'Login', m5Type:'M5', m5Cnt:'M5-Anzahl', forge:'Schmiede', forgeNote:'Notizen', pelicano:'Pelikan', pelTroops:'Truppen', nwDone:'NW', hosp:'KH', notes:'Notizen', actionTitle:'Aktionen', cavalry:'Kavallerie', ranged:'Fernkampf' },
  FR: { title:'Fermes', add:'+ Ajouter', edit:'Modifier', del:'Suppr.', cancel:'Annuler', save:'Sauv.', saving:'...', confirmDel:'Supprimer?', col_castle:'CHÂTEAU', col_lvl:'NIV', col_m5:'M5', col_forge:'FORGE', col_pel:'PÉLICAN', col_sent:'DER.ENV.', col_recv:'DER.REC.', col_nw:'NW', col_hosp:'HÔPIT.', nwActive:'NW ACTIF', nwInactive:'Prochain NW', nwEnds:'termine', nwStarts:'dans', sentBtn:'Marquer: Envoyé', recvBtn:'Marquer: Reçu', fM5No:'Sans M5', fM5Cav:'M5 Cav.', fM5Rng:'M5 Dis.', fForgeY:'Forge Oui', fForgeN:'Forge Non', fNwY:'NW Oui', fNwN:'NW Non', never:'—', yes:'Oui', no:'Non', cav:'Cav.', rng:'Dis.', fp:'FP', goo:'GO', lName:'Compte', cName:'Château', cLvl:'Niveau', lType:'Login', m5Type:'M5', m5Cnt:'Troupes M5', forge:'Forge', forgeNote:'Notes', pelicano:'Pélican', pelTroops:'Troupes', nwDone:'NW', hosp:'Hôpital', notes:'Notes', actionTitle:'Actions', cavalry:'Cavalerie', ranged:'Distance' },
  RU: { title:'Фармы', add:'+ Добавить', edit:'Изменить', del:'Удалить', cancel:'Отмена', save:'Сохранить', saving:'...', confirmDel:'Удалить ферму?', col_castle:'ЗАМОК', col_lvl:'УР.', col_m5:'M5', col_forge:'КУЗНЯ', col_pel:'ПЕЛИКАН', col_sent:'ПОС.ОТПР.', col_recv:'ПОС.ПОЛУЧ.', col_nw:'NW', col_hosp:'ГОСП.', nwActive:'NW АКТИВНО', nwInactive:'Следующий NW', nwEnds:'заканч.', nwStarts:'через', sentBtn:'Отметить: Отправлен', recvBtn:'Отметить: Получен', fM5No:'Нет M5', fM5Cav:'M5 Кав.', fM5Rng:'M5 Дал.', fForgeY:'Кузня Да', fForgeN:'Кузня Нет', fNwY:'NW Да', fNwN:'NW Нет', never:'—', yes:'Да', no:'Нет', cav:'Кав.', rng:'Дал.', fp:'FP', goo:'GO', lName:'Аккаунт', cName:'Замок', cLvl:'Уровень', lType:'Логин', m5Type:'M5', m5Cnt:'Войска M5', forge:'Кузня', forgeNote:'Заметки', pelicano:'Пеликан', pelTroops:'Войска', nwDone:'NW', hosp:'Госп.', notes:'Заметки', actionTitle:'Действия', cavalry:'Кавалерия', ranged:'Дальний бой' },
  ES: { title:'Granjas', add:'+ Agregar', edit:'Editar', del:'Elim.', cancel:'Cancelar', save:'Guardar', saving:'...', confirmDel:'¿Eliminar?', col_castle:'CASTILLO', col_lvl:'NIV', col_m5:'M5', col_forge:'FORJA', col_pel:'PELÍCANO', col_sent:'ÚLT.ENV.', col_recv:'ÚLT.REC.', col_nw:'NW', col_hosp:'HOSP.', nwActive:'NW ACTIVO', nwInactive:'Próximo NW', nwEnds:'termina', nwStarts:'en', sentBtn:'Marcar: Enviado', recvBtn:'Marcar: Recibido', fM5No:'Sin M5', fM5Cav:'M5 Cab.', fM5Rng:'M5 Dis.', fForgeY:'Forja Sí', fForgeN:'Forja No', fNwY:'NW Sí', fNwN:'NW No', never:'—', yes:'Sí', no:'No', cav:'Cab.', rng:'Dis.', fp:'FP', goo:'GO', lName:'Cuenta', cName:'Castillo', cLvl:'Nivel', lType:'Login', m5Type:'M5', m5Cnt:'Tropas M5', forge:'Forja', forgeNote:'Notas', pelicano:'Pelícano', pelTroops:'Tropas', nwDone:'NW', hosp:'Hospital', notes:'Notas', actionTitle:'Acciones', cavalry:'Caballería', ranged:'Distancia' },
};

interface Farm {
  id:number; loginType:string; loginName:string; castleName:string; castleLevel:string;
  m5Cavalry:number; m5Ranged:number;
  crystalForge:boolean; crystalForgeNote:string|null;
  pelicano:boolean; pelicanoTroops:number; lastPelicanSent:string|null;
  lastPelicanReceived:string|null; nwLastDone:string|null; nwOptimized:boolean;
  hospitalCapacity:number; notes:string|null; sortOrder:number;
}
const EMPTY: Omit<Farm,'id'|'sortOrder'> = {
  loginType:'funplus', loginName:'', castleName:'', castleLevel:'',
  m5Cavalry:0, m5Ranged:0, crystalForge:false, crystalForgeNote:null,
  pelicano:false, pelicanoTroops:0, lastPelicanSent:null,
  lastPelicanReceived:null, nwLastDone:null, nwOptimized:false, hospitalCapacity:0, notes:null,
};

function fmtTroops(n:number) {
  if (!n) return '—';
  if (n >= 1000000) return (n/1e6).toFixed(1).replace('.',',')+' M';
  return n >= 1000 ? Math.round(n/1000)+'k' : String(n);
}
function fmtDate(d:string|null) {
  if (!d) return null;
  const dt = new Date(d);
  return dt.toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'2-digit'});
}
// "Ultima subita" — giorni passati + ora UTC, con colore urgenza
function fmtReceived(d:string|null): { text:string; color:string } | null {
  if (!d) return null;
  const now     = new Date();
  const date    = new Date(d);
  const diffMs  = now.getTime() - date.getTime();
  const diffDays= Math.floor(diffMs / 86400000);
  const h = String(date.getUTCHours()).padStart(2,'0');
  const m = String(date.getUTCMinutes()).padStart(2,'0');
  const text  = `${diffDays} GG ${h}:${m}`;
  const color = diffDays > 4 ? C.green : diffDays >= 2 ? C.amber : C.red;
  return { text, color };
}

// Colour tokens (WCAG AA ≥ 4.5:1 on dark bg)
const C = {
  bg:'#0a0a0d', surface:'#111116', surface2:'#17171d', border:'rgba(255,255,255,0.08)',
  text:'#e2e8f0', muted:'#94a3b8', faint:'#475569',
  purple:'#a78bfa', blue:'#60a5fa', green:'#4ade80', red:'#f87171', amber:'#fbbf24',
};
const IN: React.CSSProperties = { background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:'none', padding:'9px 11px', boxSizing:'border-box', width:'100%' };

type SortKey = 'castleName'|'castleLevel'|'m5Cavalry'|'pelicanoTroops'|'lastPelicanSent'|'lastPelicanReceived'|'nwLastDone'|'hospitalCapacity';
interface SortState { key: SortKey; dir: 'asc'|'desc' }

interface Filters {
  m5:         string[];  // 'no' | 'cavalry' | 'ranged'  — no esclude gli altri
  forge:      string[];  // 'yes' | 'no'  — radio
  nw:         string[];  // 'yes' | 'no'  — radio
  nwOpt:      boolean;   // filtro ottimizzato NW
}

export default function FarmPage() {
  const [lang,   setLang]   = useState<Lang>('IT');
  const [farms,  setFarms]  = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token,   setToken]   = useState('');
  const [forgeTooltip, setForgeTooltip] = useState<{text:string; x:number; y:number}|null>(null);

  const [sort, setSort] = useState<SortState>({ key:'lastPelicanReceived', dir:'asc' });

  // Multi-select filters
  const [filters, setFilters] = useState<Filters>({ m5:[], forge:[], nw:[], nwOpt:false });

  const [sheet,      setSheet]      = useState<'add'|'edit'|null>(null);
  const [editing,    setEditing]    = useState<Farm|null>(null);
  const [form,       setForm]       = useState<Omit<Farm,'id'|'sortOrder'>>(EMPTY);
  const [saving,     setSaving]     = useState(false);
  const [delId,      setDelId]      = useState<number|null>(null);
  const [actionFarm, setActionFarm] = useState<Farm|null>(null);
  const [pelLoading, setPelLoading] = useState<Record<number,string>>({});
  const lastAccount = useRef<{loginType:string; loginName:string}>({loginType:'funplus', loginName:''});
  const [search, setSearch] = useState('');
  const [savedName, setSavedName] = useState<string|null>(null);
  const [nw,         setNw]         = useState(getNwStatus());

  const t = (k:string) => T[lang]?.[k] ?? T.EN[k] ?? k;

  useEffect(() => { const i = setInterval(()=>setNw(getNwStatus()),30000); return ()=>clearInterval(i); }, []);

  useEffect(() => {
    const s = localStorage.getItem('lang') as Lang|null;
    if (s && LANGS.includes(s)) setLang(s);
    else { const br = navigator.language.split('-')[0].toUpperCase() as Lang; if (LANGS.includes(br)) setLang(br); }
    const tok = localStorage.getItem('token')||'';
    setToken(tok);
    if (tok) { try { const p = JSON.parse(atob(tok.split('.')[1])); if (p.isAdmin) setIsAdmin(true); } catch {} }
    fetch('/api/farms').then(r=>r.json()).then(d=>{ setFarms(Array.isArray(d)?d:[]); setLoading(false); });
  }, []);

  const handleAuth = useCallback((tok:string|null, _n:string|null, admin:boolean) => { setToken(tok||''); setIsAdmin(admin); }, []);
  const reload = async () => { const d = await (await fetch('/api/farms')).json(); setFarms(Array.isArray(d)?d:[]); };

  const openAdd  = () => { setForm({...EMPTY, loginType: lastAccount.current.loginType, loginName: lastAccount.current.loginName}); setEditing(null); setSheet('add'); };
  const openEdit = (f:Farm) => { setForm({...f}); setEditing(f); setSheet('edit'); setActionFarm(null); };
  const upd = (k:keyof typeof form, v:unknown) => setForm(p=>({...p,[k]:v}));

  const saveFarm = async () => {
    setSaving(true);
    if (sheet==='add') {
      lastAccount.current = { loginType: form.loginType, loginName: form.loginName };
      await fetch('/api/farms',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(form)});
      await reload();
      setSaving(false);
      setSavedName(form.castleName);
      // Reset only castle-specific fields, keep account
      setForm(p=>({...EMPTY, loginType:p.loginType, loginName:p.loginName}));
      setTimeout(()=>setSavedName(null), 3000);
    } else if (editing) {
      await fetch(`/api/farms/${editing.id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(form)});
      await reload(); setSaving(false); setSheet(null);
    }
  };

  const deleteFarm = async (id:number) => {
    await fetch(`/api/farms/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}});
    await reload(); setDelId(null); setActionFarm(null);
  };

  const pelAction = async (farm:Farm, type:'sent'|'received') => {
    setPelLoading(p=>({...p,[farm.id]:type}));
    await fetch(`/api/farms/${farm.id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(type==='sent'?{pelicanoSentNow:true}:{pelicanoReceivedNow:true})});
    await reload(); setPelLoading(p=>{const n={...p}; delete n[farm.id]; return n;}); setActionFarm(null);
  };

  // Toggle filter with exclusivity rules
  const toggleFilter = (group: 'm5'|'forge'|'nw', val: string) => {
    setFilters(f => {
      const cur = f[group];
      if (group === 'm5') {
        // 'no' esclude cav/rng; cav/rng escludono 'no'; cav e rng coesistono
        if (val === 'no') {
          return { ...f, m5: cur.includes('no') ? [] : ['no'] };
        } else {
          const withoutNo = cur.filter(v => v !== 'no');
          return { ...f, m5: withoutNo.includes(val) ? withoutNo.filter(v=>v!==val) : [...withoutNo, val] };
        }
      }
      // forge e nw: radio — click stesso valore deseleziona, click altro sostituisce
      return { ...f, [group]: cur.includes(val) ? [] : [val] };
    });
  };

  // Toggle sort: same key flips dir, new key sets asc
  const toggleSort = (key: SortKey) => {
    setSort(s => s.key===key ? { key, dir: s.dir==='asc'?'desc':'asc' } : { key, dir:'asc' });
  };

  const cmpVal = (f: Farm, key: SortKey): string|number|null => {
    switch(key) {
      case 'castleName':          return f.castleName.toLowerCase();
      case 'castleLevel':         return f.castleLevel;
      case 'm5Cavalry':           return f.m5Cavalry + f.m5Ranged;
      case 'pelicanoTroops':      return f.pelicanoTroops;
      case 'lastPelicanSent':     return f.lastPelicanSent     ? new Date(f.lastPelicanSent).getTime()     : (sort.dir==='asc' ? Infinity : -Infinity);
      case 'lastPelicanReceived': return f.lastPelicanReceived ? new Date(f.lastPelicanReceived).getTime() : (sort.dir==='asc' ? Infinity : -Infinity);
      case 'nwLastDone':          return nwDoneInCurrentCycle(f.nwLastDone) ? 1 : 0;
      case 'hospitalCapacity':    return f.hospitalCapacity;
    }
  };

  const list = useMemo(() => {
    let arr = [...farms];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      arr = arr.filter(f => f.castleName.toLowerCase().includes(q) || f.loginName.toLowerCase().includes(q));
    }
    if (filters.m5.length) {
      arr = arr.filter(f => {
        const hasNone = f.m5Cavalry === 0 && f.m5Ranged === 0;
        const hasCav  = f.m5Cavalry > 0;
        const hasRng  = f.m5Ranged  > 0;
        return filters.m5.some(v =>
          (v === 'no'      && hasNone) ||
          (v === 'cavalry' && hasCav)  ||
          (v === 'ranged'  && hasRng)
        );
      });
    }
    if (filters.forge.length) arr = arr.filter(f=>filters.forge.includes(f.crystalForge?'yes':'no'));
    if (filters.nw.length)    arr = arr.filter(f=>filters.nw.includes(nwDoneInCurrentCycle(f.nwLastDone)?'yes':'no'));
    if (filters.nwOpt)        arr = arr.filter(f=>f.nwOptimized);
    // Sort
    arr.sort((a,b) => {
      const av = cmpVal(a, sort.key), bv = cmpVal(b, sort.key);
      if (av === bv) return 0;
      if (av === null || av === Infinity) return 1;
      if (bv === null || bv === Infinity) return -1;
      const cmp = av < bv ? -1 : 1;
      return sort.dir==='asc' ? cmp : -cmp;
    });
    return arr;
  }, [farms, filters, sort, search]);

  // Sort arrow indicator
  const SortArrow = ({ col }: { col: SortKey }) => {
    const active = sort.key === col;
    return (
      <span style={{ marginLeft:3, fontSize:9, color: active ? C.purple : C.faint, display:'inline-block', lineHeight:1 }}>
        {active ? (sort.dir==='asc' ? '▲' : '▼') : '⇅'}
      </span>
    );
  };

  // Sortable header
  const SH = (col: SortKey, label: string, extra?: React.CSSProperties) => (
    <th onClick={()=>toggleSort(col)} style={{
      padding:'7px 8px', fontSize:9, fontWeight:800, color: sort.key===col ? C.purple : C.muted,
      textTransform:'uppercase', letterSpacing:0.8, whiteSpace:'nowrap',
      background:C.surface, borderBottom:`1px solid ${C.border}`,
      position:'sticky', top:0, zIndex:2, cursor:'pointer', userSelect:'none',
      ...extra,
    }}>
      {label}<SortArrow col={col}/>
    </th>
  );

  const TD: React.CSSProperties = { padding:'8px 8px', fontSize:12, color:C.text, borderBottom:`1px solid rgba(255,255,255,0.04)`, verticalAlign:'middle', whiteSpace:'nowrap' };

  // Filter chip style
  const FC = (active: boolean): React.CSSProperties => ({
    padding:'4px 9px', borderRadius:5, fontSize:10, fontWeight:700, border:'none',
    cursor:'pointer', whiteSpace:'nowrap',
    background: active ? 'rgba(124,58,237,0.35)' : C.surface2,
    color:       active ? C.purple : C.faint,
    outline:     active ? `1px solid rgba(124,58,237,0.5)` : `1px solid ${C.border}`,
  });

  const actionBtnStyle = (danger=false): React.CSSProperties => ({
    display:'flex', alignItems:'center', gap:10, width:'100%', padding:'11px 16px',
    background: danger ? 'rgba(239,68,68,0.07)' : C.surface2,
    border:'none', borderRadius:10, cursor:'pointer',
    color: danger ? C.red : C.text, fontSize:13, fontWeight:600, textAlign:'left',
  });

  const activeFilterCount = filters.m5.length + filters.forge.length + filters.nw.length + (filters.nwOpt ? 1 : 0);



  return (
    <div style={{minHeight:'100vh', background:C.bg, fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'}}>
      <KvkHeader lang={lang} onLang={l=>{setLang(l);localStorage.setItem('lang',l);}} onAuthChange={handleAuth}/>

      {/* NW Banner */}
      <div style={{background:nw.active?'rgba(34,197,94,0.1)':C.surface, borderBottom:`1px solid ${nw.active?'rgba(74,222,128,0.25)':C.border}`, padding:'8px 14px', display:'flex', alignItems:'center', gap:8}}>
        <div style={{width:7,height:7,borderRadius:'50%',background:nw.active?C.green:C.faint,flexShrink:0,boxShadow:nw.active?`0 0 5px ${C.green}`:'none'}}/>
        <span style={{fontSize:11,fontWeight:800,color:nw.active?C.green:C.muted}}>{nw.active?t('nwActive'):t('nwInactive')}</span>
        <span style={{fontSize:11,color:C.muted}}>—</span>
        <span style={{fontSize:11,color:nw.active?C.green:C.muted}}>{nw.active?t('nwEnds'):t('nwStarts')}</span>
        <span style={{fontSize:12,fontWeight:800,color:C.text}}>{fmtCountdown(nw.ms)}</span>
      </div>

      {/* Controls */}
      <div style={{padding:'8px 12px 6px', maxWidth:1024, margin:'0 auto'}}>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap'}}>
          <h1 style={{fontSize:14,fontWeight:800,color:C.text,margin:0}}>{t('title')}</h1>
          <span style={{fontSize:11,color:C.faint}}>({list.length})</span>
          <div style={{flex:1}}/>
          {/* Search box */}
          <div style={{position:'relative',display:'flex',alignItems:'center'}}>
            <span style={{position:'absolute',left:9,fontSize:12,color:C.faint,pointerEvents:'none'}}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Cerca castello..."
              style={{...IN, paddingLeft:28, width:180, height:32, fontSize:12, borderRadius:8}}
            />
            {search && (
              <button onClick={()=>setSearch('')} style={{position:'absolute',right:8,background:'none',border:'none',cursor:'pointer',color:C.faint,fontSize:14,lineHeight:1,padding:0}}>✕</button>
            )}
          </div>
          {isAdmin && <button onClick={openAdd} style={{padding:'6px 12px',borderRadius:8,fontSize:11,fontWeight:700,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#7c3aed,#2563eb)',color:'#fff'}}>{t('add')}</button>}
        </div>

        {/* Multi-select filters */}
        <div style={{display:'flex', flexWrap:'wrap', gap:4, alignItems:'center'}}>
          {/* M5 group */}
          {[['no',t('fM5No')],['cavalry',t('fM5Cav')],['ranged',t('fM5Rng')]].map(([v,label])=>(
            <button key={`m5-${v}`} onClick={()=>toggleFilter('m5',v)} style={FC(filters.m5.includes(v))}>{label}</button>
          ))}
          <div style={{width:1,height:16,background:C.border,margin:'0 2px'}}/>
          {/* Forge group */}
          {[['yes',t('fForgeY')],['no',t('fForgeN')]].map(([v,label])=>(
            <button key={`forge-${v}`} onClick={()=>toggleFilter('forge',v)} style={FC(filters.forge.includes(v))}>{label}</button>
          ))}
          <div style={{width:1,height:16,background:C.border,margin:'0 2px'}}/>
          {/* NW group */}
          {[['yes',t('fNwY')],['no',t('fNwN')]].map(([v,label])=>(
            <button key={`nw-${v}`} onClick={()=>toggleFilter('nw',v)} style={FC(filters.nw.includes(v))}>{label}</button>
          ))}
          <div style={{width:1,height:16,background:C.border,margin:'0 2px'}}/>
          {/* NW Ottimizzato — standalone toggle */}
          <button onClick={()=>setFilters(f=>({...f,nwOpt:!f.nwOpt}))} style={{...FC(filters.nwOpt), display:'flex', alignItems:'center', gap:3}}>
            <span style={{fontSize:9,color:filters.nwOpt?C.amber:C.faint}}>★</span>
            NW Ottimizzato
          </button>
          {activeFilterCount > 0 && (
            <button onClick={()=>setFilters({m5:[],forge:[],nw:[],nwOpt:false})} style={{padding:'4px 8px',borderRadius:5,fontSize:10,fontWeight:700,border:'none',cursor:'pointer',background:'rgba(248,113,113,0.12)',color:C.red,marginLeft:4}}>
              ✕ Reset
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div style={{padding:'0 12px 40px', maxWidth:1024, margin:'0 auto'}}>
        {loading && <p style={{textAlign:'center',color:C.faint,fontSize:13,padding:'30px 0'}}>...</p>}
        {!loading && (
          <div style={{overflowX:'auto',borderRadius:12,border:`1px solid ${C.border}`,background:C.surface}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{padding:'7px 8px',fontSize:9,fontWeight:800,color:C.muted,background:C.surface,borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:2,width:24,textAlign:'center'}}>#</th>
                  {SH('castleName',   t('col_castle'), {textAlign:'left', minWidth:90, maxWidth:110})}
                  {SH('castleLevel',  t('col_lvl'),    {textAlign:'center', width:46})}
                  {SH('m5Cavalry',            t('col_m5'),     {textAlign:'center', minWidth:90})}
                  <th style={{padding:'7px 8px',fontSize:9,fontWeight:800,color:C.muted,background:C.surface,borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:2,textAlign:'center',minWidth:60}}>{t('col_forge')}</th>
                  {SH('pelicanoTroops',       t('col_pel'),   {textAlign:'center', minWidth:72})}
                  {SH('lastPelicanSent',      t('col_sent'),  {textAlign:'center', minWidth:80})}
                  {SH('lastPelicanReceived',  t('col_recv'),  {textAlign:'center', minWidth:80})}
                  {SH('nwLastDone',            t('col_nw'),    {textAlign:'center', width:44})}
                  {SH('hospitalCapacity',     t('col_hosp'),  {textAlign:'center', minWidth:60})}
                </tr>
              </thead>
              <tbody>
                {list.map((f,i) => (
                  <tr key={f.id}
                    onClick={()=>isAdmin?setActionFarm(f):undefined}
                    style={{background:i%2===0?C.surface:'transparent', cursor:isAdmin?'pointer':'default', transition:'background 0.1s'}}
                    onMouseEnter={e=>{ if(isAdmin)(e.currentTarget as HTMLElement).style.background='rgba(124,58,237,0.07)'; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.background=i%2===0?C.surface:'transparent'; }}
                  >
                    <td style={{...TD,textAlign:'center',color:C.faint,fontSize:10,width:24}}>{i+1}</td>

                    {/* CASTELLO + badge login — mail solo nel popup */}
                    <td style={{...TD, maxWidth:110, overflow:'hidden'}}>
                      <div style={{display:'flex',alignItems:'center',gap:4}}>
                        <span style={{fontSize:9,fontWeight:800,padding:'1px 4px',borderRadius:3,background:f.loginType==='funplus'?'rgba(251,191,36,0.12)':'rgba(96,165,250,0.12)',color:f.loginType==='funplus'?C.amber:C.blue,flexShrink:0}}>
                          {f.loginType==='funplus'?'FP':'GO'}
                        </span>
                        <span style={{fontSize:12,fontWeight:700,color:C.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.castleName}</span>
                      </div>
                      <div style={{fontSize:9,color:C.faint,marginTop:1,overflow:'hidden',textOverflow:'ellipsis',paddingLeft:2}}>{f.loginName}</div>
                    </td>

                    {/* LVL */}
                    <td style={{...TD,textAlign:'center'}}>
                      <span style={{fontSize:10,fontWeight:800,padding:'2px 6px',borderRadius:4,background:'rgba(167,139,250,0.13)',color:C.purple}}>{f.castleLevel}</span>
                    </td>

                    {/* M5 — CAV/DIS + numero, stacked se entrambi */}
                    <td style={{...TD, textAlign:'center'}}>
                      {f.m5Cavalry === 0 && f.m5Ranged === 0
                        ? <span style={{color:C.faint,fontSize:10}}>—</span>
                        : <div style={{display:'inline-flex',flexDirection:'column',gap:1,alignItems:'flex-start'}}>
                            {f.m5Cavalry > 0 && (
                              <span style={{fontSize:12,fontWeight:800,color:C.text,whiteSpace:'nowrap'}}>
                                <span style={{color:C.red,fontSize:10,fontWeight:700,marginRight:3}}>CAV</span>
                                {fmtTroops(f.m5Cavalry)}
                              </span>
                            )}
                            {f.m5Ranged > 0 && (
                              <span style={{fontSize:12,fontWeight:800,color:C.text,whiteSpace:'nowrap'}}>
                                <span style={{color:C.blue,fontSize:10,fontWeight:700,marginRight:3}}>DIS</span>
                                {fmtTroops(f.m5Ranged)}
                              </span>
                            )}
                          </div>
                      }
                    </td>

                    {/* FORGE — click mostra tooltip, stopPropagation evita popup admin */}
                    <td
                      style={{...TD, textAlign:'center', cursor: f.crystalForgeNote ? 'pointer' : 'default'}}
                      onClick={e => {
                        e.stopPropagation();
                        if (f.crystalForgeNote) {
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setForgeTooltip({ text: f.crystalForgeNote, x: rect.left + rect.width/2, y: rect.bottom + 6 });
                        }
                      }}
                    >
                      {f.crystalForge
                        ? <span style={{fontSize:11,fontWeight:700,color:C.green}}>Sì</span>
                        : <span style={{fontSize:11,fontWeight:600,color:C.faint}}>
                            No{f.crystalForgeNote && <span style={{color:C.muted,fontSize:10}}> ⓘ</span>}
                          </span>
                      }
                    </td>

                    {/* PELLICANO — just the number */}
                    <td style={{...TD,textAlign:'center'}}>
                      {f.pelicano
                        ? <span style={{fontSize:13,fontWeight:800,color:C.purple}}>{fmtTroops(f.pelicanoTroops)}</span>
                        : <span style={{color:C.faint,fontSize:10}}>No</span>
                      }
                    </td>

                    {/* LAST SENT — stessa formattazione di ultima subita */}
                    <td style={{...TD,textAlign:'center'}}>
                      {(() => {
                        const r = fmtReceived(f.lastPelicanSent);
                        return r
                          ? <span style={{fontSize:11,fontWeight:700,color:r.color}}>{r.text}</span>
                          : <span style={{fontSize:11,color:C.faint}}>—</span>;
                      })()}
                    </td>

                    {/* LAST RECEIVED — GG + ora UTC, colore urgenza */}
                    <td style={{...TD,textAlign:'center'}}>
                      {(() => {
                        const r = fmtReceived(f.lastPelicanReceived);
                        return r
                          ? <span style={{fontSize:11,fontWeight:700,color:r.color}}>{r.text}</span>
                          : <span style={{fontSize:11,color:C.faint}}>—</span>;
                      })()}
                    </td>

                    {/* NW — Sì/No solo durante NW attivo, — altrimenti + micro star se ottimizzato */}
                    <td style={{...TD,textAlign:'center'}}>
                      <div style={{position:'relative',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
                        {nw.active
                          ? <span style={{fontSize:11,fontWeight:800,color:nwDoneInCurrentCycle(f.nwLastDone)?C.green:C.red}}>
                              {nwDoneInCurrentCycle(f.nwLastDone)?'Sì':'No'}
                            </span>
                          : <span style={{fontSize:11,color:C.faint}}>—</span>
                        }
                        {f.nwOptimized && (
                          <span style={{position:'absolute',top:-6,right:-8,fontSize:8,color:C.amber,lineHeight:1}}>★</span>
                        )}
                      </div>
                    </td>

                    {/* HOSPITAL */}
                    <td style={{...TD,textAlign:'center'}}>
                      <span style={{fontSize:11,color:f.hospitalCapacity>0?C.text:C.faint}}>{fmtTroops(f.hospitalCapacity)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && list.length === 0 && (
              <div style={{textAlign:'center',padding:'30px',color:C.faint,fontSize:12}}>
                Nessuna farm corrisponde ai filtri
              </div>
            )}
          </div>
        )}
        {isAdmin && list.length>0 && <p style={{fontSize:9,color:C.faint,textAlign:'center',marginTop:6}}>Tocca una riga per le azioni</p>}
      </div>

      {/* ROW ACTION BOTTOM SHEET */}
      {actionFarm && (
        <>
          <div onClick={()=>setActionFarm(null)} style={{position:'fixed',inset:0,zIndex:10000,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(3px)'}}/>
          <div style={{position:'fixed',zIndex:10001,left:'50%',transform:'translateX(-50%)',bottom:0,width:'100%',maxWidth:460,background:C.surface,borderTop:`1px solid ${C.border}`,borderRadius:'16px 16px 0 0',paddingBottom:'env(safe-area-inset-bottom)'}}>
            <div style={{display:'flex',justifyContent:'center',padding:'10px 0 4px'}}>
              <div style={{width:36,height:4,borderRadius:2,background:'rgba(255,255,255,0.14)'}}/>
            </div>
            <div style={{padding:'0 16px 10px',borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:'flex',alignItems:'center',gap:7}}>
                <span style={{fontSize:9,fontWeight:800,padding:'1px 5px',borderRadius:3,background:actionFarm.loginType==='funplus'?'rgba(251,191,36,0.12)':'rgba(96,165,250,0.12)',color:actionFarm.loginType==='funplus'?C.amber:C.blue}}>{actionFarm.loginType==='funplus'?'FP':'GO'}</span>
                <span style={{fontSize:14,fontWeight:800,color:C.text}}>{actionFarm.castleName}</span>
                <span style={{fontSize:10,fontWeight:700,padding:'1px 6px',borderRadius:4,background:'rgba(167,139,250,0.13)',color:C.purple}}>{actionFarm.castleLevel}</span>
              </div>
              <div style={{fontSize:10,color:C.faint,marginTop:2}}>{actionFarm.loginName}</div>
            </div>
            <div style={{padding:'8px 12px 14px',display:'flex',flexDirection:'column',gap:5}}>
              {actionFarm.pelicano && <>
                <button onClick={()=>pelAction(actionFarm,'sent')} disabled={!!pelLoading[actionFarm.id]} style={actionBtnStyle()}>
                  <span style={{width:20,textAlign:'center',fontSize:14,color:C.purple}}>↑</span>
                  <span>{pelLoading[actionFarm.id]==='sent'?'...' : t('sentBtn')}</span>
                </button>
                <button onClick={()=>pelAction(actionFarm,'received')} disabled={!!pelLoading[actionFarm.id]} style={actionBtnStyle()}>
                  <span style={{width:20,textAlign:'center',fontSize:14,color:C.red}}>↓</span>
                  <span>{pelLoading[actionFarm.id]==='received'?'...' : t('recvBtn')}</span>
                </button>
              </>}
              {/* NW actions — only show during active NW */}
              {nw.active && (
                nwDoneInCurrentCycle(actionFarm.nwLastDone)
                  ? <button onClick={async()=>{ await fetch(`/api/farms/${actionFarm.id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({nwResetNow:true})}); await reload(); setActionFarm(null); }} style={actionBtnStyle()}>
                      <span style={{width:20,textAlign:'center',fontSize:13,color:C.amber}}>↺</span>
                      <span>New World: annulla (era Sì)</span>
                    </button>
                  : <button onClick={async()=>{ await fetch(`/api/farms/${actionFarm.id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({nwDoneNow:true})}); await reload(); setActionFarm(null); }} style={actionBtnStyle()}>
                      <span style={{width:20,textAlign:'center',fontSize:13,color:C.green}}>✓</span>
                      <span>New World: segna come fatto</span>
                    </button>
              )}
              <button onClick={()=>openEdit(actionFarm)} style={actionBtnStyle()}>
                <span style={{width:20,textAlign:'center',fontSize:13,color:C.muted}}>✎</span>
                <span>{t('edit')}</span>
              </button>
              {/* Toggle NW optimization */}
              <button onClick={async()=>{
                await fetch(`/api/farms/${actionFarm.id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({nwOptimized:!actionFarm.nwOptimized})});
                await reload(); setActionFarm(null);
              }} style={actionBtnStyle()}>
                <span style={{width:20,textAlign:'center',fontSize:12,color:C.amber}}>★</span>
                <span>{actionFarm.nwOptimized ? 'NW Ottimizzato: togli' : 'NW Ottimizzato: segna'}</span>
              </button>
              <button onClick={()=>setDelId(actionFarm.id)} style={actionBtnStyle(true)}>
                <span style={{width:20,textAlign:'center',fontSize:13,color:C.red}}>✕</span>
                <span>{t('del')}</span>
              </button>
              <button onClick={()=>setActionFarm(null)} style={{padding:'10px',background:'transparent',border:'none',cursor:'pointer',color:C.faint,fontSize:13,fontWeight:600,textAlign:'center' as const}}>
                {t('cancel')}
              </button>
            </div>
          </div>
        </>
      )}

      {/* FORGE NOTE TOOLTIP */}
      {forgeTooltip && (
        <div onClick={()=>setForgeTooltip(null)} style={{position:'fixed',inset:0,zIndex:9990}}>
          <div
            onClick={e=>e.stopPropagation()}
            style={{
              position:'fixed',
              left: Math.min(forgeTooltip.x, window.innerWidth - 220),
              top:  forgeTooltip.y,
              zIndex:9991,
              background:'#1e1e26',
              border:'1px solid rgba(167,139,250,0.3)',
              borderRadius:10,
              padding:'10px 14px',
              maxWidth:210,
              boxShadow:'0 8px 32px rgba(0,0,0,0.6)',
              backdropFilter:'blur(8px)',
            }}
          >
            <div style={{fontSize:10,fontWeight:700,color:C.purple,marginBottom:4,textTransform:'uppercase',letterSpacing:0.5}}>Note forgia</div>
            <div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{forgeTooltip.text}</div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {delId && (
        <div onClick={()=>setDelId(null)} style={{position:'fixed',inset:0,zIndex:10002,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.surface,border:'1px solid rgba(248,113,113,0.3)',borderRadius:16,padding:'24px 20px',maxWidth:300,width:'100%',textAlign:'center'}}>
            <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:16}}>{t('confirmDel')}</div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setDelId(null)} style={{flex:1,padding:'10px',borderRadius:9,border:`1px solid ${C.border}`,background:'transparent',color:C.text,cursor:'pointer',fontSize:13,fontWeight:600}}>{t('cancel')}</button>
              <button onClick={()=>deleteFarm(delId)} style={{flex:1,padding:'10px',borderRadius:9,border:'none',background:'rgba(239,68,68,0.18)',color:C.red,cursor:'pointer',fontSize:13,fontWeight:700}}>{t('del')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT SHEET */}
      {sheet && (
        <>
          <div onClick={()=>!saving&&setSheet(null)} style={{position:'fixed',inset:0,zIndex:10001,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(6px)'}}/>
          <div style={{
            position:'fixed',zIndex:10002,
            left:'50%',top:'50%',transform:'translate(-50%,-50%)',
            width:'min(92vw, 780px)',
            background:'#111114',
            borderRadius:18,
            border:`1px solid ${C.border}`,
            boxShadow:'0 0 80px rgba(0,0,0,0.9)',
            display:'flex',flexDirection:'column',
            maxHeight:'92vh',
          }}>
            {/* Header */}
            <div style={{flexShrink:0,padding:'16px 20px 14px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:8}}>
              <div style={{flex:1,fontSize:15,fontWeight:800,color:C.text}}>{sheet==='add'?t('add'):t('edit')}</div>
              <button onClick={()=>{ setSheet(null); setSavedName(null); }} style={{width:36,height:36,borderRadius:9,border:`1px solid ${C.border}`,background:C.surface2,color:C.text,cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
            </div>
            {/* Success banner */}
            {savedName && (
              <div style={{flexShrink:0,padding:'8px 20px',background:'rgba(74,222,128,0.1)',borderBottom:`1px solid rgba(74,222,128,0.2)`,display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:14,color:C.green}}>✓</span>
                <span style={{fontSize:12,fontWeight:700,color:C.green}}>«{savedName}» salvato! Puoi aggiungere un altro castello.</span>
              </div>
            )}
            {/* Body — 2-column grid */}
            <div style={{overflowY:'auto',flex:1,padding:'16px 20px 0'}}>
              {/* Row: Login type full width */}
              <div style={{marginBottom:12}}>
                <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:5}}>{t('lType')}</label>
                <div style={{display:'flex',gap:8}}>
                  {['funplus','google'].map(lt=>(
                    <button key={lt} onClick={()=>upd('loginType',lt)} style={{flex:1,padding:'9px',borderRadius:9,fontSize:12,fontWeight:700,border:'none',cursor:'pointer',background:form.loginType===lt?'linear-gradient(135deg,#7c3aed,#2563eb)':C.surface2,color:form.loginType===lt?'#fff':C.muted}}>
                      {lt==='funplus'?t('fp'):t('goo')}
                    </button>
                  ))}
                </div>
              </div>
              {/* Row 2: Account | Castle Name */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                <div>
                  <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>{t('lName')}</label>
                  <input type="text" style={IN} value={form.loginName||''} onChange={e=>upd('loginName',e.target.value)}/>
                </div>
                <div>
                  <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>{t('cName')}</label>
                  <input type="text" style={IN} value={form.castleName||''} onChange={e=>upd('castleName',e.target.value)}/>
                </div>
              </div>
              {/* Row 3: Castle Level | Hospital */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                <div>
                  <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>{t('cLvl')}</label>
                  <input type="text" style={IN} value={form.castleLevel||''} onChange={e=>upd('castleLevel',e.target.value)}/>
                </div>
                <div>
                  <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>{t('hosp')}</label>
                  <input type="number" min="0" style={IN} value={form.hospitalCapacity||''} onChange={e=>upd('hospitalCapacity',Number(e.target.value))}/>
                </div>
              </div>
              {/* Row 4: M5 CAV | M5 DIS */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                <div>
                  <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>{t('m5Type')}</label>
                  <div style={{fontSize:10,color:C.red,fontWeight:700,marginBottom:4}}>CAV (0 = nessuna)</div>
                  <input type="number" min="0" style={IN} placeholder="0" value={form.m5Cavalry||''} onChange={e=>upd('m5Cavalry',Number(e.target.value))}/>
                </div>
                <div>
                  <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>&nbsp;</label>
                  <div style={{fontSize:10,color:C.blue,fontWeight:700,marginBottom:4}}>DIS (0 = nessuna)</div>
                  <input type="number" min="0" style={IN} placeholder="0" value={form.m5Ranged||''} onChange={e=>upd('m5Ranged',Number(e.target.value))}/>
                </div>
              </div>
              {/* Row 5: Forge | Pelicano */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                <div>
                  <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>{t('forge')}</label>
                  <div style={{display:'flex',gap:6,marginBottom:!form.crystalForge?6:0}}>
                    {[true,false].map(v=>(
                      <button key={String(v)} onClick={()=>upd('crystalForge',v)} style={{flex:1,padding:'9px',borderRadius:8,fontSize:11,fontWeight:700,border:'none',cursor:'pointer',background:form.crystalForge===v?'linear-gradient(135deg,#7c3aed,#2563eb)':C.surface2,color:form.crystalForge===v?'#fff':C.muted}}>
                        {v?t('yes'):t('no')}
                      </button>
                    ))}
                  </div>
                  {!form.crystalForge&&<input type="text" style={IN} placeholder={t('forgeNote')} value={form.crystalForgeNote||''} onChange={e=>upd('crystalForgeNote',e.target.value)}/>}
                </div>
                <div>
                  <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>{t('pelicano')}</label>
                  <div style={{display:'flex',gap:6,marginBottom:form.pelicano?6:0}}>
                    {[true,false].map(v=>(
                      <button key={String(v)} onClick={()=>upd('pelicano',v)} style={{flex:1,padding:'9px',borderRadius:8,fontSize:11,fontWeight:700,border:'none',cursor:'pointer',background:form.pelicano===v?'linear-gradient(135deg,#7c3aed,#2563eb)':C.surface2,color:form.pelicano===v?'#fff':C.muted}}>
                        {v?t('yes'):t('no')}
                      </button>
                    ))}
                  </div>
                  {form.pelicano&&<input type="number" style={IN} placeholder={t('pelTroops')} value={form.pelicanoTroops||''} onChange={e=>upd('pelicanoTroops',Number(e.target.value))}/>}
                </div>
              </div>
              {/* Row 6: Notes full width */}
              <div style={{marginBottom:10}}>
                <label style={{fontSize:11,color:C.muted,display:'block',marginBottom:4}}>{t('notes')}</label>
                <input type="text" style={IN} value={form.notes||''} onChange={e=>upd('notes',e.target.value)}/>
              </div>
            </div>
            {/* Footer buttons */}
            <div style={{flexShrink:0,padding:'12px 20px 18px',borderTop:`1px solid ${C.border}`,display:'flex',gap:10}}>
              <button onClick={()=>setSheet(null)} style={{flex:1,padding:'11px',borderRadius:10,border:`1px solid ${C.border}`,background:'transparent',color:C.text,cursor:'pointer',fontSize:13,fontWeight:600}}>{t('cancel')}</button>
              <button onClick={saveFarm} disabled={saving} style={{flex:2,padding:'11px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#7c3aed,#2563eb)',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:700}}>{saving?t('saving'):t('save')}</button>
            </div>
          </div>
        </>
      )}

      <style>{`
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.4);border-radius:2px}
        *{scrollbar-width:thin;scrollbar-color:rgba(124,58,237,0.4) transparent}
        select option{background:#17171d}
        @media(max-width:640px){th,td{padding:6px 6px!important;font-size:10px!important}}
        /* Column separators — refined, subtle */
        table th:not(:last-child){border-right:1px solid rgba(255,255,255,0.06)}
        table td:not(:last-child){border-right:1px solid rgba(255,255,255,0.04)}
        /* Row hover */
        table tbody tr:hover td{background:rgba(124,58,237,0.07)!important}
      `}</style>
    </div>
  );
}
