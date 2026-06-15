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
import type { CountryCode } from '../services/redirectService';

const STORAGE_KEY = '@betclic/country';
const FIRST_OPEN_KEY = '@betclic/country_first_open';

export type CountryContextValue = {
  currentCountry: CountryCode;
  changeCountry: (country: CountryCode) => void;
};

export const CountryContext = createContext<CountryContextValue>({
  currentCountry: 'CI',
  changeCountry: () => {},
});

export const CountryProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [currentCountry, setCurrentCountry] = useState<CountryCode>('CI');

  useEffect(() => {
    const initializeCountry = async () => {
      try {
        const storedCountry = await AsyncStorage.getItem(STORAGE_KEY);
        const isFirstOpen = await AsyncStorage.getItem(FIRST_OPEN_KEY);

        if (storedCountry && ['CI', 'CM', 'PL'].includes(storedCountry as CountryCode)) {
          // User has manually selected country before, use it
          const country = storedCountry as CountryCode;
          setCurrentCountry(country);
          console.log(`🌍 Country loaded from storage: ${country}`);
        } else if (!isFirstOpen) {
          // First app open, detect country from device locale
          const deviceCountry = RNLocalize.getCountry();
          const detectedCountry: CountryCode = 
            deviceCountry === 'PL' ? 'PL' :
            deviceCountry === 'CM' ? 'CM' :
            'CI'; // Default to Côte d'Ivoire
          
          setCurrentCountry(detectedCountry);
          await AsyncStorage.setItem(STORAGE_KEY, detectedCountry);
          await AsyncStorage.setItem(FIRST_OPEN_KEY, 'true');
          console.log(`🌍 Country detected on first open: ${detectedCountry} (device: ${deviceCountry})`);
        } else {
          // Not first open but no stored country (shouldn't happen but fallback to CI)
          setCurrentCountry('CI');
          await AsyncStorage.setItem(STORAGE_KEY, 'CI');
          console.log('🌍 Country fallback to CI');
        }
      } catch (error) {
        console.error('Error initializing country:', error);
        // Fallback to Côte d'Ivoire
        setCurrentCountry('CI');
      }
    };

    initializeCountry();
  }, []);

  const changeCountry = useCallback((country: CountryCode) => {
    setCurrentCountry(country);
    AsyncStorage.setItem(STORAGE_KEY, country).catch(() => {});
    
    // Automatically set language based on country
    const languageForCountry: Record<CountryCode, Language> = {
      'PL': 'pl',
      'CI': 'fr',
      'CM': 'fr',
    };
    
    const newLanguage = languageForCountry[country];
    if (newLanguage) {
      i18n.changeLanguage(newLanguage);
      AsyncStorage.setItem('@betclic/language', newLanguage).catch(() => {});
      console.log(`🌍 Country changed to: ${country}, Language automatically set to: ${newLanguage}`);
    } else {
      console.log(`🌍 Country changed to: ${country}`);
    }
  }, []);

  const value = useMemo<CountryContextValue>(
    () => ({
      currentCountry,
      changeCountry,
    }),
    [currentCountry, changeCountry],
  );

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};
