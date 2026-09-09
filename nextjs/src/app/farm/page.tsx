'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

// ── NW SCHEDULE ────────────────────────────────────────────────────────────────
// NW starts every 14 days on Tuesday, lasts 2 days (Tue 00:00 UTC → Wed 23:59 UTC)
// Reference: Tuesday 8 September 2026 00:00 UTC
const NW_REFERENCE = new Date('2026-09-08T00:00:00Z');
const NW_CYCLE_MS  = 14 * 24 * 60 * 60 * 1000; // 14 days
const NW_DURATION_MS = 2 * 24 * 60 * 60 * 1000;  // 2 days

function getNwStatus(now: Date = new Date()) {
  const msSinceRef = now.getTime() - NW_REFERENCE.getTime();
  const cyclePos   = ((msSinceRef % NW_CYCLE_MS) + NW_CYCLE_MS) % NW_CYCLE_MS;
  if (cyclePos < NW_DURATION_MS) {
    return { active: true,  msLeft: NW_DURATION_MS - cyclePos };
  } else {
    return { active: false, msLeft: NW_CYCLE_MS - cyclePos };
  }
}

function fmtCountdown(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h >= 48) return `${Math.ceil(h / 24)} gg`;
  if (h > 0)  return `${h}h ${m}m`;
  return `${m}m`;
}
// ───────────────────────────────────────────────────────────────────────────────

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: { title:'Farm Management', nwActive:'NW Attivo', nwInactive:'Prossimo NW', nwEnds:'termina tra', nwStarts:'tra', castle:'Castello', lvl:'Lvl', login:'Login', m5:'M5', forge:'Forgia', pelicano:'Pellicano', sent:'Inviata', received:'Subita', nw:'NW', hospital:'🏥', notes:'Note', never:'Mai', cav:'Cav', rng:'Dst', no:'No', yes:'Sì', fp:'FP', goo:'GO', addFarm:'+ Aggiungi', editFarm:'Modifica', deleteFarm:'Elimina', sentBtn:'✈ Inviata', receivedBtn:'🎯 Subita', confirmDel:'Eliminare?', cancel:'Annulla', save:'Salva', saving:'...', filterAll:'Tutti', filterPel:'Pellicano', filterM5:'M5', filterNw:'NW fatto', sortDefault:'Ordine default', sortReceived:'Ordina: Subita', sortSent:'Ordina: Inviata', sortLevel:'Ordina: Livello', loginName:'Account', castleName:'Castello', castleLevel:'Livello (es C40)', loginType:'Login', m5Type:'M5', m5Count:'Truppe M5', crystalForge:'Forgia Cristalli', crystalForgeNote:'Note forgia', pelicanoTroops:'Truppe x pellicanata', nwDone:'NW fatto', hospitalCap:'Capienza ospedali', notesLabel:'Note', loginFP:'FunPlus', loginGoogle:'Google', cavalry:'Cavalleria', ranged:'Distanza' },
  EN: { title:'Farm Management', nwActive:'NW Active', nwInactive:'Next NW', nwEnds:'ends in', nwStarts:'in', castle:'Castle', lvl:'Lvl', login:'Login', m5:'M5', forge:'Forge', pelicano:'Pelican', sent:'Sent', received:'Received', nw:'NW', hospital:'🏥', notes:'Notes', never:'Never', cav:'Cav', rng:'Rng', no:'No', yes:'Yes', fp:'FP', goo:'GO', addFarm:'+ Add Farm', editFarm:'Edit', deleteFarm:'Delete', sentBtn:'✈ Sent', receivedBtn:'🎯 Received', confirmDel:'Delete?', cancel:'Cancel', save:'Save', saving:'...', filterAll:'All', filterPel:'Pelican', filterM5:'M5', filterNw:'NW done', sortDefault:'Default', sortReceived:'Sort: Received', sortSent:'Sort: Sent', sortLevel:'Sort: Level', loginName:'Account', castleName:'Castle', castleLevel:'Level (e.g. C40)', loginType:'Login', m5Type:'M5', m5Count:'M5 troops', crystalForge:'Crystal Forge', crystalForgeNote:'Forge notes', pelicanoTroops:'Troops per pelican', nwDone:'NW done', hospitalCap:'Hospital capacity', notesLabel:'Notes', loginFP:'FunPlus', loginGoogle:'Google', cavalry:'Cavalry', ranged:'Ranged' },
  PL: { title:'Farm Management', nwActive:'NW Aktywne', nwInactive:'Następne NW', nwEnds:'kończy się za', nwStarts:'za', castle:'Zamek', lvl:'Poz', login:'Login', m5:'M5', forge:'Kuźnia', pelicano:'Pelikan', sent:'Wysłano', received:'Otrzymano', nw:'NW', hospital:'🏥', notes:'Notatki', never:'Nigdy', cav:'Kaw', rng:'Dys', no:'Nie', yes:'Tak', fp:'FP', goo:'GO', addFarm:'+ Dodaj', editFarm:'Edytuj', deleteFarm:'Usuń', sentBtn:'✈ Wysłano', receivedBtn:'🎯 Otrzymano', confirmDel:'Usunąć?', cancel:'Anuluj', save:'Zapisz', saving:'...', filterAll:'Wszystkie', filterPel:'Pelikan', filterM5:'M5', filterNw:'NW zrobione', sortDefault:'Domyślnie', sortReceived:'Sortuj: Otrzymano', sortSent:'Sortuj: Wysłano', sortLevel:'Sortuj: Poziom', loginName:'Konto', castleName:'Zamek', castleLevel:'Poziom', loginType:'Login', m5Type:'M5', m5Count:'Wojska M5', crystalForge:'Kuźnia kryształów', crystalForgeNote:'Notatki kuźni', pelicanoTroops:'Wojska na pelikan', nwDone:'NW zrobione', hospitalCap:'Pojemność szpitala', notesLabel:'Notatki', loginFP:'FunPlus', loginGoogle:'Google', cavalry:'Kawaleria', ranged:'Dystans' },
  ZH: { title:'农场管理', nwActive:'NW活跃', nwInactive:'下次NW', nwEnds:'结束于', nwStarts:'在', castle:'城堡', lvl:'等级', login:'账号', m5:'M5', forge:'锻造', pelicano:'鹈鹕', sent:'已发', received:'已收', nw:'NW', hospital:'🏥', notes:'备注', never:'从未', cav:'骑', rng:'远', no:'否', yes:'是', fp:'FP', goo:'GO', addFarm:'+ 添加', editFarm:'编辑', deleteFarm:'删除', sentBtn:'✈ 发送', receivedBtn:'🎯 接收', confirmDel:'删除？', cancel:'取消', save:'保存', saving:'...', filterAll:'全部', filterPel:'鹈鹕', filterM5:'M5', filterNw:'NW完成', sortDefault:'默认', sortReceived:'排序:接收', sortSent:'排序:发送', sortLevel:'排序:等级', loginName:'账号', castleName:'城堡', castleLevel:'等级', loginType:'登录', m5Type:'M5', m5Count:'M5兵力', crystalForge:'晶体锻造', crystalForgeNote:'锻造备注', pelicanoTroops:'鹈鹕兵力', nwDone:'NW完成', hospitalCap:'医院容量', notesLabel:'备注', loginFP:'FunPlus', loginGoogle:'Google', cavalry:'骑兵', ranged:'远程' },
  DE: { title:'Farm-Verwaltung', nwActive:'NW Aktiv', nwInactive:'Nächstes NW', nwEnds:'endet in', nwStarts:'in', castle:'Schloss', lvl:'Stufe', login:'Login', m5:'M5', forge:'Schmiede', pelicano:'Pelikan', sent:'Gesendet', received:'Empfangen', nw:'NW', hospital:'🏥', notes:'Notizen', never:'Nie', cav:'Kav', rng:'Fern', no:'Nein', yes:'Ja', fp:'FP', goo:'GO', addFarm:'+ Hinzufügen', editFarm:'Bearbeiten', deleteFarm:'Löschen', sentBtn:'✈ Gesendet', receivedBtn:'🎯 Empfangen', confirmDel:'Löschen?', cancel:'Abbrechen', save:'Speichern', saving:'...', filterAll:'Alle', filterPel:'Pelikan', filterM5:'M5', filterNw:'NW erledigt', sortDefault:'Standard', sortReceived:'Sortieren: Empfangen', sortSent:'Sortieren: Gesendet', sortLevel:'Sortieren: Stufe', loginName:'Konto', castleName:'Schloss', castleLevel:'Stufe (z.B. C40)', loginType:'Login', m5Type:'M5', m5Count:'M5-Truppen', crystalForge:'Kristallschmiede', crystalForgeNote:'Schmiede-Notizen', pelicanoTroops:'Truppen pro Pelikan', nwDone:'NW erledigt', hospitalCap:'Krankenhauskapazität', notesLabel:'Notizen', loginFP:'FunPlus', loginGoogle:'Google', cavalry:'Kavallerie', ranged:'Fernkampf' },
  FR: { title:'Gestion Fermes', nwActive:'NW Actif', nwInactive:'Prochain NW', nwEnds:'se termine dans', nwStarts:'dans', castle:'Château', lvl:'Niv', login:'Login', m5:'M5', forge:'Forge', pelicano:'Pélican', sent:'Envoyé', received:'Reçu', nw:'NW', hospital:'🏥', notes:'Notes', never:'Jamais', cav:'Cav', rng:'Dis', no:'Non', yes:'Oui', fp:'FP', goo:'GO', addFarm:'+ Ajouter', editFarm:'Modifier', deleteFarm:'Supprimer', sentBtn:'✈ Envoyé', receivedBtn:'🎯 Reçu', confirmDel:'Supprimer?', cancel:'Annuler', save:'Sauvegarder', saving:'...', filterAll:'Tous', filterPel:'Pélican', filterM5:'M5', filterNw:'NW fait', sortDefault:'Défaut', sortReceived:'Tri: Reçu', sortSent:'Tri: Envoyé', sortLevel:'Tri: Niveau', loginName:'Compte', castleName:'Château', castleLevel:'Niveau (ex. C40)', loginType:'Login', m5Type:'M5', m5Count:'Troupes M5', crystalForge:'Forge cristaux', crystalForgeNote:'Notes forge', pelicanoTroops:'Troupes par pélican', nwDone:'NW fait', hospitalCap:'Capacité hôpital', notesLabel:'Notes', loginFP:'FunPlus', loginGoogle:'Google', cavalry:'Cavalerie', ranged:'Distance' },
  RU: { title:'Управление Фармами', nwActive:'NW Активно', nwInactive:'Следующий NW', nwEnds:'заканчивается через', nwStarts:'через', castle:'Замок', lvl:'Ур.', login:'Логин', m5:'M5', forge:'Кузня', pelicano:'Пеликан', sent:'Отправлен', received:'Получен', nw:'NW', hospital:'🏥', notes:'Заметки', never:'Никогда', cav:'Кав', rng:'Дал', no:'Нет', yes:'Да', fp:'FP', goo:'GO', addFarm:'+ Добавить', editFarm:'Изменить', deleteFarm:'Удалить', sentBtn:'✈ Отправлен', receivedBtn:'🎯 Получен', confirmDel:'Удалить?', cancel:'Отмена', save:'Сохранить', saving:'...', filterAll:'Все', filterPel:'Пеликан', filterM5:'M5', filterNw:'NW выполнен', sortDefault:'По умолчанию', sortReceived:'Сортировка: Получен', sortSent:'Сортировка: Отправлен', sortLevel:'Сортировка: Уровень', loginName:'Аккаунт', castleName:'Замок', castleLevel:'Уровень (напр. C40)', loginType:'Логин', m5Type:'M5', m5Count:'Войска M5', crystalForge:'Кузня кристаллов', crystalForgeNote:'Заметки кузни', pelicanoTroops:'Войска на пеликана', nwDone:'NW выполнен', hospitalCap:'Вместимость госпиталя', notesLabel:'Заметки', loginFP:'FunPlus', loginGoogle:'Google', cavalry:'Кавалерия', ranged:'Дальний бой' },
  ES: { title:'Gestión Granjas', nwActive:'NW Activo', nwInactive:'Próximo NW', nwEnds:'termina en', nwStarts:'en', castle:'Castillo', lvl:'Niv', login:'Login', m5:'M5', forge:'Forja', pelicano:'Pelícano', sent:'Enviado', received:'Recibido', nw:'NW', hospital:'🏥', notes:'Notas', never:'Nunca', cav:'Cab', rng:'Dis', no:'No', yes:'Sí', fp:'FP', goo:'GO', addFarm:'+ Agregar', editFarm:'Editar', deleteFarm:'Eliminar', sentBtn:'✈ Enviado', receivedBtn:'🎯 Recibido', confirmDel:'¿Eliminar?', cancel:'Cancelar', save:'Guardar', saving:'...', filterAll:'Todos', filterPel:'Pelícano', filterM5:'M5', filterNw:'NW hecho', sortDefault:'Predeterminado', sortReceived:'Ordenar: Recibido', sortSent:'Ordenar: Enviado', sortLevel:'Ordenar: Nivel', loginName:'Cuenta', castleName:'Castillo', castleLevel:'Nivel (ej. C40)', loginType:'Login', m5Type:'M5', m5Count:'Tropas M5', crystalForge:'Forja cristales', crystalForgeNote:'Notas forja', pelicanoTroops:'Tropas por pelícano', nwDone:'NW hecho', hospitalCap:'Capacidad hospital', notesLabel:'Notas', loginFP:'FunPlus', loginGoogle:'Google', cavalry:'Caballería', ranged:'Distancia' },
};

