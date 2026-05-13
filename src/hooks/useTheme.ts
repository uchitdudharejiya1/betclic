import {useContext} from 'react';

import {ThemeContext, type ThemeContextValue} from '../context/ThemeContext';

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);
