'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: {
    back: '← Indietro',
    available: 'Disponibili',
    assigned: 'Assegnati',
    remaining: 'Rimanenti',
    players: 'GIOCATORI',
    under100: 'SOTTO 100M PUNTI',
    name: 'Nome',
    alliance: 'Alleanza',
    score: 'Punti',
    packs: 'Pacchi',
    notes: 'Note',
    adminPanel: 'Pannello Admin',
    importPlayers: 'Importa Giocatori (CSV/testo)',
    importHint: 'pos,nome,alleanza,punti,under100m(0/1),note — una per riga',
    importBtn: 'Importa e Salva',
    saving: 'Salvataggio...',
    saved: 'Salvato!',
    editEvent: 'Modifica Evento',
    eventName: 'Nome evento',
    eventDate: 'Data',
    p90avail: '90 disponibili',
    p60avail: '60 disponibili',
    p30avail: '30 disponibili',
    save: 'Salva',
    cancel: 'Annulla',
    noPlayers: 'Nessun giocatore. Usa il pannello admin per importare.',
    priority: 'PRIORITÀ',
    total: 'Totale',
    rank: '#',
  },
  EN: {
    back: '← Back',
    available: 'Available',
    assigned: 'Assigned',
    remaining: 'Remaining',
    players: 'PLAYERS',
    under100: 'UNDER 100M POINTS',
    name: 'Name',
    alliance: 'Alliance',
    score: 'Score',
    packs: 'Packs',
    notes: 'Notes',
    adminPanel: 'Admin Panel',
    importPlayers: 'Import Players (CSV/text)',
    importHint: 'pos,name,alliance,score,under100m(0/1),notes — one per line',
    importBtn: 'Import & Save',
    saving: 'Saving...',
    saved: 'Saved!',
    editEvent: 'Edit Event',
    eventName: 'Event name',
    eventDate: 'Date',
    p90avail: '90 available',
    p60avail: '60 available',
    p30avail: '30 available',
    save: 'Save',
    cancel: 'Cancel',
    noPlayers: 'No players. Use the admin panel to import.',
    priority: 'PRIORITY',
    total: 'Total',
    rank: '#',
  },
  PL: { back: '← Wróć', available: 'Dostępne', assigned: 'Przypisane', remaining: 'Pozostałe', players: 'GRACZE', under100: 'PONIŻEJ 100M', name: 'Nazwa', alliance: 'Sojusz', score: 'Punkty', packs: 'Paczki', notes: 'Notatki', adminPanel: 'Panel Admina', importPlayers: 'Importuj Graczy', importHint: 'poz,nazwa,sojusz,punkty,under100m(0/1),notatki', importBtn: 'Importuj i Zapisz', saving: 'Zapisywanie...', saved: 'Zapisano!', editEvent: 'Edytuj Wydarzenie', eventName: 'Nazwa', eventDate: 'Data', p90avail: '90 dostępne', p60avail: '60 dostępne', p30avail: '30 dostępne', save: 'Zapisz', cancel: 'Anuluj', noPlayers: 'Brak graczy.', priority: 'PRIORYTET', total: 'Suma', rank: '#' },
  ZH: { back: '← 返回', available: '可用', assigned: '已分配', remaining: '剩余', players: '玩家', under100: '100M以下积分', name: '名称', alliance: '联盟', score: '积分', packs: '礼包', notes: '备注', adminPanel: '管理面板', importPlayers: '导入玩家', importHint: '位置,名称,联盟,积分,100M以下(0/1),备注', importBtn: '导入并保存', saving: '保存中...', saved: '已保存!', editEvent: '编辑活动', eventName: '活动名称', eventDate: '日期', p90avail: '90可用', p60avail: '60可用', p30avail: '30可用', save: '保存', cancel: '取消', noPlayers: '没有玩家。', priority: '优先', total: '总计', rank: '#' },
  DE: { back: '← Zurück', available: 'Verfügbar', assigned: 'Zugewiesen', remaining: 'Verbleibend', players: 'SPIELER', under100: 'UNTER 100M PUNKTE', name: 'Name', alliance: 'Allianz', score: 'Punkte', packs: 'Pakete', notes: 'Notizen', adminPanel: 'Admin-Panel', importPlayers: 'Spieler importieren', importHint: 'pos,name,allianz,punkte,unter100m(0/1),notizen', importBtn: 'Importieren & Speichern', saving: 'Speichern...', saved: 'Gespeichert!', editEvent: 'Ereignis bearbeiten', eventName: 'Ereignisname', eventDate: 'Datum', p90avail: '90 verfügbar', p60avail: '60 verfügbar', p30avail: '30 verfügbar', save: 'Speichern', cancel: 'Abbrechen', noPlayers: 'Keine Spieler.', priority: 'PRIORITÄT', total: 'Gesamt', rank: '#' },
  FR: { back: '← Retour', available: 'Disponibles', assigned: 'Attribués', remaining: 'Restants', players: 'JOUEURS', under100: 'MOINS DE 100M POINTS', name: 'Nom', alliance: 'Alliance', score: 'Score', packs: 'Packages', notes: 'Notes', adminPanel: "Panneau d'Admin", importPlayers: 'Importer des Joueurs', importHint: 'pos,nom,alliance,score,moins100m(0/1),notes', importBtn: 'Importer et Sauvegarder', saving: 'Sauvegarde...', saved: 'Sauvegardé!', editEvent: "Modifier l'événement", eventName: "Nom de l'événement", eventDate: 'Date', p90avail: '90 disponibles', p60avail: '60 disponibles', p30avail: '30 disponibles', save: 'Sauvegarder', cancel: 'Annuler', noPlayers: 'Aucun joueur.', priority: 'PRIORITÉ', total: 'Total', rank: '#' },
  RU: { back: '← Назад', available: 'Доступно', assigned: 'Назначено', remaining: 'Осталось', players: 'ИГРОКИ', under100: 'НИЖЕ 100M ОЧКОВ', name: 'Имя', alliance: 'Альянс', score: 'Очки', packs: 'Пакеты', notes: 'Заметки', adminPanel: 'Панель Админа', importPlayers: 'Импорт Игроков', importHint: 'поз,имя,альянс,очки,ниже100м(0/1),заметки', importBtn: 'Импорт и Сохранить', saving: 'Сохранение...', saved: 'Сохранено!', editEvent: 'Редактировать событие', eventName: 'Название', eventDate: 'Дата', p90avail: '90 доступно', p60avail: '60 доступно', p30avail: '30 доступно', save: 'Сохранить', cancel: 'Отмена', noPlayers: 'Нет игроков.', priority: 'ПРИОРИТЕТ', total: 'Всего', rank: '#' },
  ES: { back: '← Volver', available: 'Disponibles', assigned: 'Asignados', remaining: 'Restantes', players: 'JUGADORES', under100: 'MENOS DE 100M PUNTOS', name: 'Nombre', alliance: 'Alianza', score: 'Puntos', packs: 'Paquetes', notes: 'Notas', adminPanel: 'Panel de Admin', importPlayers: 'Importar Jugadores', importHint: 'pos,nombre,alianza,puntos,menos100m(0/1),notas', importBtn: 'Importar y Guardar', saving: 'Guardando...', saved: '¡Guardado!', editEvent: 'Editar Evento', eventName: 'Nombre del evento', eventDate: 'Fecha', p90avail: '90 disponibles', p60avail: '60 disponibles', p30avail: '30 disponibles', save: 'Guardar', cancel: 'Cancelar', noPlayers: 'No hay jugadores.', priority: 'PRIORIDAD', total: 'Total', rank: '#' },
};

