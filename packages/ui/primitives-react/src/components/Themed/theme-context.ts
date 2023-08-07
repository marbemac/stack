'use client';

import type { GeneratedTheme } from '@marbemac/ui-theme';
import { createContext, useContext } from 'react';

export const ThemeContext = createContext<GeneratedTheme | null>(null);

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within the context of a ThemeContext.');
  }

  return theme;
};

export const GlobalThemeContext = createContext<GeneratedTheme | null>(null);

export const useGlobalTheme = () => {
  const theme = useContext(GlobalThemeContext);
  if (!theme) {
    throw new Error('useGlobalTheme must be used within the context of a GlobalThemeContext.');
  }

  return theme;
};
