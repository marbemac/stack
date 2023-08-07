import 'server-only';

import { ThemedGlobalInner } from '@marbemac/ui-primitives-react';

import { getGeneratedTheme, getGlobalTheme } from '../fetchers.ts';

export const ThemedGlobal = async ({ children }: { children: React.ReactNode }) => {
  const theme = getGlobalTheme();

  const { generatedTheme, generatedDarkTheme } = await getGeneratedTheme(theme);

  return (
    <ThemedGlobalInner generatedTheme={generatedTheme} generatedDarkTheme={generatedDarkTheme}>
      {children}
    </ThemedGlobalInner>
  );
};
