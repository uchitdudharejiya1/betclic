import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18n, {type Language} from '../Translation';

const STORAGE_KEY = '@betclic/language';

export type LanguageContextValue = {
  currentLanguage: Language;
  changeLanguage: (language: Language) => void;
};

export const LanguageContext = createContext<LanguageContextValue>({
  currentLanguage: 'fr',
  changeLanguage: () => {},
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(stored => {
      if (stored && ['fr', 'en', 'pl'].includes(stored as Language)) {
        const language = stored as Language;
        setCurrentLanguage(language);
        i18n.changeLanguage(language);
      }
    });
  }, []);

  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    AsyncStorage.setItem(STORAGE_KEY, language).catch(() => {});
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      currentLanguage,
      changeLanguage,
    }),
    [currentLanguage, changeLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
