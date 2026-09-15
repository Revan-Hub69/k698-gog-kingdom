'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// ─── Types ───────────────────────────────────────────────────────────────────
type Lang = 'EN' | 'IT' | 'PL' | 'ZH' | 'DE' | 'FR' | 'RU' | 'ES';

interface Submission {
  id: number;
  playerName: string;
  position: string;
  power: string;
  screenshots: string[];
  notes: string | null;
  createdAt: string;
}

// ─── Translations ─────────────────────────────────────────────────────────────
const T: Record<Lang, Record<string, string>> = {
  EN: {
    title: 'Upload Your Migration Power',
    subtitle: 'Submit your castle\'s historical power screenshot before the 698 migration',
    guideTitle: 'How to submit — step by step',
    step1Title: 'Go to the Migration section',
    step1Desc: 'Open Guns of Glory and navigate to the Migration section from the main menu.',
    step2Title: 'Search for Kingdom 698',
    step2Desc: 'In the migration search, look for kingdom 698 as your destination.',
    step3Title: 'Take a screenshot',
    step3Desc: 'Take a screenshot showing your position in the kingdom ranking and your castle power clearly visible. You can attach 1 or 2 screenshots.',
    uploadTitle: 'Submit your data',
    namePh: 'Your castle name',
    positionPh: 'Your position in the kingdom (e.g. 42)',
    powerPh: 'Your historical power (e.g. 850M)',
    notesPh: 'Notes (optional)',
    addScreenshot: 'Add screenshot',
    addMore: 'Add another screenshot',
    submit: 'Submit',
    submitting: 'Submitting…',
    successMsg: 'Submitted! Thank you.',
    errorMsg: 'Error submitting. Try again.',
    listTitle: 'Submissions',
    noSubmissions: 'No submissions yet.',
    details: 'View screenshots',
    hideDetails: 'Hide',
    position: 'Position',
    power: 'Power',
    submittedOn: 'Submitted',
    nameRequired: 'Castle name is required',
    posRequired: 'Position is required',
    powerRequired: 'Power is required',
    screenshotRequired: 'At least one screenshot is required',
    guideTab: 'Guide',
    uploadTab: 'Submit',
    listTab: 'Submissions',
    loading: 'Loading…',
  },
  IT: {
    title: 'Caricate il Potere Storico dei Vostri Castelli',
    subtitle: 'Inviate lo screenshot con il potere storico del vostro castello prima della migrazione verso il regno 698',
    guideTitle: 'Come inviare — passo per passo',
    step1Title: 'Vai alla sezione Migrazione',
    step1Desc: 'Apri Guns of Glory e vai alla sezione Migrazione dal menu principale.',
    step2Title: 'Cerca il regno 698',
    step2Desc: 'Nella ricerca migrazione, cerca il regno 698 come destinazione.',
    step3Title: 'Fai uno screenshot',
    step3Desc: 'Scatta uno screenshot che mostri chiaramente la tua posizione nella classifica e il potere del tuo castello. Puoi allegare 1 o 2 screenshot.',
    uploadTitle: 'Invia i tuoi dati',
    namePh: 'Nome del tuo castello',
    positionPh: 'La tua posizione nel regno (es. 42)',
    powerPh: 'Potere storico (es. 850M)',
    notesPh: 'Note (opzionale)',
    addScreenshot: 'Aggiungi screenshot',
    addMore: 'Aggiungi un altro screenshot',
    submit: 'Invia',
    submitting: 'Invio in corso…',
    successMsg: 'Inviato! Grazie.',
    errorMsg: 'Errore nell\'invio. Riprova.',
    listTitle: 'Invii',
    noSubmissions: 'Nessun invio ancora.',
    details: 'Vedi screenshot',
    hideDetails: 'Nascondi',
    position: 'Posizione',
    power: 'Potere',
    submittedOn: 'Inviato',
    nameRequired: 'Il nome del castello è obbligatorio',
    posRequired: 'La posizione è obbligatoria',
    powerRequired: 'Il potere è obbligatorio',
    screenshotRequired: 'Almeno uno screenshot è obbligatorio',
    guideTab: 'Guida',
    uploadTab: 'Invia',
    listTab: 'Invii',
    loading: 'Caricamento…',
  },
  PL: {
    title: 'Prześlij Moc Historyczną Swojego Zamku',
    subtitle: 'Prześlij zrzut ekranu z mocą historyczną zamku przed migracją do królestwa 698',
    guideTitle: 'Jak przesłać — krok po kroku',
    step1Title: 'Przejdź do sekcji Migracja',
    step1Desc: 'Otwórz Guns of Glory i przejdź do sekcji Migracja z menu głównego.',
    step2Title: 'Znajdź królestwo 698',
    step2Desc: 'W wyszukiwarce migracji znajdź królestwo 698 jako cel.',
    step3Title: 'Zrób zrzut ekranu',
    step3Desc: 'Zrób zrzut ekranu wyraźnie pokazujący Twoją pozycję w rankingu i moc zamku. Możesz dodać 1 lub 2 zrzuty.',
    uploadTitle: 'Prześlij swoje dane',
    namePh: 'Nazwa Twojego zamku',
    positionPh: 'Twoja pozycja w królestwie (np. 42)',
    powerPh: 'Moc historyczna (np. 850M)',
    notesPh: 'Notatki (opcjonalne)',
    addScreenshot: 'Dodaj zrzut ekranu',
    addMore: 'Dodaj kolejny zrzut',
    submit: 'Prześlij',
    submitting: 'Przesyłanie…',
    successMsg: 'Przesłano! Dziękujemy.',
    errorMsg: 'Błąd przesyłania. Spróbuj ponownie.',
    listTitle: 'Przesłane zgłoszenia',
    noSubmissions: 'Brak zgłoszeń.',
    details: 'Pokaż zrzuty',
    hideDetails: 'Ukryj',
    position: 'Pozycja',
    power: 'Moc',
    submittedOn: 'Przesłano',
    nameRequired: 'Nazwa zamku jest wymagana',
    posRequired: 'Pozycja jest wymagana',
    powerRequired: 'Moc jest wymagana',
    screenshotRequired: 'Wymagany co najmniej jeden zrzut ekranu',
    guideTab: 'Przewodnik',
    uploadTab: 'Prześlij',
    listTab: 'Zgłoszenia',
    loading: 'Ładowanie…',
  },
  ZH: {
    title: '上传你的城堡历史战力',
    subtitle: '在迁移到698王国前，提交你城堡历史战力的截图',
    guideTitle: '如何提交 — 分步说明',
    step1Title: '进入迁移区域',
    step1Desc: '打开 Guns of Glory，从主菜单进入迁移区域。',
    step2Title: '搜索698王国',
    step2Desc: '在迁移搜索中，查找698王国作为目的地。',
    step3Title: '截图',
    step3Desc: '截取一张清晰显示你在排名中的位置和城堡战力的截图。可以附上1或2张截图。',
    uploadTitle: '提交你的数据',
    namePh: '你的城堡名称',
    positionPh: '你在王国中的排名（如 42）',
    powerPh: '历史战力（如 850M）',
    notesPh: '备注（可选）',
    addScreenshot: '添加截图',
    addMore: '再添加一张',
    submit: '提交',
    submitting: '提交中…',
    successMsg: '提交成功！谢谢。',
    errorMsg: '提交出错，请重试。',
    listTitle: '提交记录',
    noSubmissions: '暂无提交。',
    details: '查看截图',
    hideDetails: '隐藏',
    position: '排名',
    power: '战力',
    submittedOn: '提交时间',
    nameRequired: '城堡名称为必填项',
    posRequired: '排名为必填项',
    powerRequired: '战力为必填项',
    screenshotRequired: '至少需要一张截图',
    guideTab: '指南',
    uploadTab: '提交',
    listTab: '记录',
    loading: '加载中…',
  },
  DE: {
    title: 'Ladet Eure Historische Macht Hoch',
    subtitle: 'Sendet einen Screenshot eurer historischen Burgmacht vor der Migration zu Königreich 698',
    guideTitle: 'So sendet ihr — Schritt für Schritt',
    step1Title: 'Gehe zum Migrations-Bereich',
    step1Desc: 'Öffne Guns of Glory und navigiere über das Hauptmenü zum Migrations-Bereich.',
    step2Title: 'Suche nach Königreich 698',
    step2Desc: 'Suche in der Migrationssuche nach Königreich 698 als Ziel.',
    step3Title: 'Mache einen Screenshot',
    step3Desc: 'Mache einen Screenshot, der deine Position in der Rangliste und deine Burgmacht deutlich zeigt. Du kannst 1 oder 2 Screenshots anhängen.',
    uploadTitle: 'Sende deine Daten',
    namePh: 'Name deiner Burg',
    positionPh: 'Deine Position im Königreich (z.B. 42)',
    powerPh: 'Historische Macht (z.B. 850M)',
    notesPh: 'Notizen (optional)',
    addScreenshot: 'Screenshot hinzufügen',
    addMore: 'Weiteren Screenshot hinzufügen',
    submit: 'Senden',
    submitting: 'Wird gesendet…',
    successMsg: 'Gesendet! Danke.',
    errorMsg: 'Fehler beim Senden. Erneut versuchen.',
    listTitle: 'Einsendungen',
    noSubmissions: 'Noch keine Einsendungen.',
    details: 'Screenshots ansehen',
    hideDetails: 'Verbergen',
    position: 'Position',
    power: 'Macht',
    submittedOn: 'Gesendet',
    nameRequired: 'Burgname ist erforderlich',
    posRequired: 'Position ist erforderlich',
    powerRequired: 'Macht ist erforderlich',
    screenshotRequired: 'Mindestens ein Screenshot ist erforderlich',
    guideTab: 'Anleitung',
    uploadTab: 'Senden',
    listTab: 'Einsendungen',
    loading: 'Laden…',
  },
  FR: {
    title: 'Chargez la Puissance Historique de Votre Château',
    subtitle: 'Envoyez une capture d\'écran de la puissance historique de votre château avant la migration vers le royaume 698',
    guideTitle: 'Comment soumettre — étape par étape',
    step1Title: 'Allez à la section Migration',
    step1Desc: 'Ouvrez Guns of Glory et accédez à la section Migration depuis le menu principal.',
    step2Title: 'Recherchez le royaume 698',
    step2Desc: 'Dans la recherche de migration, cherchez le royaume 698 comme destination.',
    step3Title: 'Prenez une capture d\'écran',
    step3Desc: 'Prenez une capture d\'écran montrant clairement votre position dans le classement et la puissance de votre château. Vous pouvez joindre 1 ou 2 captures.',
    uploadTitle: 'Envoyez vos données',
    namePh: 'Nom de votre château',
    positionPh: 'Votre position dans le royaume (ex. 42)',
    powerPh: 'Puissance historique (ex. 850M)',
    notesPh: 'Notes (optionnel)',
    addScreenshot: 'Ajouter une capture',
    addMore: 'Ajouter une autre capture',
    submit: 'Envoyer',
    submitting: 'Envoi en cours…',
    successMsg: 'Envoyé ! Merci.',
    errorMsg: 'Erreur d\'envoi. Réessayez.',
    listTitle: 'Envois',
    noSubmissions: 'Aucun envoi pour l\'instant.',
    details: 'Voir les captures',
    hideDetails: 'Masquer',
    position: 'Position',
    power: 'Puissance',
    submittedOn: 'Envoyé le',
    nameRequired: 'Le nom du château est requis',
    posRequired: 'La position est requise',
    powerRequired: 'La puissance est requise',
    screenshotRequired: 'Au moins une capture est requise',
    guideTab: 'Guide',
    uploadTab: 'Envoyer',
    listTab: 'Envois',
    loading: 'Chargement…',
  },
  RU: {
    title: 'Загрузите Историческую Мощь Вашего Замка',
    subtitle: 'Отправьте скриншот исторической мощи замка до миграции в королевство 698',
    guideTitle: 'Как отправить — шаг за шагом',
    step1Title: 'Перейдите в раздел Миграция',
    step1Desc: 'Откройте Guns of Glory и перейдите в раздел Миграция из главного меню.',
    step2Title: 'Найдите королевство 698',
    step2Desc: 'В поиске миграции найдите королевство 698 в качестве места назначения.',
    step3Title: 'Сделайте скриншот',
    step3Desc: 'Сделайте скриншот, на котором чётко видны ваша позиция в рейтинге и мощь замка. Можно приложить 1 или 2 скриншота.',
    uploadTitle: 'Отправьте свои данные',
    namePh: 'Название вашего замка',
    positionPh: 'Ваша позиция в королевстве (напр. 42)',
    powerPh: 'Историческая мощь (напр. 850M)',
    notesPh: 'Заметки (необязательно)',
    addScreenshot: 'Добавить скриншот',
    addMore: 'Добавить ещё скриншот',
    submit: 'Отправить',
    submitting: 'Отправка…',
    successMsg: 'Отправлено! Спасибо.',
    errorMsg: 'Ошибка при отправке. Попробуйте ещё раз.',
    listTitle: 'Отправленные',
    noSubmissions: 'Пока нет отправленных.',
    details: 'Смотреть скриншоты',
    hideDetails: 'Скрыть',
    position: 'Позиция',
    power: 'Мощь',
    submittedOn: 'Отправлено',
    nameRequired: 'Название замка обязательно',
    posRequired: 'Позиция обязательна',
    powerRequired: 'Мощь обязательна',
    screenshotRequired: 'Необходим хотя бы один скриншот',
    guideTab: 'Гид',
    uploadTab: 'Отправить',
    listTab: 'Отправленные',
    loading: 'Загрузка…',
  },
  ES: {
    title: 'Sube el Poder Histórico de tu Castillo',
    subtitle: 'Envía una captura de pantalla del poder histórico de tu castillo antes de la migración al reino 698',
    guideTitle: 'Cómo enviar — paso a paso',
    step1Title: 'Ve a la sección Migración',
    step1Desc: 'Abre Guns of Glory y navega a la sección Migración desde el menú principal.',
    step2Title: 'Busca el reino 698',
    step2Desc: 'En la búsqueda de migración, busca el reino 698 como destino.',
    step3Title: 'Haz una captura de pantalla',
    step3Desc: 'Haz una captura de pantalla que muestre claramente tu posición en el ranking y el poder de tu castillo. Puedes adjuntar 1 o 2 capturas.',
    uploadTitle: 'Envía tus datos',
    namePh: 'Nombre de tu castillo',
    positionPh: 'Tu posición en el reino (ej. 42)',
    powerPh: 'Poder histórico (ej. 850M)',
    notesPh: 'Notas (opcional)',
    addScreenshot: 'Añadir captura',
    addMore: 'Añadir otra captura',
    submit: 'Enviar',
    submitting: 'Enviando…',
    successMsg: '¡Enviado! Gracias.',
    errorMsg: 'Error al enviar. Inténtalo de nuevo.',
    listTitle: 'Envíos',
    noSubmissions: 'Aún no hay envíos.',
    details: 'Ver capturas',
    hideDetails: 'Ocultar',
    position: 'Posición',
    power: 'Poder',
    submittedOn: 'Enviado',
    nameRequired: 'El nombre del castillo es obligatorio',
    posRequired: 'La posición es obligatoria',
    powerRequired: 'El poder es obligatorio',
    screenshotRequired: 'Se requiere al menos una captura',
    guideTab: 'Guía',
    uploadTab: 'Enviar',
    listTab: 'Envíos',
    loading: 'Cargando…',
  },
};

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0f0c1a',
  surface: 'rgba(255,255,255,0.04)',
  surfaceHover: 'rgba(255,255,255,0.07)',
  border: 'rgba(124,58,237,0.2)',
  borderStrong: 'rgba(124,58,237,0.5)',
  purple: '#7c3aed',
  purpleLight: '#a78bfa',
  blue: '#3b82f6',
  text: '#f1f5f9',
  muted: '#94a3b8',
  faint: 'rgba(255,255,255,0.15)',
  green: '#4ade80',
  red: '#f87171',
  amber: '#fbbf24',
};

