'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = typeof LANGS[number];

const T: Record<Lang, Record<string, string>> = {
  IT: {
    title: 'Pacchi KVK',
    subtitle: 'Seleziona un evento per vedere la distribuzione pacchi',
    newEvent: '+ Nuovo Evento',
    noEvents: 'Nessun evento trovato.',
    players: 'giocatori',
    packs: 'pacchi',
    active: 'Attivo',
    closed: 'Chiuso',
    eventName: 'Nome evento',
    eventDate: 'Data',
    p90: '90',
    p60: '60',
    p30: '30',
    create: 'Crea',
    cancel: 'Annulla',
    total: 'Totale',
    available: 'Disponibili',
  },
  EN: {
    title: 'KVK Packages',
    subtitle: 'Select an event to view package distribution',
    newEvent: '+ New Event',
    noEvents: 'No events found.',
    players: 'players',
    packs: 'packs',
    active: 'Active',
    closed: 'Closed',
    eventName: 'Event name',
    eventDate: 'Date',
    p90: '90',
    p60: '60',
    p30: '30',
    create: 'Create',
    cancel: 'Cancel',
    total: 'Total',
    available: 'Available',
  },
  PL: { title: 'Pakiety KvK', subtitle: 'Wybierz wydarzenie', newEvent: '+ Nowe', noEvents: 'Brak wydarzeń.', players: 'gracze', packs: 'paczki', active: 'Aktywny', closed: 'Zamknięty', eventName: 'Nazwa', eventDate: 'Data', p90: '90', p60: '60', p30: '30', create: 'Utwórz', cancel: 'Anuluj', total: 'Suma', available: 'Dostępne' },
  ZH: { title: 'KVK礼包', subtitle: '选择活动', newEvent: '+ 新活动', noEvents: '没有活动。', players: '玩家', packs: '礼包', active: '活跃', closed: '已关闭', eventName: '活动名称', eventDate: '日期', p90: '90', p60: '60', p30: '30', create: '创建', cancel: '取消', total: '总计', available: '可用' },
  DE: { title: 'KVK-Pakete', subtitle: 'Ereignis auswählen', newEvent: '+ Neues Ereignis', noEvents: 'Keine Ereignisse.', players: 'Spieler', packs: 'Pakete', active: 'Aktiv', closed: 'Geschlossen', eventName: 'Ereignisname', eventDate: 'Datum', p90: '90', p60: '60', p30: '30', create: 'Erstellen', cancel: 'Abbrechen', total: 'Gesamt', available: 'Verfügbar' },
  FR: { title: 'Packages KvK', subtitle: 'Sélectionnez un événement', newEvent: '+ Nouvel événement', noEvents: 'Aucun événement.', players: 'joueurs', packs: 'packages', active: 'Actif', closed: 'Fermé', eventName: "Nom de l'événement", eventDate: 'Date', p90: '90', p60: '60', p30: '30', create: 'Créer', cancel: 'Annuler', total: 'Total', available: 'Disponibles' },
  RU: { title: 'Пакеты KvK', subtitle: 'Выберите событие', newEvent: '+ Новое событие', noEvents: 'Событий нет.', players: 'игроки', packs: 'пакеты', active: 'Активно', closed: 'Закрыто', eventName: 'Название события', eventDate: 'Дата', p90: '90', p60: '60', p30: '30', create: 'Создать', cancel: 'Отмена', total: 'Всего', available: 'Доступно' },
  ES: { title: 'Paquetes KvK', subtitle: 'Selecciona un evento', newEvent: '+ Nuevo evento', noEvents: 'No hay eventos.', players: 'jugadores', packs: 'paquetes', active: 'Activo', closed: 'Cerrado', eventName: 'Nombre del evento', eventDate: 'Fecha', p90: '90', p60: '60', p30: '30', create: 'Crear', cancel: 'Cancelar', total: 'Total', available: 'Disponibles' },
};

interface KvkEvent {
  id: number;
  name: string;
  date: string;
  pack90Total: number;
  pack60Total: number;
  pack30Total: number;
  isActive: boolean;
  _count: { players: number };
}

