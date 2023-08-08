import type { BorderColor, CanavasColor, FgColor, Intent, IntentColor } from '@marbemac/ui-theme';
import { INTENTS } from '@marbemac/ui-theme';
import type { Config } from 'tailwindcss';

type ColorGroup = 'border' | 'text' | 'bg';

const colorWithOpacity = <N extends string>(name: N, group?: ColorGroup) =>
  `rgb(var(--color-${name}) / calc(var(--color-${name}-alpha, 1) * ${
    group ? `var(--tw-${group}-opacity, 1)` : '<alpha-value>'
  }))`;

const computeIntentColors = <I extends Intent>(intent: I, group?: ColorGroup): Record<string, string> => ({
  [`${intent}`]: colorWithOpacity<IntentColor>(`${intent}-solid`, group),
  [`${intent}-hover`]: colorWithOpacity<IntentColor>(`${intent}-solid-hover`, group),
  [`${intent}-active`]: colorWithOpacity<IntentColor>(`${intent}-solid-active`, group),
  // [`${intent}-gradient`]: colorWithOpacity<IntentColor>(`${intent}-solid-gradient`, group),
  [`${intent}-soft`]: colorWithOpacity<IntentColor>(`${intent}-soft`, group),
  [`${intent}-soft-hover`]: colorWithOpacity<IntentColor>(`${intent}-soft-hover`, group),
  [`${intent}-soft-active`]: colorWithOpacity<IntentColor>(`${intent}-soft-active`, group),
  [`on-${intent}`]: colorWithOpacity<IntentColor>(`on-${intent}`, group),
  // [`${intent}-on-neutral`]: colorWithOpacity<IntentColor>(`${intent}-on-neutral`, group),
});

const commonColors = (group?: ColorGroup) => {
  const intentColors: Record<string, string> = {};

  for (const r of INTENTS) {
    Object.assign(intentColors, computeIntentColors(r, group));
  }

  const colors = {
    current: 'currentColor',
    transparent: 'transparent',
    white: '#FFF',
    black: '#000',

    ...intentColors,
  };

  return colors;
};

const textColors = () => {
  const intentColors: Record<string, string> = {};

  for (const r of INTENTS) {
    intentColors[`${r}`] = colorWithOpacity<IntentColor>(`${r}-fg`, 'text');
    intentColors[`on-${r}`] = colorWithOpacity<IntentColor>(`on-${r}`, 'text');
  }

  return {
    fg: colorWithOpacity<FgColor>('fg-default', 'text'),
    muted: colorWithOpacity<FgColor>('fg-muted', 'text'),
    soft: colorWithOpacity<FgColor>('fg-soft', 'text'),
    'on-emphasis': colorWithOpacity<FgColor>('fg-on-solid', 'text'),

    ...intentColors,
  };
};

const backgroundColors = () => {
  return {
    canvas: colorWithOpacity<CanavasColor>('canvas-default', 'bg'),
    // 'canvas-overlay': colorWithOpacity<CanavasColor>('canvas-overlay', 'bg'),
    surface: colorWithOpacity<CanavasColor>('canvas-soft', 'bg'),
    'surface-inset': colorWithOpacity<CanavasColor>('canvas-inset', 'bg'),
    // 'canvas-emphasis': colorWithOpacity<CanavasColor>('canvas-emphasis', 'bg'),
  };
};

const borderColors = () => {
  return {
    DEFAULT: colorWithOpacity<BorderColor>('border-default', 'border'),
    input: colorWithOpacity<BorderColor>('border-default', 'border'),
    muted: colorWithOpacity<BorderColor>('border-muted', 'border'),
    // soft: colorWithOpacity<BorderColor>('border-soft', 'border'),
    // emphasis: colorWithOpacity<BorderColor>('border-emphasis', 'border'),
  };
};

const textColor = {
  // ...commonColors('text'),
  ...textColors(),
};

const backgroundColor = {
  ...commonColors('bg'),
  ...backgroundColors(),
};

const borderColor = {
  ...commonColors('border'),
  ...borderColors(),
};

const strokeColor = {
  current: 'currentColor',
};

const strokeWidth = {
  current: 'currentColor',
};