interface Farm {
  id: number; loginType: string; loginName: string; castleName: string; castleLevel: string;
  m5Type: string; m5Count: number; crystalForge: boolean; crystalForgeNote: string | null;
  pelicano: boolean; pelicanoTroops: number; lastPelicanSent: string | null;
  lastPelicanReceived: string | null; nwDone: boolean; hospitalCapacity: number;
  notes: string | null; sortOrder: number;
}
const EMPTY: Omit<Farm,'id'|'sortOrder'> = { loginType:'funplus', loginName:'', castleName:'', castleLevel:'', m5Type:'no', m5Count:0, crystalForge:false, crystalForgeNote:null, pelicano:false, pelicanoTroops:0, lastPelicanSent:null, lastPelicanReceived:null, nwDone:false, hospitalCapacity:0, notes:null };

function fmtTroops(n: number) { return n >= 1000000 ? (n/1e6).toFixed(1).replace('.',',')+' M' : n >= 1000 ? Math.round(n/1000)+'k' : String(n); }
function fmtDate(d: string | null, never: string) {
  if (!d) return never;
  const dt = new Date(d);
  return dt.toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'2-digit'}) + ' ' + dt.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
}

const IN: React.CSSProperties = { background:'#16161a', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, color:'#fff', fontSize:13, outline:'none', padding:'8px 10px', boxSizing:'border-box', width:'100%' };

