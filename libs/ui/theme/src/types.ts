import type { INTENTS } from './consts.ts';

export type Color = string;
export type HslaColor = string;
export type RgbaColor = [number, number, number, number];
export type RgbColor = [number, number, number];

export type ColorMode = 'light' | 'dark';
export type ConfigColorMode = ColorMode | 'system';

export type Theme = {
  name: string;
  isDark?: boolean;

  // https://theme-ui.com/theme-spec#color
  colors: {
    text: Color; // Body foreground color
    background: Color; // Body background color, the background hue is used to derive a few other colors
    primary: Color; // Primary brand color for links, buttons, etc.
    secondary: Color; // A secondary brand color for alternative styling
    // accent: Color; // A contrast color for emphasizing UI
    // highlight: Color; // A background color for highlighting text
    muted: Color; // A faint color for backgrounds, borders, and accents that do not require high contrast with the background color

    success: Color;
    warning: Color;
    danger: Color;
  };
};

export type CustomTheme = {
  name?: string;
  isDark?: boolean;
  colors: Partial<Theme['colors']>;
};

/**
 * The token names / organization is inspired by https://primer.style/design/foundations/color
 *
 * Be very intentional about adding new color variables! Less is more.
 */

export type FgPrefix = 'fg';
export type FgFoundation = 'default' | 'muted' | 'subtle' | 'on-solid';
export type FgColor = `${FgPrefix}-${FgFoundation}`;

export type CanvasPrefix = 'canvas';
export type CanvasFoundation = 'default' | 'overlay' | 'inset' | 'subtle' | 'emphasis';
export type CanavasColor = `${CanvasPrefix}-${CanvasFoundation}`;

export type BorderPrefix = 'border';
export type BorderFoundation = 'default' | 'muted' | 'subtle' | 'emphasis';
export type BorderColor = `${BorderPrefix}-${BorderFoundation}`;

export type ColorPrefix = FgPrefix | CanvasPrefix | BorderPrefix;

export type Intent = (typeof INTENTS)[number];
export type IntentFoundation =
  | 'fg'
  | 'solid'
  | 'solid-hover'
  | 'solid-active'
  | 'solid-gradient'
  | 'subtle'
  | 'subtle-hover'
  | 'subtle-active';
export type IntentColor<I extends Intent = Intent> = `${I}-${IntentFoundation}` | `on-${I}` | `${I}-on-neutral`;

export type ThemeColorVariable = FgColor | CanavasColor | BorderColor | IntentColor;

export type Shadow = 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
export type Font = 'ui' | 'headings' | 'prose' | 'mono';

export type ThemeColorObj = Record<`--color-${ThemeColorVariable}`, HslaColor> &
  Record<`--shadow-${Shadow}`, string> &
  Record<`--font-${Font}`, string>;