interface KvkPlayer {
  id: number;
  pos: number;
  name: string;
  alliance: string | null;
  score: number;
  notes: string | null;
  pack90: number;
  pack60: number;
  pack30: number;
  under100m: boolean;
}

interface KvkEvent {
  id: number;
  name: string;
  date: string;
  pack90Total: number;
  pack60Total: number;
  pack30Total: number;
  isActive: boolean;
  players: KvkPlayer[];
}

const PACK_COLOR: Record<string, string> = { '90': '#f87171', '60': '#fbbf24', '30': '#a78bfa' };

function PackBadges({ p90, p60, p30 }: { p90: number; p60: number; p30: number }) {
  const badges: React.ReactNode[] = [];
  for (let i = 0; i < p90; i++) badges.push(<span key={`90-${i}`} style={{ fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: `${PACK_COLOR['90']}18`, color: PACK_COLOR['90'], border: `1px solid ${PACK_COLOR['90']}30` }}>90</span>);
  for (let i = 0; i < p60; i++) badges.push(<span key={`60-${i}`} style={{ fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: `${PACK_COLOR['60']}18`, color: PACK_COLOR['60'], border: `1px solid ${PACK_COLOR['60']}30` }}>60</span>);
  for (let i = 0; i < p30; i++) badges.push(<span key={`30-${i}`} style={{ fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: `${PACK_COLOR['30']}18`, color: PACK_COLOR['30'], border: `1px solid ${PACK_COLOR['30']}30` }}>30</span>);
  if (badges.length === 0) return <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>—</span>;
  return <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>{badges}</div>;
}

