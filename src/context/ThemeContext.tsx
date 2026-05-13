import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DARK_THEME_COLOR,
  LIGHT_THEME_COLOR,
  type ThemeColors,
} from '../assets/colors';

const STORAGE_KEY = '@betclic/theme';

export type ThemeContextValue = {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  colors: DARK_THEME_COLOR,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(stored => {
      if (stored === 'dark') {
        setIsDark(true);
      } else if (stored === 'light') {
        setIsDark(false);
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light').catch(
        () => {},
      );
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      colors: isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR,
      toggleTheme,
    }),
    [isDark, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
