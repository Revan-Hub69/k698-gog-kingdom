import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import it from '@/locales/it.json';
import pl from '@/locales/pl.json';
import zh from '@/locales/zh.json';
import de from '@/locales/de.json';
import fr from '@/locales/fr.json';
import ru from '@/locales/ru.json';
import g from '@/locales/g.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: en },
      it: { translation: it },
      pl: { translation: pl },
      zh: { translation: zh },
      de: { translation: de },
      fr: { translation: fr },
      ru: { translation: ru },
      g: { translation: g },
    },
  });

export default i18n;