export default function KvkPage() {
  const [lang, setLang] = useState<Lang>('IT');
  const [events, setEvents] = useState<KvkEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', pack90Total: '3', pack60Total: '33', pack30Total: '140' });
  const [saving, setSaving] = useState(false);

  const t = (k: string) => T[lang][k] || T['EN'][k] || k;

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored && LANGS.includes(stored)) setLang(stored);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.isAdmin) setIsAdmin(true);
      } catch {}
    }
    fetch('/api/kvk/events').then(r => r.json()).then(d => { setEvents(d); setLoading(false); });
  }, []);

  const createEvent = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    const res = await fetch('/api/kvk/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, pack90Total: Number(form.pack90Total), pack60Total: Number(form.pack60Total), pack30Total: Number(form.pack30Total) }),
    });
    if (res.ok) {
      const ev = await res.json();
      setEvents(prev => [{ ...ev, _count: { players: 0 } }, ...prev]);
      setShowCreate(false);
      setForm({ name: '', date: '', pack90Total: '3', pack60Total: '33', pack30Total: '140' });
    }
    setSaving(false);
  };

  const S = {
    page: { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' } as React.CSSProperties,
    header: { position: 'sticky' as const, top: 0, zIndex: 50, background: 'rgba(9,9,10,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(124,58,237,0.15)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    logo: { width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' } as React.CSSProperties,
    langBtn: (active: boolean) => ({ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, border: 'none', cursor: 'pointer', background: active ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: active ? '#fff' : 'rgba(255,255,255,0.4)' }),
    card: (active: boolean) => ({ display: 'block', padding: '16px', borderRadius: 14, marginBottom: 8, background: active ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.07)'}`, textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties),
    input: { width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
    btn: (primary: boolean) => ({ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff' }),
  };

  return (
    <div style={S.page}>
      {/* HEADER */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={S.logo}>k</div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>698</span>
        </div>
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 200 }}>
          {LANGS.map(l => <button key={l} style={S.langBtn(lang === l)} onClick={() => { setLang(l); localStorage.setItem('lang', l); }}>{l}</button>)}
        </div>
      </div>

      {/* TITLE */}
      <div style={{ padding: '24px 16px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(1.3rem,5vw,2rem)', fontWeight: 900, margin: '0 0 6px', background: 'linear-gradient(135deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title')}</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{t('subtitle')}</p>
      </div>

      {/* CREATE BUTTON */}
      {isAdmin && (
        <div style={{ padding: '0 16px 16px' }}>
          <button onClick={() => setShowCreate(!showCreate)} style={{ ...S.btn(true), width: '100%' }}>{t('newEvent')}</button>
        </div>
      )}

      {/* CREATE FORM */}
      {showCreate && (
        <div style={{ margin: '0 16px 16px', padding: 16, borderRadius: 14, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input style={S.input} placeholder={t('eventName')} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <input style={S.input} placeholder={t('eventDate')} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[['pack90Total', '×90'], ['pack60Total', '×60'], ['pack30Total', '×30']].map(([k, label]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</div>
                  <input style={S.input} type="number" value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...S.btn(false), flex: 1 }} onClick={() => setShowCreate(false)}>{t('cancel')}</button>
              <button style={{ ...S.btn(true), flex: 2 }} onClick={createEvent} disabled={saving}>{saving ? '...' : t('create')}</button>
            </div>
          </div>
        </div>
      )}

      {/* EVENTS LIST */}
      <div style={{ padding: '0 16px 40px' }}>
        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>...</p>}
        {!loading && events.length === 0 && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>{t('noEvents')}</p>}
        {events.map(ev => (
          <Link key={ev.id} href={`/kvk/${ev.id}`} style={S.card(ev.isActive)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{ev.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{ev.date} · {ev._count.players} {t('players')}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: ev.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)', color: ev.isActive ? '#4ade80' : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{ev.isActive ? t('active') : t('closed')}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {[['90', ev.pack90Total, '#f87171'], ['60', ev.pack60Total, '#fbbf24'], ['30', ev.pack30Total, '#a78bfa']].map(([type, count, color]) => (
                <span key={type as string} style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: `${color}15`, color: color as string, border: `1px solid ${color}25` }}>
                  {count}×{type}
                </span>
              ))}
              <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
                = {(ev.pack90Total + ev.pack60Total + ev.pack30Total)} {t('packs')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
