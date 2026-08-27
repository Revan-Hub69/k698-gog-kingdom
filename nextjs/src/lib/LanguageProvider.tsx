'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'EN' | 'IT' | 'PL' | 'ZH' | 'DE' | 'FR' | 'RU' | 'ES';

const translations: Record<Language, Record<string, string>> = {
  EN: {
    headerBranding: 'Ben Fatto! Siamo in regione campioni!!',
    headerSubtitle: 'Master your kingdom\'s equipment strategy during events. Spiritual power management through Guard Weapons, Curiosities, and Coats of Arms.',
    spiritualPowerTitle: 'Spiritual Power Management',
    spiritualPowerDesc: 'Learn how to manage your kingdom\'s spiritual power during events',
    guardWeapons: 'Guard Weapons',
    curiosities: 'Curiosities',
    coatsOfArms: 'Coats of Arms',
    newBadge: 'New',
    eventsTitle: 'Come Fare Durante gli Eventi',
    eventsDesc: 'Equipment management strategies for keeping spiritual power low',
  },
  IT: {
    headerBranding: 'Ben Fatto! Siamo in regione campioni!!',
    headerSubtitle: 'Gestisci la strategia degli equipaggiamenti del tuo regno durante gli eventi. Gestione del potere spirituale attraverso Armi della Guardia, Curiosità e Stemmi.',
    spiritualPowerTitle: 'Gestione del Potere Spirituale',
    spiritualPowerDesc: 'Impara come gestire il potere spirituale del tuo regno durante gli eventi',
    guardWeapons: 'Armi della Guardia',
    curiosities: 'Curiosità',
    coatsOfArms: 'Stemmi',
    newBadge: 'Novità',
    eventsTitle: 'Come Fare Durante gli Eventi',
    eventsDesc: 'Strategie di gestione degli equipaggiamenti per mantenere basso il potere spirituale',
  },
  PL: {
    headerBranding: 'Ben Fatto! Siamo in regione campioni!!',
    headerSubtitle: 'Opanuj strategię uzbrojenia swojego królestwa podczas wydarzeń. Zarządzanie mocą duchową za pośrednictwem Broni Gwardii, Osobliwości i Herbarzy.',
    spiritualPowerTitle: 'Zarządzanie Mocą Duchową',
    spiritualPowerDesc: 'Dowiedz się, jak zarządzać mocą duchową swojego królestwa podczas wydarzeń',
    guardWeapons: 'Broń Gwardii',
    curiosities: 'Osobliwości',
    coatsOfArms: 'Herbarze',
    newBadge: 'Nowe',
    eventsTitle: 'Co Robić Podczas Wydarzeń',
    eventsDesc: 'Strategie zarządzania uzbrojeniem aby utrzymać niską moc duchową',
  },
  ZH: {
    headerBranding: 'Ben Fatto! Siamo in regione campioni!!',
    headerSubtitle: '在事件期间掌握您的王国装备策略。通过护卫武器、奇特物品和纹章管理精神力。',
    spiritualPowerTitle: '精神力管理',
    spiritualPowerDesc: '学习如何在事件期间管理您的王国精神力',
    guardWeapons: '护卫武器',
    curiosities: '奇特物品',
    coatsOfArms: '纹章',
    newBadge: '新',
    eventsTitle: '事件期间的操作方法',
    eventsDesc: '装备管理策略以保持精神力低',
  },
  DE: {
    headerBranding: 'Ben Fatto! Siamo in regione campioni!!',
    headerSubtitle: 'Beherrsche die Ausrüstungsstrategie deines Königreichs während Events. Verwaltung der spirituellen Kraft durch Wachausrüstung, Kuriositäten und Wappen.',
    spiritualPowerTitle: 'Verwaltung der Spirituellen Kraft',
    spiritualPowerDesc: 'Lerne, wie du die spirituelle Kraft deines Königreichs während Events verwaltest',
    guardWeapons: 'Wachausrüstung',
    curiosities: 'Kuriositäten',
    coatsOfArms: 'Wappen',
    newBadge: 'Neu',
    eventsTitle: 'Was Man Während Events Tun Sollte',
    eventsDesc: 'Ausrüstungsverwaltungsstrategien um die spirituelle Kraft niedrig zu halten',
  },
  FR: {
    headerBranding: 'Ben Fatto! Siamo in regione campioni!!',
    headerSubtitle: 'Maîtrisez la stratégie d\'équipement de votre royaume pendant les événements. Gestion du pouvoir spirituel par les armes de la garde, les curiosités et les blasons.',
    spiritualPowerTitle: 'Gestion du Pouvoir Spirituel',
    spiritualPowerDesc: 'Apprenez à gérer le pouvoir spirituel de votre royaume pendant les événements',
    guardWeapons: 'Armes de la Garde',
    curiosities: 'Curiosités',
    coatsOfArms: 'Blasons',
    newBadge: 'Nouveau',
    eventsTitle: 'Comment Faire Pendant les Événements',
    eventsDesc: 'Stratégies de gestion des équipements pour maintenir le pouvoir spirituel bas',
  },
  RU: {
    headerBranding: 'Ben Fatto! Siamo in regione campioni!!',
    headerSubtitle: 'Овладейте стратегией вооружения вашего королевства во время событий. Управление духовной силой через оружие охраны, редкости и гербы.',
    spiritualPowerTitle: 'Управление Духовной Силой',
    spiritualPowerDesc: 'Узнайте, как управлять духовной силой вашего королевства во время событий',
    guardWeapons: 'Оружие Охраны',
    curiosities: 'Редкости',
    coatsOfArms: 'Гербы',
    newBadge: 'Новое',
    eventsTitle: 'Что Делать Во Время Событий',
    eventsDesc: 'Стратегии управления оружием для поддержания низкой духовной силы',
  },
  ES: {
    headerBranding: 'Ben Fatto! Siamo in regione campioni!!',
    headerSubtitle: 'Domina la estrategia de equipo de tu reino durante los eventos. Gestión del poder espiritual a través de armas de la guardia, curiosidades y escudos de armas.',
    spiritualPowerTitle: 'Gestión del Poder Espiritual',
    spiritualPowerDesc: 'Aprende cómo gestionar el poder espiritual de tu reino durante los eventos',
    guardWeapons: 'Armas de la Guardia',
    curiosities: 'Curiosidades',
    coatsOfArms: 'Escudos de Armas',
    newBadge: 'Nuevo',
    eventsTitle: 'Qué Hacer Durante los Eventos',
    eventsDesc: 'Estrategias de gestión de equipos para mantener bajo el poder espiritual',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