const borderRadius = {
  none: '0px',
  sm: '0.125rem', // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  full: '9999px',
};

const boxShadow = {
  sm: 'var(--shadow-sm)',
  DEFAULT: 'var(--shadow-default)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  inner: 'var(--shadow-inner)',
};

const fontFamily = {
  sans: 'var(--font-ui)',
  ui: 'var(--font-ui)',
  prose: 'var(--font-prose)',
  mono: 'var(--font-mono)',
};

type FontSize = string | [fontSize: string, lineHeight: string];

const fontSize: Record<string, FontSize> = {
  '2xs': ['0.625rem', '0.75rem'], // 10px
  xs: ['0.6875rem', '0.75rem'], // 11px
  sm: ['0.75rem', '1rem'], // 12px
  base: ['0.875rem', '1.25rem'], // 14px
  lg: ['1rem', '1.5rem'], // 16px
  xl: ['1.125rem', '1.75rem'], // 18px
  '2xl': ['1.25rem', '1.75rem'], // 20px
  '3xl': ['1.5rem', '2rem'],
  '4xl': ['1.875rem', '2.25rem'],
  '5xl': ['2.25rem', '2.5rem'],
  '6xl': ['3rem', '1'],
  '7xl': ['3.75rem', '1'],
  '8xl': ['4.5rem', '1'],
  'paragraph-leading': 'var(--fs-paragraph-leading)',
  paragraph: 'var(--fs-paragraph)',
  'paragraph-small': 'var(--fs-paragraph-small)',
  'paragraph-tiny': 'var(--fs-paragraph-tiny)',
};

const fontWeight = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

const extendLineHeight = {
  zero: '0',
  'paragraph-leading': 'var(--lh-paragraph-leading)',
  paragraph: 'var(--lh-paragraph)',
  'paragraph-small': 'var(--lh-paragraph-small)',
  'paragraph-tiny': 'var(--lh-paragraph-tiny)',
};

const extendSpacing = {
  18: '4.5rem',
  112: '28rem',
  128: '32rem',
  144: '36rem',
  160: '40rem',
};

const extendHeight = {
  ...extendSpacing,
  xs: '20px',
  sm: '24px',
  md: '32px',
  lg: '36px',
  xl: '44px',
  '2xl': '52px',
  '3xl': '60px',
};

const extendWidth = {
  ...extendSpacing,
  xs: '20px',
  sm: '24px',
  md: '32px',
  lg: '36px',
  xl: '44px',
  '2xl': '52px',
  '3xl': '60px',
};

const extendzIndex = {
  '-1': '-1',
};

const extendPlacecholderColor = {
  DEFAULT: 'var(--color-text-muted)',
};

const backgroundImage = {
  none: 'none',
  'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
  'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
  'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
  'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
  'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
  'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
  'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
  'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
};

const animation = {
  'spin-slow': 'spin 2s linear infinite',
};

export const themeObj: Config['theme'] = {
  screens: {
    lg: { min: '1280px' },
    md: { max: '1279px' },
    sm: { max: '767px' },
  },

  opacity: {
    ...linear(100, '', 100, 0, 5),
  },

  backgroundColor,
  backgroundImage,
  borderColor,
  borderRadius,
  boxShadow,
  colors: commonColors(),
  // dropShadow,
  fontFamily,

  fontSize,

  fontWeight,
  stroke: strokeColor,
  strokeWidth,
  textColor,

  extend: {
    lineHeight: extendLineHeight,
    height: extendHeight,
    placeholderColor: extendPlacecholderColor,
    width: extendWidth,
    zIndex: extendzIndex,
    spacing: extendSpacing,
    animation,
  },
};

/**
 * Original: https://github.com/tw-in-js/twind/blob/main/packages/preset-tailwind/src/baseTheme.ts#L877
 */
function linear(
  stop: number,
  unit = '',
  divideBy = 1,
  start = 0,
  step = 1,
  result: Record<string, string> = {},
  // eslint-disable-next-line max-params
): Record<string, string> {
  for (; start <= stop; start += step) {
    result[start] = start / divideBy + unit;
  }

  return result;
}
