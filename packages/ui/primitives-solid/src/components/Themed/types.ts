import type { ColorMode, CustomTheme, PrebuiltThemeIds } from '@marbemac/ui-theme';
import type { Accessor, ParentProps } from 'solid-js';

import type { StyleProps } from '../../types.ts';
import type { ComponentsConfig } from './components-config.ts';

export type ConfigTheme = {
  themeId: PrebuiltThemeIds;
  customTheme?: CustomTheme;
};
export type MaybeConfigTheme = ConfigTheme | undefined;

export type ThemeStorageManager = {
  /** The type of storage. */
  type: 'cookie' | 'localStorage';

  /** Whether it's an SSR environment. */
  ssr?: boolean;

  /** Get the color mode from the storage. */
  get: (fallback?: ConfigTheme) => ConfigTheme;

  /** Save the color mode in the storage. */
  set: (value: ConfigTheme) => void;
};

export type ThemeOptions = {
  defaultThemeId?: PrebuiltThemeIds;
  // defaultTheme?: CustomTheme;
  // isInverted?: boolean;
};

export type ThemeProviderProps = ParentProps<ThemeOptions & StyleProps>;

export type ThemeContextVal = {
  themeId: Accessor<PrebuiltThemeIds>;
  colorMode: Accessor<ColorMode>;
  setThemeId: (value: PrebuiltThemeIds) => void;
  components?: ComponentsConfig;
};
