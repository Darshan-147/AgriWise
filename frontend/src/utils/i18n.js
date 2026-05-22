import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language resources
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import guTranslations from './locales/gu.json';
import taTranslations from './locales/ta.json';
import teTranslations from './locales/te.json';
import paTranslations from './locales/pa.json';
import maTranslations from './locales/ma.json';
// Resources object containing all translations
const resources = {
  en: {
    translation: enTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
  gu: {
    translation: guTranslations,
  },
  ta: {
    translation: taTranslations,
  },
  te: {
    translation: teTranslations,
  },
  pa: {
    translation: paTranslations,
  },
  ma: {
    translation: maTranslations,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // not needed for React as it escapes by default
    },

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
