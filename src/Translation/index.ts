import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import fr from './fr.json';
import pl from './pl.json';

export const SUPPORTED_LANGUAGES = ['fr', 'pl'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

i18n.use(initReactI18next).init({
  resources: {
    fr: {translation: fr},
    pl: {translation: pl},
  },
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: {escapeValue: false},
  compatibilityJSON: 'v4',
});

export default i18n;
