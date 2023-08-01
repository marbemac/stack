import type { PrebuiltThemeIds } from '@marbemac/ui-theme';
import { generateTheme } from '@marbemac/ui-theme';
import { useMemo, useState } from 'react';

import { useStyleProps } from '../../provider.tsx';
import { polyRef } from '../../utils/forward-ref.ts';
import { ThemeContext } from './theme-context.ts';
import type { ThemeContextVal, ThemeProviderProps } from './types.ts';

const FALLBACK_THEME_ID: PrebuiltThemeIds = 'default';

export const Themed = polyRef<'div', ThemeProviderProps>((props, ref) => {
  const { as: As = 'div', defaultThemeId = FALLBACK_THEME_ID, UNSAFE_class, tw, components, ...others } = props;

  const [themeId, setThemeId] = useState<PrebuiltThemeIds>(defaultThemeId);

  /**
   * 1. Can we skip this call when first hydrating client, if the class was already generated on the server?
   * 2. Can we cache this work on the server safely so that it doesn't need to do it on every page render?
   */
  const generatedTheme = useMemo(() => generateTheme(themeId), [themeId]);

  const context: ThemeContextVal = {
    themeId,
    colorMode: generatedTheme.theme.isDark ? 'dark' : 'light',
    setThemeId,
    components,
  };

  const className = useStyleProps({
    tw,
    UNSAFE_class: UNSAFE_class,
    css: generatedTheme.css,
  });

  return (
    <ThemeContext.Provider value={context}>
      <As {...others} ref={ref} className={className} data-theme={generatedTheme.theme.isDark ? 'dark' : 'light'} />
    </ThemeContext.Provider>
  );
});