type Sort = 'default'|'received'|'sent'|'level';
type Filter = 'all'|'pelicano'|'m5'|'nw';

export default function FarmPage() {
  const [lang, setLang]       = useState<Lang>('IT');
  const [farms, setFarms]     = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken]     = useState('');
  const [sort, setSort]       = useState<Sort>('default');
  const [filter, setFilter]   = useState<Filter>('all');
  const [sheet, setSheet]     = useState<'add'|'edit'|null>(null);
  const [editing, setEditing] = useState<Farm|null>(null);
  const [form, setForm]       = useState<Omit<Farm,'id'|'sortOrder'>>(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [delId, setDelId]     = useState<number|null>(null);
  const [pelLoading, setPelLoading] = useState<Record<number,string>>({});
  const [nwStatus, setNwStatus] = useState(getNwStatus());

  const t = (k: string) => T[lang]?.[k] || T.EN[k] || k;

  // Tick NW countdown every minute
  useEffect(() => {
    const i = setInterval(() => setNwStatus(getNwStatus()), 60000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const s = localStorage.getItem('lang') as Lang|null;
    if (s && LANGS.includes(s)) setLang(s);
    else { const br = navigator.language.split('-')[0].toUpperCase() as Lang; if (LANGS.includes(br)) setLang(br); }
    const tok = localStorage.getItem('token') || '';
    setToken(tok);
    if (tok) { try { const p = JSON.parse(atob(tok.split('.')[1])); if (p.isAdmin) setIsAdmin(true); } catch {} }
    fetch('/api/farms').then(r=>r.json()).then(d=>{setFarms(Array.isArray(d)?d:[]); setLoading(false);});
  }, []);

  const handleAuth = useCallback((tok: string|null, _n: string|null, admin: boolean) => { setToken(tok||''); setIsAdmin(admin); }, []);
  const reload = () => fetch('/api/farms').then(r=>r.json()).then(d=>setFarms(Array.isArray(d)?d:[]));

  const openAdd  = () => { setForm({...EMPTY}); setEditing(null); setSheet('add'); };
  const openEdit = (f: Farm) => { setForm({...f}); setEditing(f); setSheet('edit'); };

  const saveFarm = async () => {
    setSaving(true);
    if (sheet === 'add')       await fetch('/api/farms', { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify(form) });
    else if (editing)          await fetch(`/api/farms/${editing.id}`, { method:'PATCH', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify(form) });
    await reload(); setSaving(false); setSheet(null);
  };

  const deleteFarm = async (id: number) => {
    await fetch(`/api/farms/${id}`, { method:'DELETE', headers:{Authorization:`Bearer ${token}`} });
    await reload(); setDelId(null);
  };

  const pelAction = async (id: number, type: 'sent'|'received') => {
    setPelLoading(p=>({...p,[id]:type}));
    await fetch(`/api/farms/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body:JSON.stringify(type==='sent' ? {pelicanoSentNow:true} : {pelicanoReceivedNow:true}) });
    await reload();
    setPelLoading(p=>{const n={...p}; delete n[id]; return n;});
  };

  const upd = (k: keyof typeof form, v: unknown) => setForm(p=>({...p,[k]:v}));

  const list = useMemo(() => {
    let arr = [...farms];
    if (filter === 'pelicano') arr = arr.filter(f=>f.pelicano);
    if (filter === 'm5')       arr = arr.filter(f=>f.m5Type!=='no');
    if (filter === 'nw')       arr = arr.filter(f=>f.nwDone);
    if (sort === 'received')   arr.sort((a,b) => { if (!a.lastPelicanReceived) return 1; if (!b.lastPelicanReceived) return -1; return new Date(a.lastPelicanReceived).getTime() - new Date(b.lastPelicanReceived).getTime(); });
    if (sort === 'sent')       arr.sort((a,b) => { if (!a.lastPelicanSent) return 1; if (!b.lastPelicanSent) return -1; return new Date(a.lastPelicanSent).getTime() - new Date(b.lastPelicanSent).getTime(); });
    if (sort === 'level')      arr.sort((a,b)=>a.castleLevel.localeCompare(b.castleLevel));
    return arr;
  }, [farms, filter, sort]);

  const S = {
    page: {minHeight:'100vh', background:'#09090a', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'} as React.CSSProperties,
    btn: (p: boolean): React.CSSProperties => ({padding:'8px 14px', borderRadius:9, fontSize:12, fontWeight:700, border:'none', cursor:'pointer', background: p ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color:'#fff'}),
    xs: (c: string): React.CSSProperties => ({padding:'3px 8px', borderRadius:5, fontSize:10, fontWeight:700, border:`1px solid ${c}30`, background:`${c}10`, color:c, cursor:'pointer', whiteSpace:'nowrap'}),
    chip: (a: boolean): React.CSSProperties => ({padding:'5px 11px', borderRadius:20, fontSize:11, fontWeight:700, border:'none', cursor:'pointer', background: a ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: a ? '#fff' : 'rgba(255,255,255,0.5)', whiteSpace:'nowrap'}),
  };

  // Column widths for compact table
  const TH: React.CSSProperties = { padding:'6px 8px', fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:0.5, whiteSpace:'nowrap', background:'#111114', borderBottom:'1px solid rgba(255,255,255,0.08)', position:'sticky', top:0, zIndex:2 };
  const TD: React.CSSProperties = { padding:'8px 8px', fontSize:12, borderBottom:'1px solid rgba(255,255,255,0.05)', verticalAlign:'middle', whiteSpace:'nowrap' };

  return (
    <div style={S.page}>
      <KvkHeader lang={lang} onLang={l=>{setLang(l); localStorage.setItem('lang',l);}} onAuthChange={handleAuth} />

      {/* NW Banner */}
      <div style={{ background: nwStatus.active ? 'linear-gradient(90deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05))' : 'rgba(255,255,255,0.02)', borderBottom:`1px solid ${nwStatus.active ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}`, padding:'8px 16px', display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:16 }}>{nwStatus.active ? '🌍' : '⏳'}</span>
        <span style={{ fontSize:12, fontWeight:700, color: nwStatus.active ? '#4ade80' : 'rgba(255,255,255,0.5)' }}>
          {nwStatus.active ? t('nwActive') : t('nwInactive')}
        </span>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.45)' }}>
          — {nwStatus.active ? t('nwEnds') : t('nwStarts')} <span style={{ color:'#fff', fontWeight:700 }}>{fmtCountdown(nwStatus.msLeft)}</span>
        </span>
      </div>

      {/* Title + controls */}
      <div style={{ padding:'10px 16px 8px', maxWidth:960, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
          <h1 style={{ fontSize:16, fontWeight:800, margin:0, background:'linear-gradient(135deg,#c084fc,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', flex:1 }}>{t('title')} <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', WebkitTextFillColor:'rgba(255,255,255,0.3)' }}>({list.length})</span></h1>
          {isAdmin && <button onClick={openAdd} style={{...S.btn(true), padding:'7px 12px', fontSize:11}}>{t('addFarm')}</button>}
        </div>
        {/* Filters + sort */}
        <div style={{ display:'flex', gap:5, flexWrap:'wrap', alignItems:'center' }}>
          {(['all','pelicano','m5','nw'] as Filter[]).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={S.chip(filter===f)}>
              {{all:t('filterAll'), pelicano:t('filterPel'), m5:'M5', nw:'NW'}[f]}
            </button>
          ))}
          <div style={{flex:1}}/>
          <select value={sort} onChange={e=>setSort(e.target.value as Sort)} style={{...IN, width:'auto', padding:'4px 8px', fontSize:11, minWidth:130}}>
            <option value="default">{t('sortDefault')}</option>
            <option value="received">{t('sortReceived')}</option>
            <option value="sent">{t('sortSent')}</option>
            <option value="level">{t('sortLevel')}</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ padding:'0 16px 40px', maxWidth:960, margin:'0 auto' }}>
        {loading && <p style={{textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:13, padding:'20px 0'}}>...</p>}
        {!loading && (
          <div style={{ overflowX:'auto', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
              <colgroup>
                <col style={{width:20}}/> {/* # */}
                <col style={{width:110}}/> {/* castle */}
                <col style={{width:44}}/> {/* lvl */}
                <col style={{width:36}}/> {/* FP/GO */}
                <col style={{width:64}}/> {/* M5 */}
                <col style={{width:36}}/> {/* forge */}
                <col style={{width:56}}/> {/* pelicano */}
                <col style={{width:90}}/> {/* sent */}
                <col style={{width:90}}/> {/* received */}
                <col style={{width:30}}/> {/* nw */}
                <col style={{width:44}}/> {/* hospital */}
                {isAdmin && <col style={{width:120}}/>} {/* actions */}
              </colgroup>
              <thead>
                <tr>
                  <th style={TH}>#</th>
                  <th style={{...TH, textAlign:'left'}}>{t('castle')}</th>
                  <th style={TH}>{t('lvl')}</th>
                  <th style={TH}>{t('login')}</th>
                  <th style={TH}>{t('m5')}</th>
                  <th style={TH}>⚗</th>
                  <th style={TH}>🦢</th>
                  <th style={TH}>✈ {t('sent')}</th>
                  <th style={TH}>🎯 {t('received')}</th>
                  <th style={TH}>{t('nw')}</th>
                  <th style={TH}>{t('hospital')}</th>
                  {isAdmin && <th style={TH}></th>}
                </tr>
              </thead>
              <tbody>
                {list.map((f, i) => {
                  const rowBg = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent';
                  return (
                    <tr key={f.id} style={{background:rowBg}}>
                      <td style={{...TD, textAlign:'right', color:'rgba(255,255,255,0.25)', fontSize:10}}>{i+1}</td>
                      <td style={{...TD, maxWidth:110, overflow:'hidden', textOverflow:'ellipsis'}}>
                        <span style={{ fontWeight:600, color:'#f1f5f9', fontSize:13 }}>{f.castleName}</span>
                        <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', overflow:'hidden', textOverflow:'ellipsis' }}>{f.loginName}</div>
                      </td>
                      <td style={{...TD, textAlign:'center'}}>
                        <span style={{ fontSize:11, fontWeight:700, padding:'1px 5px', borderRadius:4, background:'rgba(124,58,237,0.15)', color:'#c084fc' }}>{f.castleLevel}</span>
                      </td>
                      <td style={{...TD, textAlign:'center'}}>
                        <span style={{ fontSize:10, fontWeight:700, padding:'1px 5px', borderRadius:4, background: f.loginType==='funplus' ? 'rgba(251,191,36,0.12)' : 'rgba(96,165,250,0.12)', color: f.loginType==='funplus' ? '#fbbf24' : '#60a5fa' }}>
                          {f.loginType==='funplus' ? t('fp') : t('goo')}
                        </span>
                      </td>
                      <td style={{...TD, textAlign:'center'}}>
                        {f.m5Type==='no'
                          ? <span style={{color:'rgba(255,255,255,0.25)', fontSize:11}}>—</span>
                          : <span style={{ fontSize:11, fontWeight:700, color:'#f87171' }}>{f.m5Type==='cavalry'?t('cav'):t('rng')} {fmtTroops(f.m5Count)}</span>
                        }
                      </td>
                      <td style={{...TD, textAlign:'center'}}>
                        {f.crystalForge
                          ? <span style={{color:'#fbbf24', fontSize:13}}>✓</span>
                          : <span title={f.crystalForgeNote||''} style={{color:'rgba(255,255,255,0.25)', fontSize:11, cursor:'help'}}>✗</span>
                        }
                      </td>
                      <td style={{...TD, textAlign:'center'}}>
                        {f.pelicano
                          ? <span style={{fontSize:11, fontWeight:700, color:'#a78bfa'}}>{fmtTroops(f.pelicanoTroops)}</span>
                          : <span style={{color:'rgba(255,255,255,0.2)', fontSize:11}}>—</span>
                        }
                      </td>
                      <td style={{...TD, textAlign:'center'}}>
                        <span style={{ fontSize:10, color: f.lastPelicanSent ? '#e2e8f0' : 'rgba(255,255,255,0.25)' }}>{fmtDate(f.lastPelicanSent, t('never'))}</span>
                      </td>
                      <td style={{...TD, textAlign:'center'}}>
                        <span style={{ fontSize:10, color: f.lastPelicanReceived ? '#f87171' : 'rgba(255,255,255,0.25)' }}>{fmtDate(f.lastPelicanReceived, t('never'))}</span>
                      </td>
                      <td style={{...TD, textAlign:'center'}}>
                        <span style={{ fontSize:12, color: f.nwDone ? '#4ade80' : 'rgba(255,255,255,0.2)' }}>{f.nwDone ? '✓' : '✗'}</span>
                      </td>
                      <td style={{...TD, textAlign:'center'}}>
                        <span style={{ fontSize:10, color:'rgba(255,255,255,0.45)' }}>{f.hospitalCapacity > 0 ? fmtTroops(f.hospitalCapacity) : '—'}</span>
                      </td>
                      {isAdmin && (
                        <td style={{...TD}}>
                          <div style={{ display:'flex', gap:3, flexWrap:'wrap', justifyContent:'center' }}>
                            {f.pelicano && <>
                              <button onClick={()=>pelAction(f.id,'sent')}   disabled={!!pelLoading[f.id]} style={S.xs('#a78bfa')} title={t('sentBtn')}>✈</button>
                              <button onClick={()=>pelAction(f.id,'received')} disabled={!!pelLoading[f.id]} style={S.xs('#f87171')} title={t('receivedBtn')}>🎯</button>
                            </>}
                            <button onClick={()=>openEdit(f)} style={S.xs('#c084fc')} title={t('editFarm')}>✏</button>
                            <button onClick={()=>setDelId(f.id)} style={S.xs('#f87171')} title={t('deleteFarm')}>✕</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm delete */}
      {delId && (
        <div onClick={()=>setDelId(null)} style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(6px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
          <div onClick={e=>e.stopPropagation()} style={{background:'#111115',border:'1px solid rgba(248,113,113,0.3)',borderRadius:16,padding:'24px 20px',maxWidth:300,width:'100%',textAlign:'center'}}>
            <div style={{fontSize:15,fontWeight:700,color:'#fff',marginBottom:16}}>{t('confirmDel')}</div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setDelId(null)} style={{...S.btn(false),flex:1}}>{t('cancel')}</button>
              <button onClick={()=>deleteFarm(delId)} style={{...S.btn(false),flex:1,background:'rgba(239,68,68,0.2)',color:'#f87171'}}>{t('deleteFarm')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit sheet */}
      {sheet && (
        <>
          <div onClick={()=>!saving&&setSheet(null)} style={{position:'fixed',inset:0,zIndex:10000,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(6px)'}}/>
          <div style={{position:'fixed',zIndex:10001,left:'50%',transform:'translateX(-50%)',top:0,bottom:0,width:'100%',maxWidth:520,background:'#111114',display:'flex',flexDirection:'column',boxShadow:'0 0 80px rgba(0,0,0,0.9)'}}>
            <div style={{flexShrink:0,paddingTop:'max(12px,env(safe-area-inset-top))',borderBottom:'1px solid rgba(255,255,255,0.09)'}}>
              <div style={{display:'flex',alignItems:'center',padding:'0 16px 12px',gap:8}}>
                <div style={{flex:1,fontSize:15,fontWeight:800,color:'#fff'}}>{sheet==='add'?t('addFarm'):t('editFarm')}</div>
                <button onClick={()=>setSheet(null)} style={{width:44,height:44,borderRadius:10,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.06)',color:'#e2e8f0',cursor:'pointer',fontSize:18}}>✕</button>
              </div>
            </div>
            <div style={{overflowY:'auto',flex:1,padding:'14px 16px 20px'}}>
              {/* Login type */}
              <div style={{marginBottom:10}}>
                <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>{t('loginType')}</label>
                <div style={{display:'flex',gap:8}}>
                  {['funplus','google'].map(lt=>(
                    <button key={lt} onClick={()=>upd('loginType',lt)} style={{flex:1,padding:'9px',borderRadius:9,fontSize:12,fontWeight:700,border:'none',cursor:'pointer',background:form.loginType===lt?'linear-gradient(135deg,#7c3aed,#2563eb)':'rgba(255,255,255,0.06)',color:form.loginType===lt?'#fff':'#94a3b8'}}>
                      {lt==='funplus'?t('loginFP'):t('loginGoogle')}
                    </button>
                  ))}
                </div>
              </div>
              {[['loginName',t('loginName'),'text'],['castleName',t('castleName'),'text'],['castleLevel',t('castleLevel'),'text']].map(([k,label,type])=>(
                <div key={k} style={{marginBottom:10}}>
                  <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>{label}</label>
                  <input type={type} style={IN} value={(form as Record<string,unknown>)[k] as string||''} onChange={e=>upd(k as keyof typeof form, e.target.value)}/>
                </div>
              ))}
              {/* M5 */}
              <div style={{marginBottom:10}}>
                <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>{t('m5Type')}</label>
                <div style={{display:'flex',gap:6,marginBottom:form.m5Type!=='no'?8:0}}>
                  {['no','cavalry','ranged'].map(v=>(
                    <button key={v} onClick={()=>upd('m5Type',v)} style={{flex:1,padding:'8px',borderRadius:8,fontSize:11,fontWeight:700,border:'none',cursor:'pointer',background:form.m5Type===v?'linear-gradient(135deg,#7c3aed,#2563eb)':'rgba(255,255,255,0.06)',color:form.m5Type===v?'#fff':'#94a3b8'}}>
                      {v==='no'?t('no'):v==='cavalry'?t('cavalry'):t('ranged')}
                    </button>
                  ))}
                </div>
                {form.m5Type!=='no'&&<input type="number" style={IN} placeholder={t('m5Count')} value={form.m5Count||''} onChange={e=>upd('m5Count',Number(e.target.value))}/>}
              </div>
              {/* Crystal Forge */}
              <div style={{marginBottom:10}}>
                <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>{t('crystalForge')}</label>
                <div style={{display:'flex',gap:6,marginBottom:!form.crystalForge?8:0}}>
                  {[true,false].map(v=>(
                    <button key={String(v)} onClick={()=>upd('crystalForge',v)} style={{flex:1,padding:'8px',borderRadius:8,fontSize:11,fontWeight:700,border:'none',cursor:'pointer',background:form.crystalForge===v?'linear-gradient(135deg,#7c3aed,#2563eb)':'rgba(255,255,255,0.06)',color:form.crystalForge===v?'#fff':'#94a3b8'}}>
                      {v?t('yes'):t('no')}
                    </button>
                  ))}
                </div>
                {!form.crystalForge&&<input type="text" style={IN} placeholder={t('crystalForgeNote')} value={form.crystalForgeNote||''} onChange={e=>upd('crystalForgeNote',e.target.value)}/>}
              </div>
              {/* Pelicano */}
              <div style={{marginBottom:10}}>
                <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>🦢 {t('pelicano')}</label>
                <div style={{display:'flex',gap:6,marginBottom:form.pelicano?8:0}}>
                  {[true,false].map(v=>(
                    <button key={String(v)} onClick={()=>upd('pelicano',v)} style={{flex:1,padding:'8px',borderRadius:8,fontSize:11,fontWeight:700,border:'none',cursor:'pointer',background:form.pelicano===v?'linear-gradient(135deg,#7c3aed,#2563eb)':'rgba(255,255,255,0.06)',color:form.pelicano===v?'#fff':'#94a3b8'}}>
                      {v?t('yes'):t('no')}
                    </button>
                  ))}
                </div>
                {form.pelicano&&<input type="number" style={IN} placeholder={t('pelicanoTroops')} value={form.pelicanoTroops||''} onChange={e=>upd('pelicanoTroops',Number(e.target.value))}/>}
              </div>
              {/* NW */}
              <div style={{marginBottom:10}}>
                <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>{t('nwDone')}</label>
                <div style={{display:'flex',gap:6}}>
                  {[true,false].map(v=>(
                    <button key={String(v)} onClick={()=>upd('nwDone',v)} style={{flex:1,padding:'8px',borderRadius:8,fontSize:11,fontWeight:700,border:'none',cursor:'pointer',background:form.nwDone===v?'linear-gradient(135deg,#7c3aed,#2563eb)':'rgba(255,255,255,0.06)',color:form.nwDone===v?'#fff':'#94a3b8'}}>
                      {v?t('yes'):t('no')}
                    </button>
                  ))}
                </div>
              </div>
              {[['hospitalCapacity',t('hospitalCap'),'number'],['notes',t('notesLabel'),'text']].map(([k,label,type])=>(
                <div key={k} style={{marginBottom:10}}>
                  <label style={{fontSize:11,color:'#94a3b8',display:'block',marginBottom:4}}>{label}</label>
                  <input type={type} style={IN} value={(form as Record<string,unknown>)[k] as string||''} onChange={e=>upd(k as keyof typeof form, type==='number'?Number(e.target.value):e.target.value)}/>
                </div>
              ))}
              <div style={{display:'flex',gap:10,marginTop:16}}>
                <button onClick={()=>setSheet(null)} style={{...S.btn(false),flex:1}}>{t('cancel')}</button>
                <button onClick={saveFarm} disabled={saving} style={{...S.btn(true),flex:2}}>{saving?t('saving'):t('save')}</button>
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
        tr:hover td{background:rgba(124,58,237,0.05) !important}
      `}</style>
    </div>
  );
}
