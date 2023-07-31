import type { StyleProps } from '@marbemac/ui-styles';
import type { ColorMode, CustomTheme, PrebuiltThemeIds } from '@marbemac/ui-theme';

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

export type ThemeProviderProps = ThemeOptions &
  StyleProps & {
    children: React.ReactNode;
    components?: ComponentsConfig;
  };

export type ThemeContextVal = {
  themeId: PrebuiltThemeIds;
  colorMode: ColorMode;
  setThemeId: (value: PrebuiltThemeIds) => void;
  components?: ComponentsConfig;
};
