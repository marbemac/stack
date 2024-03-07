import type { GeneratedTheme, ThemeConfig } from '@marbemac/ui-theme';
import { createContext, useContext } from 'react';

export const ThemeContext = createContext<GeneratedTheme | null>(null);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within the context of a ThemeContext.');
  }

  return theme;
};

export const GlobalThemeContext = createContext<ThemeConfig | null>(null);

export const useGlobalTheme = () => {
  const theme = useContext(GlobalThemeContext);
  if (typeof theme === 'undefined') {
    throw new Error('useGlobalTheme must be used within the context of a GlobalThemeContext.');
  }

  return theme;
};
