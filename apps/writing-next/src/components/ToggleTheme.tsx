'use client';

import { useGlobalTheme } from '@marbemac/ui-primitives-react';
import { setThemeCookie } from '@marbemac/ui-theme-next';
import { useTransition } from 'react';

export const ToggleTheme = () => {
  const [isPending, startTransition] = useTransition();

  const currentTheme = useGlobalTheme();
  const nextTheme = currentTheme.baseThemeId === 'default' ? 'default_dark' : 'default';

  return <button onClick={() => startTransition(() => setThemeCookie({ baseThemeId: nextTheme }))}>Set Theme</button>;
};