const LANGS: Lang[] = ['EN', 'IT', 'PL', 'ZH', 'DE', 'FR', 'RU', 'ES'];
type Tab = 'guide' | 'upload' | 'list';

// ─── Step guide image ────────────────────────────────────────────────────────
// Shows the real screenshot if available in /public/images/migration-stepN.png
// otherwise shows a numbered placeholder
function StepImage({ n }: { n: number }) {
  const [hasImg, setHasImg] = useState(true);
  const src = `/images/migration-step${n}.png`;
  return (
    <div style={{
      width: '100%', aspectRatio: '16/9',
      background: 'rgba(124,58,237,0.08)',
      border: `1px solid ${C.border}`,
      borderRadius: 12, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, position: 'relative',
    }}>
      {hasImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`step ${n}`}
          onError={() => setHasImg(false)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <span style={{
          fontSize: 48, fontWeight: 900,
          background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          opacity: 0.4,
        }}>{n}</span>
      )}
    </div>
  );
}

export default function MigazionePage() {
  const [lang, setLang] = useState<Lang>('IT');
  const [langOpen, setLangOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('guide');

  // Form state
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [power, setPower] = useState('');
  const [notes, setNotes] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // List state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);

  const t = (k: string) => T[lang]?.[k] ?? T.EN[k] ?? k;

  // Auto-detect language
  useEffect(() => {
    const bl = navigator.language.split('-')[0].toUpperCase() as Lang;
    if (LANGS.includes(bl)) setLang(bl);
  }, []);

  // Load submissions when list tab is opened
  useEffect(() => {
    if (tab === 'list') loadSubmissions();
  }, [tab]);

  async function loadSubmissions() {
    setLoadingList(true);
    try {
      const r = await fetch('/api/migration');
      const data = await r.json();
      if (Array.isArray(data)) setSubmissions(data);
    } catch {
      // silently fail
    } finally {
      setLoadingList(false);
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target?.result as string;
      setScreenshots(prev => {
        const next = [...prev];
        next[idx] = b64;
        return next;
      });
      setFormErrors(prev => ({ ...prev, screenshots: '' }));
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t('nameRequired');
    if (!position.trim()) errs.position = t('posRequired');
    if (!power.trim()) errs.power = t('powerRequired');
    if (screenshots.filter(Boolean).length === 0) errs.screenshots = t('screenshotRequired');
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const r = await fetch('/api/migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: name,
          position,
          power,
          screenshots: screenshots.filter(Boolean),
          notes: notes || null,
        }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || 'Unknown error');
      }
      setSuccessMsg(t('successMsg'));
      setName(''); setPosition(''); setPower(''); setNotes('');
      setScreenshots([]);
      if (fileRef1.current) fileRef1.current.value = '';
      if (fileRef2.current) fileRef2.current.value = '';
    } catch (err: unknown) {
      setErrorMsg(t('errorMsg') + (err instanceof Error ? ` (${err.message})` : ''));
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Styles ─────────────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.text, fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: C.muted,
    textTransform: 'uppercase', letterSpacing: '0.05em',
    marginBottom: 4, display: 'block',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: 11, color: C.red, marginTop: 3,
  };

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px 8px',
    borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700,
    fontSize: 13, transition: 'all 0.2s',
    background: active
      ? 'linear-gradient(135deg, #7c3aed, #3b82f6)'
      : 'rgba(255,255,255,0.05)',
    color: active ? '#fff' : C.muted,
    boxShadow: active ? '0 2px 12px rgba(124,58,237,0.4)' : 'none',
  });

  const stepNumStyle: React.CSSProperties = {
    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 900, fontSize: 18, color: '#fff',
    boxShadow: '0 2px 10px rgba(124,58,237,0.5)',
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f0c1a 0%, #0a0714 60%, #0f0c1a 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: C.text,
    }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 9999,
        background: 'rgba(15,12,26,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontWeight: 900, fontSize: 20,
            background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>k698</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 700, fontSize: 13, color: C.purpleLight, letterSpacing: '0.08em' }}>
            MIGRAZIONE
          </span>
        </div>
        {/* Language picker */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setLangOpen(!langOpen)} style={{
            width: 40, height: 40, borderRadius: 8,
            border: `1px solid ${C.borderStrong}`,
            background: 'rgba(124,58,237,0.1)',
            color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer',
          }}>{lang}</button>
          {langOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              background: 'rgba(15,10,30,0.97)',
              border: `1px solid ${C.border}`,
              borderRadius: 10, overflow: 'hidden', zIndex: 100, minWidth: 80,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}>
              {LANGS.map((l, i) => (
                <button key={l} onClick={() => { setLang(l); setLangOpen(false); }} style={{
                  width: '100%', padding: '8px 16px', border: 'none', cursor: 'pointer',
                  background: l === lang ? 'rgba(124,58,237,0.2)' : 'transparent',
                  color: l === lang ? '#fff' : C.muted,
                  fontWeight: 700, fontSize: 13, textAlign: 'center',
                  borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                }}>{l}</button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px 64px' }}>

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '48px 0 32px', position: 'relative' }}>
          {/* glow decoration */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400, height: 120, background: 'rgba(124,58,237,0.12)',
            borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
          }} />
          <h1 style={{ position: 'relative', zIndex: 1,
            fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 900,
            lineHeight: 1.2, marginBottom: 12,
            background: 'linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #60a5fa 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>{t('title')}</h1>
          <p style={{ position: 'relative', zIndex: 1, fontSize: 14, color: C.muted, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            {t('subtitle')}
          </p>
          <div style={{ marginTop: 20, height: 2, width: 80, background: 'linear-gradient(90deg, #7c3aed, #3b82f6)', borderRadius: 2, margin: '20px auto 0' }} />
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: 8, padding: '0 0 24px',
          position: 'sticky', top: 65, zIndex: 10,
          background: 'rgba(15,12,26,0.9)', backdropFilter: 'blur(8px)',
          paddingTop: 12,
        }}>
          <button style={tabBtnStyle(tab === 'guide')} onClick={() => setTab('guide')}>{t('guideTab')}</button>
          <button style={tabBtnStyle(tab === 'upload')} onClick={() => setTab('upload')}>{t('uploadTab')}</button>
          <button style={tabBtnStyle(tab === 'list')} onClick={() => setTab('list')}>{t('listTab')}</button>
        </div>

        {/* ── GUIDE TAB ──────────────────────────────────────────────────────── */}
        {tab === 'guide' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.purpleLight, marginBottom: 24 }}>
              {t('guideTitle')}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[1, 2, 3].map(n => (
                <div key={n} style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 14, overflow: 'hidden',
                }}>
                  {/* Step header */}
                  <div style={{
                    padding: '16px 20px',
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    background: 'rgba(124,58,237,0.06)',
                    borderBottom: `1px solid ${C.border}`,
                  }}>
                    <div style={stepNumStyle}>{n}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 4 }}>
                        {t(`step${n}Title`)}
                      </div>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                        {t(`step${n}Desc`)}
                      </div>
                    </div>
                  </div>
                  {/* Step image placeholder */}
                  <div style={{ padding: '16px 20px' }}>
                    <StepImage n={n} />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA to upload */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button onClick={() => setTab('upload')} style={{
                padding: '14px 40px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                color: '#fff', fontWeight: 800, fontSize: 15,
                boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
                transition: 'transform 0.15s',
              }}>
                {t('uploadTab')} →
              </button>
            </div>
          </div>
        )}

        {/* ── UPLOAD TAB ─────────────────────────────────────────────────────── */}
        {tab === 'upload' && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.purpleLight, marginBottom: 24 }}>
              {t('uploadTitle')}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Name */}
              <div>
                <label style={labelStyle}>{t('namePh')}</label>
                <input
                  value={name} onChange={e => { setName(e.target.value); setFormErrors(p => ({ ...p, name: '' })); }}
                  placeholder={t('namePh')} style={{ ...inputStyle, borderColor: formErrors.name ? C.red : undefined }}
                />
                {formErrors.name && <p style={errorStyle}>{formErrors.name}</p>}
              </div>

              {/* Position */}
              <div>
                <label style={labelStyle}>{t('position')}</label>
                <input
                  value={position} onChange={e => { setPosition(e.target.value); setFormErrors(p => ({ ...p, position: '' })); }}
                  placeholder={t('positionPh')} style={{ ...inputStyle, borderColor: formErrors.position ? C.red : undefined }}
                />
                {formErrors.position && <p style={errorStyle}>{formErrors.position}</p>}
              </div>

              {/* Power */}
              <div>
                <label style={labelStyle}>{t('power')}</label>
                <input
                  value={power} onChange={e => { setPower(e.target.value); setFormErrors(p => ({ ...p, power: '' })); }}
                  placeholder={t('powerPh')} style={{ ...inputStyle, borderColor: formErrors.power ? C.red : undefined }}
                />
                {formErrors.power && <p style={errorStyle}>{formErrors.power}</p>}
              </div>

              {/* Screenshots */}
              <div>
                <label style={labelStyle}>{t('addScreenshot')}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Screenshot 1 */}
                  <label style={{
                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                    padding: '12px 14px',
                    background: screenshots[0] ? 'rgba(74,222,128,0.05)' : C.surface,
                    border: `1px dashed ${screenshots[0] ? C.green : (formErrors.screenshots ? C.red : C.border)}`,
                    borderRadius: 8,
                  }}>
                    <input ref={fileRef1} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e, 0)} />
                    <span style={{ fontSize: 20 }}>{screenshots[0] ? '✅' : '📷'}</span>
                    <span style={{ fontSize: 13, color: screenshots[0] ? C.green : C.muted }}>
                      {screenshots[0] ? 'Screenshot 1 ✓' : `Screenshot 1 — ${t('addScreenshot')}`}
                    </span>
                    {screenshots[0] && (
                      <img src={screenshots[0]} alt="s1" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, marginLeft: 'auto' }} />
                    )}
                  </label>

                  {/* Screenshot 2 — only show if first is added */}
                  {screenshots[0] && (
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                      padding: '12px 14px',
                      background: screenshots[1] ? 'rgba(74,222,128,0.05)' : C.surface,
                      border: `1px dashed ${screenshots[1] ? C.green : C.border}`,
                      borderRadius: 8,
                    }}>
                      <input ref={fileRef2} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e, 1)} />
                      <span style={{ fontSize: 20 }}>{screenshots[1] ? '✅' : '📷'}</span>
                      <span style={{ fontSize: 13, color: screenshots[1] ? C.green : C.muted }}>
                        {screenshots[1] ? 'Screenshot 2 ✓' : `Screenshot 2 — ${t('addMore')}`}
                      </span>
                      {screenshots[1] && (
                        <img src={screenshots[1]} alt="s2" style={{ width: 48, height: 32, objectFit: 'cover', borderRadius: 4, marginLeft: 'auto' }} />
                      )}
                    </label>
                  )}
                </div>
                {formErrors.screenshots && <p style={errorStyle}>{formErrors.screenshots}</p>}
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>{t('notesPh')}</label>
                <textarea
                  value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder={t('notesPh')}
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Submit btn */}
              <button type="submit" disabled={submitting} style={{
                padding: '13px 0', borderRadius: 10, border: 'none', cursor: submitting ? 'wait' : 'pointer',
                background: submitting ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                color: '#fff', fontWeight: 800, fontSize: 15,
                boxShadow: submitting ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
              }}>
                {submitting ? t('submitting') : t('submit')}
              </button>

              {/* Success/Error banners */}
              {successMsg && (
                <div style={{
                  padding: '12px 16px', borderRadius: 8,
                  background: 'rgba(74,222,128,0.1)', border: `1px solid rgba(74,222,128,0.4)`,
                  color: C.green, fontWeight: 700, fontSize: 14, textAlign: 'center',
                }}>
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div style={{
                  padding: '12px 16px', borderRadius: 8,
                  background: 'rgba(248,113,113,0.1)', border: `1px solid rgba(248,113,113,0.4)`,
                  color: C.red, fontWeight: 700, fontSize: 13, textAlign: 'center',
                }}>
                  {errorMsg}
                </div>
              )}
            </form>
          </div>
        )}

        {/* ── LIST TAB ───────────────────────────────────────────────────────── */}
        {tab === 'list' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.purpleLight, margin: 0 }}>
                {t('listTitle')} {!loadingList && `(${submissions.length})`}
              </h2>
              <button onClick={loadSubmissions} style={{
                padding: '6px 14px', borderRadius: 6, border: `1px solid ${C.border}`,
                background: C.surface, color: C.muted, cursor: 'pointer', fontSize: 12, fontWeight: 700,
              }}>↺</button>
            </div>

            {loadingList ? (
              <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>{t('loading')}</p>
            ) : submissions.length === 0 ? (
              <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>{t('noSubmissions')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {submissions.map(s => (
                  <div key={s.id} style={{
                    background: C.surface,
                    border: `1px solid ${expanded === s.id ? C.borderStrong : C.border}`,
                    borderRadius: 10, overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}>
                    {/* Row */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', cursor: 'pointer',
                    }} onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                      {/* Avatar letter */}
                      <div style={{
                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                        background: 'linear-gradient(135deg, #7c3aed44, #3b82f644)',
                        border: `1px solid ${C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 900, fontSize: 14, color: C.purpleLight,
                      }}>
                        {s.playerName[0]?.toUpperCase() ?? '?'}
                      </div>
                      {/* Name */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.playerName}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                          {new Date(s.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {/* Position badge */}
                      <div style={{
                        padding: '3px 8px', borderRadius: 6,
                        background: 'rgba(124,58,237,0.15)', border: `1px solid rgba(124,58,237,0.3)`,
                        fontSize: 12, fontWeight: 700, color: C.purpleLight, flexShrink: 0,
                      }}>
                        #{s.position}
                      </div>
                      {/* Power badge */}
                      <div style={{
                        padding: '3px 8px', borderRadius: 6,
                        background: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.3)`,
                        fontSize: 12, fontWeight: 700, color: C.amber, flexShrink: 0,
                      }}>
                        {s.power}
                      </div>
                      {/* Expand chevron */}
                      <span style={{ color: C.muted, fontSize: 12, transition: 'transform 0.2s', transform: expanded === s.id ? 'rotate(180deg)' : 'none' }}>
                        ▼
                      </span>
                    </div>

                    {/* Accordion — screenshots */}
                    {expanded === s.id && (
                      <div style={{
                        padding: '4px 16px 16px',
                        borderTop: `1px solid ${C.border}`,
                      }}>
                        {s.notes && (
                          <p style={{ fontSize: 13, color: C.muted, marginBottom: 12, fontStyle: 'italic' }}>{s.notes}</p>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {s.screenshots.map((src, i) => (
                            <a key={i} href={src} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                              <img
                                src={src}
                                alt={`screenshot ${i + 1}`}
                                style={{
                                  maxWidth: 280, maxHeight: 180,
                                  objectFit: 'contain',
                                  borderRadius: 8,
                                  border: `1px solid ${C.border}`,
                                  cursor: 'zoom-in',
                                }}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '20px 16px',
        borderTop: `1px solid ${C.border}`,
        color: C.faint, fontSize: 12,
      }}>
        © {new Date().getFullYear()} k698 · Guns of Glory
      </footer>
    </div>
  );
}