function PackControls({ player, token, onUpdate }: { player: KvkPlayer; token: string; onUpdate: (id: number, field: string, val: number) => void }) {
  const update = async (field: 'pack90' | 'pack60' | 'pack30', delta: number) => {
    const cur = player[field];
    const next = Math.max(0, cur + delta);
    const res = await fetch(`/api/kvk/players/${player.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ [field]: next }),
    });
    if (res.ok) onUpdate(player.id, field, next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {(['90', '60', '30'] as const).map(type => {
        const field = `pack${type}` as 'pack90' | 'pack60' | 'pack30';
        const count = player[field];
        return (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, width: 22, color: PACK_COLOR[type] }}>{type}</span>
            <button onClick={() => update(field, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.06)', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>−</button>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', width: 20, textAlign: 'center' }}>{count}</span>
            <button onClick={() => update(field, +1)} style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'rgba(124,58,237,0.3)', color: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>+</button>
          </div>
        );
      })}
    </div>
  );
}

export default function KvkEventPage() {
  const params = useParams();
  const id = params?.id as string;

  const [lang, setLang] = useState<Lang>('IT');
  const [event, setEvent] = useState<KvkEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [editForm, setEditForm] = useState({ name: '', date: '', pack90Total: '', pack60Total: '', pack30Total: '' });
  const [showEdit, setShowEdit] = useState(false);

  const t = (k: string) => T[lang][k] || T['EN'][k] || k;

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored && LANGS.includes(stored)) {
      setLang(stored);
    } else {
      const browser = navigator.language.split('-')[0].toUpperCase() as Lang;
      if (LANGS.includes(browser)) setLang(browser);
    }
    const tok = localStorage.getItem('token') || '';
    setToken(tok);
    if (tok) {
      try {
        const payload = JSON.parse(atob(tok.split('.')[1]));
        if (payload.isAdmin) setIsAdmin(true);
      } catch {}
    }
    fetch(`/api/kvk/events/${id}`).then(r => r.json()).then(d => {
      setEvent(d);
      setEditForm({ name: d.name, date: d.date, pack90Total: String(d.pack90Total), pack60Total: String(d.pack60Total), pack30Total: String(d.pack30Total) });
      setLoading(false);
    });
  }, [id]);

  const totals = useMemo(() => {
    if (!event) return { p90: 0, p60: 0, p30: 0, tot: 0 };
    return event.players.reduce((s, p) => ({
      p90: s.p90 + p.pack90,
      p60: s.p60 + p.pack60,
      p30: s.p30 + p.pack30,
      tot: s.tot + p.pack90 + p.pack60 + p.pack30,
    }), { p90: 0, p60: 0, p30: 0, tot: 0 });
  }, [event]);

  const remaining = useMemo(() => {
    if (!event) return { p90: 0, p60: 0, p30: 0 };
    return { p90: event.pack90Total - totals.p90, p60: event.pack60Total - totals.p60, p30: event.pack30Total - totals.p30 };
  }, [event, totals]);

  const updatePlayer = useCallback((playerId: number, field: string, val: number) => {
    setEvent(prev => prev ? {
      ...prev,
      players: prev.players.map(p => p.id === playerId ? { ...p, [field]: val } : p),
    } : prev);
  }, []);

  const importPlayers = async () => {
    setImportStatus('saving');
    const lines = importText.trim().split('\n').filter(l => l.trim());
    const players = lines.map((line, i) => {
      const parts = line.split(',').map(s => s.trim());
      const pos = Number(parts[0]) || i + 1;
      const name = parts[1] || `Player ${i + 1}`;
      const alliance = parts[2] || null;
      const score = Number(parts[3]) || 0;
      const under100m = parts[4] === '1';
      const notes = parts[5] || null;
      return { pos, name, alliance, score, under100m, notes };
    });
    const res = await fetch('/api/kvk/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ eventId: id, players }),
    });
    if (res.ok) {
      const evRes = await fetch(`/api/kvk/events/${id}`);
      const ev = await evRes.json();
      setEvent(ev);
      setImportText('');
      setImportStatus('saved');
      setTimeout(() => setImportStatus('idle'), 2000);
    } else {
      setImportStatus('idle');
    }
  };

  const saveEventEdit = async () => {
    const res = await fetch(`/api/kvk/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...editForm, pack90Total: Number(editForm.pack90Total), pack60Total: Number(editForm.pack60Total), pack30Total: Number(editForm.pack30Total) }),
    });
    if (res.ok) {
      const updated = await res.json();
      setEvent(prev => prev ? { ...prev, ...updated } : prev);
      setShowEdit(false);
    }
  };

  const mainPlayers = useMemo(() => event?.players.filter(p => !p.under100m) ?? [], [event]);
  const under100Players = useMemo(() => event?.players.filter(p => p.under100m) ?? [], [event]);

  const S = {
    page: { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' } as React.CSSProperties,
    row: (priority: boolean, under: boolean) => ({
      padding: '12px 14px', borderRadius: 12, marginBottom: 4,
      background: priority ? 'rgba(124,58,237,0.12)' : under ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${priority ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.05)'}`,
    }),
    input: { width: '100%', padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const },
    textarea: { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box' as const, resize: 'vertical' as const, minHeight: 140, fontFamily: 'monospace' },
    btn: (primary: boolean) => ({ padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff' }),
    statBox: (color: string) => ({ flex: 1, textAlign: 'center' as const, padding: '10px 8px', borderRadius: 10, background: `${color}10`, border: `1px solid ${color}20` }),
  };

  if (loading) return <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>...</div>;
  if (!event) return <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)' }}>Not found</div>;

  const isPriority = (p: KvkPlayer) => p.pack90 + p.pack60 + p.pack30 >= 3;

  return (
    <div style={S.page}>
      <KvkHeader
        lang={lang}
        onLang={l => { setLang(l); localStorage.setItem('lang', l); }}
        backHref="/kvk"
        backLabel={t('back')}
      />

      {/* TITLE */}
      <div style={{ padding: '20px 16px 8px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.1rem,4.5vw,1.6rem)', fontWeight: 900, margin: '0 0 4px', background: 'linear-gradient(135deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{event.name}</h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{event.date}</p>
      </div>

      {/* STATS */}
      <div style={{ padding: '12px 16px' }}>
        {/* Available */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: '32px', flexShrink: 0 }}>{t('available')}</div>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            {[['90', event.pack90Total, '#f87171'], ['60', event.pack60Total, '#fbbf24'], ['30', event.pack30Total, '#a78bfa']].map(([type, count, color]) => (
              <div key={type as string} style={S.statBox(color as string)}>
                <div style={{ fontSize: 15, fontWeight: 900, color: color as string }}>{count as number}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 2 }}>×{type}</div>
              </div>
            ))}
            <div style={S.statBox('#fff')}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{event.pack90Total + event.pack60Total + event.pack30Total}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 2 }}>TOT</div>
            </div>
          </div>
        </div>
        {/* Assigned */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: '32px', flexShrink: 0 }}>{t('assigned')}</div>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            {[['90', totals.p90, '#f87171'], ['60', totals.p60, '#fbbf24'], ['30', totals.p30, '#a78bfa']].map(([type, count, color]) => (
              <div key={type as string} style={S.statBox(color as string)}>
                <div style={{ fontSize: 15, fontWeight: 900, color: color as string }}>{count as number}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 2 }}>×{type}</div>
              </div>
            ))}
            <div style={S.statBox('#fff')}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{totals.tot}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 2 }}>TOT</div>
            </div>
          </div>
        </div>
        {/* Remaining */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: '32px', flexShrink: 0 }}>{t('remaining')}</div>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            {[['90', remaining.p90, '#f87171'], ['60', remaining.p60, '#fbbf24'], ['30', remaining.p30, '#a78bfa']].map(([type, count, color]) => {
              const neg = (count as number) < 0;
              return (
                <div key={type as string} style={{ ...S.statBox(neg ? '#ef4444' : (color as string)), border: neg ? '1px solid rgba(239,68,68,0.4)' : undefined }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: neg ? '#ef4444' : (color as string) }}>{count as number}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 2 }}>×{type}</div>
                </div>
              );
            })}
            <div style={S.statBox('#fff')}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{event.pack90Total + event.pack60Total + event.pack30Total - totals.tot}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 2 }}>TOT</div>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN TOGGLE */}
      {isAdmin && (
        <div style={{ padding: '8px 16px 12px' }}>
          <button onClick={() => setShowAdmin(!showAdmin)} style={{ ...S.btn(showAdmin), width: '100%', fontSize: 12 }}>
            {showAdmin ? '✕ ' : '⚙ '}{t('adminPanel')}
          </button>
        </div>
      )}

      {/* ADMIN PANEL */}
      {isAdmin && showAdmin && (
        <div style={{ margin: '0 16px 16px', padding: 16, borderRadius: 14, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Edit event */}
          <div>
            <button onClick={() => setShowEdit(!showEdit)} style={{ ...S.btn(false), fontSize: 12, marginBottom: showEdit ? 10 : 0 }}>{t('editEvent')}</button>
            {showEdit && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                <input style={S.input} placeholder={t('eventName')} value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                <input style={S.input} placeholder={t('eventDate')} value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[['pack90Total', t('p90avail')], ['pack60Total', t('p60avail')], ['pack30Total', t('p30avail')]].map(([k, label]) => (
                    <div key={k}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</div>
                      <input style={S.input} type="number" value={editForm[k as keyof typeof editForm]} onChange={e => setEditForm(f => ({ ...f, [k]: e.target.value }))} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ ...S.btn(false), flex: 1 }} onClick={() => setShowEdit(false)}>{t('cancel')}</button>
                  <button style={{ ...S.btn(true), flex: 2 }} onClick={saveEventEdit}>{t('save')}</button>
                </div>
              </div>
            )}
          </div>

          {/* Import players */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{t('importPlayers')}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontFamily: 'monospace' }}>{t('importHint')}</div>
            <textarea
              style={S.textarea}
              placeholder="1,Cymber,k698,1500000000,0,\n2,Cristian,k698,1400000000,0,"
              value={importText}
              onChange={e => setImportText(e.target.value)}
            />
            <button
              style={{ ...S.btn(true), width: '100%', marginTop: 8 }}
              onClick={importPlayers}
              disabled={importStatus === 'saving' || !importText.trim()}
            >
              {importStatus === 'saving' ? t('saving') : importStatus === 'saved' ? t('saved') : t('importBtn')}
            </button>
          </div>
        </div>
      )}

      {/* PLAYER LIST */}
      <div style={{ padding: '0 12px' }}>
        {event.players.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '20px 0' }}>{t('noPlayers')}</p>
        )}

        {mainPlayers.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }}>{t('players')} ({mainPlayers.length})</div>
            {mainPlayers.map(p => (
              <div key={p.id} style={S.row(isPriority(p), false)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  {/* Left: pos + name + alliance + score */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', width: 22, flexShrink: 0 }}>#{p.pos}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                      {isPriority(p) && <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', color: '#fff', flexShrink: 0 }}>MAX</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.4)', paddingLeft: 28 }}>
                      {p.alliance && <span style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4, color: 'rgba(255,255,255,0.6)' }}>{p.alliance}</span>}
                      {p.score > 0 && <span>{(p.score / 1e6).toFixed(0)}M</span>}
                      {p.notes && <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>{p.notes}</span>}
                    </div>
                    <div style={{ marginTop: 6, paddingLeft: 28 }}>
                      <PackBadges p90={p.pack90} p60={p.pack60} p30={p.pack30} />
                    </div>
                  </div>
                  {/* Right: controls (admin only) */}
                  {isAdmin && showAdmin && (
                    <PackControls player={p} token={token} onUpdate={updatePlayer} />
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {under100Players.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 }}>{t('under100')} ({under100Players.length})</div>
            {under100Players.map(p => (
              <div key={p.id} style={S.row(false, true)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', width: 22, flexShrink: 0 }}>#{p.pos}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.4)', paddingLeft: 28 }}>
                      {p.alliance && <span style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4, color: 'rgba(255,255,255,0.5)' }}>{p.alliance}</span>}
                      {p.score > 0 && <span>{(p.score / 1e6).toFixed(0)}M</span>}
                    </div>
                    <div style={{ marginTop: 6, paddingLeft: 28 }}>
                      <PackBadges p90={p.pack90} p60={p.pack60} p30={p.pack30} />
                    </div>
                  </div>
                  {isAdmin && showAdmin && (
                    <PackControls player={p} token={token} onUpdate={updatePlayer} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
