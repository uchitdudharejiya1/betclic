import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18n, {type Language} from '../Translation';

const STORAGE_KEY = '@betclic/language';
const FIRST_OPEN_KEY = '@betclic/first_open';

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
    const initializeLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        const isFirstOpen = await AsyncStorage.getItem(FIRST_OPEN_KEY);

        if (storedLanguage && ['fr', 'pl'].includes(storedLanguage as Language)) {
          // User has manually selected language before, use it
          const language = storedLanguage as Language;
          setCurrentLanguage(language);
          i18n.changeLanguage(language);
        } else if (!isFirstOpen) {
          // First app open, detect country and set language accordingly
          const country = RNLocalize.getCountry();
          const detectedLanguage = country === 'PL' ? 'pl' : 'fr';
          
          setCurrentLanguage(detectedLanguage);
          i18n.changeLanguage(detectedLanguage);
          await AsyncStorage.setItem(STORAGE_KEY, detectedLanguage);
          await AsyncStorage.setItem(FIRST_OPEN_KEY, 'true');
        } else {
          // Not first open but no stored language (shouldn't happen but fallback to French)
          setCurrentLanguage('fr');
          i18n.changeLanguage('fr');
        }
      } catch (error) {
        console.error('Error initializing language:', error);
        // Fallback to French
        setCurrentLanguage('fr');
        i18n.changeLanguage('fr');
      }
    };

    initializeLanguage();
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
