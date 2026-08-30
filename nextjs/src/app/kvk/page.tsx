'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import KvkHeader, { KvkLang } from '@/components/KvkHeader';

const LANGS = ['IT', 'EN', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'] as const;
type Lang = KvkLang;

const T: Record<Lang, Record<string, string>> = {
  IT: { title: 'Pacchi KVK', active: 'EVENTI ATTIVI', past: 'EVENTI PASSATI', newEvent: '+ Nuovo Evento', noActive: 'Nessun evento attivo.', noPast: 'Nessun evento passato.', players: 'giocatori', packs: 'pacchi', isActive: 'Attivo', closed: 'Chiuso', eventName: 'Nome evento', eventDate: 'Data (es. 30/08/2026)', p90: '×90 disponibili', p60: '×60 disponibili', p30: '×30 disponibili', create: 'Crea Evento', cancel: 'Annulla', loginPrompt: 'Accedi come admin per creare e gestire eventi.' },
  EN: { title: 'KVK Packages', active: 'ACTIVE EVENTS', past: 'PAST EVENTS', newEvent: '+ New Event', noActive: 'No active events.', noPast: 'No past events.', players: 'players', packs: 'packs', isActive: 'Active', closed: 'Closed', eventName: 'Event name', eventDate: 'Date (e.g. 30/08/2026)', p90: '×90 available', p60: '×60 available', p30: '×30 available', create: 'Create Event', cancel: 'Cancel', loginPrompt: 'Log in as admin to create and manage events.' },
  PL: { title: 'Pakiety KvK', active: 'AKTYWNE WYDARZENIA', past: 'MINIONE WYDARZENIA', newEvent: '+ Nowe', noActive: 'Brak aktywnych.', noPast: 'Brak minionych.', players: 'gracze', packs: 'paczki', isActive: 'Aktywny', closed: 'Zamknięty', eventName: 'Nazwa', eventDate: 'Data', p90: '×90', p60: '×60', p30: '×30', create: 'Utwórz', cancel: 'Anuluj', loginPrompt: 'Zaloguj się jako admin.' },
  ZH: { title: 'KVK礼包', active: '活跃活动', past: '历史活动', newEvent: '+ 新活动', noActive: '没有活跃活动。', noPast: '没有历史活动。', players: '玩家', packs: '礼包', isActive: '活跃', closed: '已关闭', eventName: '活动名称', eventDate: '日期', p90: '×90', p60: '×60', p30: '×30', create: '创建', cancel: '取消', loginPrompt: '请以管理员身份登录。' },
  DE: { title: 'KVK-Pakete', active: 'AKTIVE EREIGNISSE', past: 'VERGANGENE EREIGNISSE', newEvent: '+ Neues Ereignis', noActive: 'Keine aktiven Ereignisse.', noPast: 'Keine vergangenen.', players: 'Spieler', packs: 'Pakete', isActive: 'Aktiv', closed: 'Geschlossen', eventName: 'Ereignisname', eventDate: 'Datum', p90: '×90', p60: '×60', p30: '×30', create: 'Erstellen', cancel: 'Abbrechen', loginPrompt: 'Als Admin anmelden.' },
  FR: { title: 'Packages KvK', active: 'ÉVÉNEMENTS ACTIFS', past: 'ÉVÉNEMENTS PASSÉS', newEvent: '+ Nouvel événement', noActive: 'Aucun événement actif.', noPast: 'Aucun événement passé.', players: 'joueurs', packs: 'packages', isActive: 'Actif', closed: 'Fermé', eventName: "Nom de l'événement", eventDate: 'Date', p90: '×90', p60: '×60', p30: '×30', create: 'Créer', cancel: 'Annuler', loginPrompt: 'Connectez-vous en tant qu\'admin.' },
  RU: { title: 'Пакеты KvK', active: 'АКТИВНЫЕ СОБЫТИЯ', past: 'ПРОШЕДШИЕ СОБЫТИЯ', newEvent: '+ Новое событие', noActive: 'Нет активных событий.', noPast: 'Нет прошедших.', players: 'игроки', packs: 'пакеты', isActive: 'Активно', closed: 'Закрыто', eventName: 'Название', eventDate: 'Дата', p90: '×90', p60: '×60', p30: '×30', create: 'Создать', cancel: 'Отмена', loginPrompt: 'Войдите как администратор.' },
  ES: { title: 'Paquetes KvK', active: 'EVENTOS ACTIVOS', past: 'EVENTOS PASADOS', newEvent: '+ Nuevo evento', noActive: 'No hay eventos activos.', noPast: 'No hay eventos pasados.', players: 'jugadores', packs: 'paquetes', isActive: 'Activo', closed: 'Cerrado', eventName: 'Nombre del evento', eventDate: 'Fecha', p90: '×90', p60: '×60', p30: '×30', create: 'Crear', cancel: 'Cancelar', loginPrompt: 'Inicia sesión como administrador.' },
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', pack90Total: '3', pack60Total: '33', pack30Total: '140' });
  const [saving, setSaving] = useState(false);

  const t = (k: string) => T[lang]?.[k] || T['EN'][k] || k;

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored && LANGS.includes(stored)) setLang(stored);
    else {
      const br = navigator.language.split('-')[0].toUpperCase() as Lang;
      if (LANGS.includes(br)) setLang(br);
    }
    fetch('/api/kvk/events').then(r => r.json()).then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const handleAuthChange = useCallback((tok: string | null, _nick: string | null, admin: boolean) => {
    setToken(tok || '');
    setIsAdmin(admin);
  }, []);

  const createEvent = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const res = await fetch('/api/kvk/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: form.name, date: form.date, pack90Total: Number(form.pack90Total), pack60Total: Number(form.pack60Total), pack30Total: Number(form.pack30Total) }),
    });
    if (res.ok) {
      const ev = await res.json();
      setEvents(prev => [{ ...ev, _count: { players: 0 } }, ...prev]);
      setShowCreate(false);
      setForm({ name: '', date: '', pack90Total: '3', pack60Total: '33', pack30Total: '140' });
    }
    setSaving(false);
  };

  const activeEvents = events.filter(e => e.isActive);
  const pastEvents = events.filter(e => !e.isActive);

  const S = {
    page: { minHeight: '100vh', background: '#09090a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' } as React.CSSProperties,
    sectionLabel: { fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 6, marginLeft: 2 },
    card: (active: boolean) => ({ display: 'block', padding: '11px 14px', borderRadius: 12, marginBottom: 6, background: active ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)'}`, textDecoration: 'none', cursor: 'pointer' } as React.CSSProperties),
    input: { width: '100%', padding: '9px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const },
    btn: (primary: boolean) => ({ padding: '9px 14px', borderRadius: 9, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: primary ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,0.06)', color: '#fff' }),
  };

  const EventCard = ({ ev }: { ev: KvkEvent }) => (
    <Link href={`/kvk/${ev.id}`} style={S.card(ev.isActive)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{ev.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{ev.date} · {ev._count.players} {t('players')}</div>
        </div>
        <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 5, background: ev.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', color: ev.isActive ? '#4ade80' : 'rgba(255,255,255,0.3)', flexShrink: 0, whiteSpace: 'nowrap' }}>
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
          = {(ev.pack90Total + ev.pack60Total + ev.pack30Total)} {t('packs')}
        </span>
      </div>
    </Link>
  );

  return (
    <div style={S.page}>
      <KvkHeader
        lang={lang}
        onLang={l => { setLang(l); localStorage.setItem('lang', l); }}
        onAuthChange={handleAuthChange}
      />

      {/* TITLE */}
      <div style={{ padding: '14px 16px 10px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('title')}</h1>
      </div>

      {/* ADMIN: CREATE BUTTON */}
      {isAdmin && (
        <div style={{ padding: '0 16px 8px', maxWidth: 480, margin: '0 auto' }}>
          <button onClick={() => setShowCreate(s => !s)} style={{ ...S.btn(showCreate), width: '100%', fontSize: 13, padding: '9px 16px' }}>{t('newEvent')}</button>
        </div>
      )}

      {/* CREATE FORM */}
      {isAdmin && showCreate && (
        <div style={{ padding: '0 16px 12px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', padding: '14px 16px', borderRadius: 12, background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input style={S.input} placeholder={t('eventName')} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...S.input, flex: 2 }} placeholder={t('eventDate')} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                {[['pack90Total', '90', '#f87171'], ['pack60Total', '60', '#fbbf24'], ['pack30Total', '30', '#a78bfa']].map(([k, label, color]) => (
                  <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: color as string, textAlign: 'center' }}>×{label}</div>
                    <input style={{ ...S.input, textAlign: 'center', padding: '8px 4px' }} type="number" min="0" value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ ...S.btn(false), flex: 1, padding: '8px 12px', fontSize: 12 }} onClick={() => setShowCreate(false)}>{t('cancel')}</button>
                <button style={{ ...S.btn(true), flex: 2, padding: '8px 12px', fontSize: 12 }} onClick={createEvent} disabled={saving}>{saving ? '...' : t('create')}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVENTS */}
      <div style={{ padding: '4px 16px 40px', maxWidth: 560, margin: '0 auto' }}>
        {loading && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: '30px 0' }}>...</p>}

        {!loading && (
          <>
            {/* ACTIVE */}
            <div style={S.sectionLabel}>{t('active')} ({activeEvents.length})</div>
            {activeEvents.length === 0
              ? <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 24 }}>{t('noActive')}</p>
              : activeEvents.map(ev => <EventCard key={ev.id} ev={ev} />)
            }

            {/* PAST */}
            {pastEvents.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={S.sectionLabel}>{t('past')} ({pastEvents.length})</div>
                {pastEvents.map(ev => <EventCard key={ev.id} ev={ev} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
