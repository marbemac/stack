import type { GeneratedTheme, PrebuiltThemeIds } from '@marbemac/ui-theme';
import { generateTheme } from '@marbemac/ui-theme';
import { css as twCss, tw } from '@marbemac/ui-twind';
import { createMemo, createSignal, mergeProps, splitProps } from 'solid-js';

import { createPolymorphicComponent } from '../../utils/polymorphic.ts';
import { Box } from '../Box/index.ts';
import { ThemeContext } from './theme-context.ts';
import type { ThemeContextVal, ThemeProviderProps } from './types.ts';

const FALLBACK_THEME_ID: PrebuiltThemeIds = 'default';

const generateThemeClass = (css: GeneratedTheme['css']) => tw(twCss(css));

export const Themed = createPolymorphicComponent<'div', ThemeProviderProps>(p => {
  const props = mergeProps(
    // defaults
    {
      as: 'div' as const,
      defaultThemeId: FALLBACK_THEME_ID,
    },
    p,
  );

  const [local, others] = splitProps(props, ['defaultThemeId', 'UNSAFE_class']);

  const [themeId, rawSetThemeId] = createSignal<PrebuiltThemeIds>(local.defaultThemeId);

  /**
   * 1. Can we skip this call when first hydrating client, if the class was already generated on the server?
   * 2. Can we cache this work on the server safely so that it doesn't need to do it on every page render?
   */
  const generatedTheme = createMemo(() => generateTheme(themeId()));
  const generatedThemeClass = createMemo(() => generateThemeClass(generatedTheme().css));

  const context: ThemeContextVal = {
    themeId,
    colorMode: () => (generatedTheme().theme.isDark ? 'dark' : 'light'),
    setThemeId: rawSetThemeId,
  };

  return (
    <ThemeContext.Provider value={context}>
      <Box
        UNSAFE_class={[local.UNSAFE_class, generatedThemeClass()]}
        data-theme={generatedTheme().theme.isDark ? 'dark' : 'light'}
        {...others}
      />
    </ThemeContext.Provider>
  );
});
