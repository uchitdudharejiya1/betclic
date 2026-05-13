import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import en from './en.json';
import fr from './fr.json';

export const SUPPORTED_LANGUAGES = ['fr', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

i18n.use(initReactI18next).init({
  resources: {
    fr: {translation: fr},
    en: {translation: en},
  },
  lng: 'fr',
  fallbackLng: 'en',
  interpolation: {escapeValue: false},
  compatibilityJSON: 'v4',
});

export default i18n;
