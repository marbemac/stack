import type { AnyColor, HslaColor } from '@marbemac/utils-colors';

import type { INTENTS } from './consts.ts';
import type { PrebuiltThemeIds } from './prebuilt-themes.ts';

export type ColorMode = 'light' | 'dark';
export type ConfigColorMode = ColorMode | 'system';

export type ThemeConfig = { baseThemeId: PrebuiltThemeIds; customTheme?: CustomTheme };

export type Theme = {
  name: string;
  isDark?: boolean;

  // https://theme-ui.com/theme-spec#color
  colors: {
    text: AnyColor; // Body foreground color
    background: AnyColor; // Body background color, the background hue is used to derive a few other colors
    primary: AnyColor; // Primary brand color for links, buttons, etc.
    danger: AnyColor;

    /**
     * TBD whether we ever have a use for the below...
     */
    // secondary: AnyColor; // A secondary brand color for alternative styling
    // accent: AnyColor; // A contrast color for emphasizing UI
    // highlight: AnyColor; // A background color for highlighting text
    // muted: AnyColor; // A faint color for backgrounds, borders, and accents that do not require high contrast with the background color
    // success: AnyColor;
    // warning: AnyColor;
  };
};

export type CustomTheme = {
  name?: string;
  colors: Partial<Theme['colors']>;
};

/**
 * The token names / organization is inspired by https://primer.style/design/foundations/color
 *
 * Be very intentional about adding new color variables! Less is more.
 */

export type FgPrefix = 'fg';
export type FgFoundation = 'default' | 'muted' | 'soft' | 'on-emphasis';
export type FgColor = `${FgPrefix}-${FgFoundation}`;

export type CanvasPrefix = 'canvas';
export type CanvasFoundation = 'default' | 'overlay' | 'inset' | 'emphasis';
export type CanavasColor = `${CanvasPrefix}-${CanvasFoundation}` | 'panel' | 'panel-a' | 'surface';

export type ColorPrefix = FgPrefix | CanvasPrefix;

export type Intent = (typeof INTENTS)[number];
export type IntentFoundation =
  | 'fg'
  | 'solid-1'
  | 'solid-2'
  | 'solid-3'
  | 'soft-1'
  | 'soft-2'
  | 'soft-3'
  | 'line-1'
  | 'line-2'
  | 'line-3'
  | 'surface';

export type IntentFoundationWAlpha = IntentFoundation | `${IntentFoundation}-a`;

export type IntentColor<I extends Intent = Intent> = `${I}-${IntentFoundationWAlpha}` | `on-${I}` | `on-${I}-a`;

export type ThemeColorVariable = FgColor | CanavasColor | IntentColor;

export type Shadow = 'sm' | 'md' | 'lg';
export type Font = 'ui' | 'headings' | 'prose' | 'mono';

export type ThemeColorObj = Record<`--color-${ThemeColorVariable}`, HslaColor> & Record<`--font-${Font}`, string>;
