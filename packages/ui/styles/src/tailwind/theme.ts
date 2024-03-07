/**
 * For reference the default full tailwind config:
 *
 * https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js
 */

import type { CanavasColor, FgColor, Intent, IntentColor } from '@marbemac/ui-theme';
import { INTENTS } from '@marbemac/ui-theme';
import type { Config } from 'tailwindcss';

import type { FontToken } from '../tokens/fonts.ts';
import { fontTokens } from '../tokens/fonts.ts';
import { createCssVariableFactory, createTokenProcessor } from '../tokens/helpers.ts';
import type { RadiusToken } from '../tokens/radius.ts';
import { radiusTokens } from '../tokens/radius.ts';
import type { TokenCssVars } from '../tokens/types.ts';
import { typographyTokens } from '../tokens/typography.ts';

type ColorGroup = 'border' | 'text' | 'bg';

const colorWithOpacity = <N extends string>(name: N, group?: ColorGroup, defaultAlpha = '<alpha-value>') =>
  `rgb(var(--color-${name}) / calc(var(--color-${name}-alpha, 1) * ${
    group ? `var(--tw-${group}-opacity, ${defaultAlpha})` : defaultAlpha
  }))`;

const computeIntentColors = <I extends Intent>(intent: I, group?: ColorGroup): Record<string, string> => ({
  [`${intent}-1`]: colorWithOpacity<IntentColor>(`${intent}-solid-1`, group),
  [`${intent}-2`]: colorWithOpacity<IntentColor>(`${intent}-solid-2`, group),
  [`${intent}-3`]: colorWithOpacity<IntentColor>(`${intent}-solid-3`, group),
  [`${intent}-1-a`]: colorWithOpacity<IntentColor>(`${intent}-solid-1-a`, group),
  [`${intent}-2-a`]: colorWithOpacity<IntentColor>(`${intent}-solid-2-a`, group),
  [`${intent}-3-a`]: colorWithOpacity<IntentColor>(`${intent}-solid-3-a`, group),
  [`${intent}-soft-1`]: colorWithOpacity<IntentColor>(`${intent}-soft-1`, group),
  [`${intent}-soft-2`]: colorWithOpacity<IntentColor>(`${intent}-soft-2`, group),
  [`${intent}-soft-3`]: colorWithOpacity<IntentColor>(`${intent}-soft-3`, group),
  [`${intent}-soft-1-a`]: colorWithOpacity<IntentColor>(`${intent}-soft-1-a`, group),
  [`${intent}-soft-2-a`]: colorWithOpacity<IntentColor>(`${intent}-soft-2-a`, group),
  [`${intent}-soft-3-a`]: colorWithOpacity<IntentColor>(`${intent}-soft-3-a`, group),
  [`${intent}-line-1`]: colorWithOpacity<IntentColor>(`${intent}-line-1`, group),
  [`${intent}-line-2`]: colorWithOpacity<IntentColor>(`${intent}-line-2`, group),
  [`${intent}-line-3`]: colorWithOpacity<IntentColor>(`${intent}-line-3`, group),
  [`${intent}-line-1-a`]: colorWithOpacity<IntentColor>(`${intent}-line-1-a`, group),
  [`${intent}-line-2-a`]: colorWithOpacity<IntentColor>(`${intent}-line-2-a`, group),
  [`${intent}-line-3-a`]: colorWithOpacity<IntentColor>(`${intent}-line-3-a`, group),
  [`${intent}-surface`]: colorWithOpacity<IntentColor>(`${intent}-surface`, group),
  [`${intent}-surface-a`]: colorWithOpacity<IntentColor>(`${intent}-surface-a`, group),
  [`on-${intent}`]: colorWithOpacity<IntentColor>(`on-${intent}`, group),
  [`on-${intent}-a`]: colorWithOpacity<IntentColor>(`on-${intent}-a`, group),
});

const commonColors = (group?: ColorGroup) => {
  const intentColors: Record<string, string> = {};

  for (const r of INTENTS) {
    Object.assign(intentColors, computeIntentColors(r, group));
  }

  const colors = {
    inherit: 'inherit',
    current: 'currentColor',
    transparent: 'transparent',
    white: '#FFF',
    black: '#000',

    canvas: colorWithOpacity<CanavasColor>('canvas-default', group),
    'canvas-emphasis': colorWithOpacity<CanavasColor>('canvas-emphasis', group),

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
    inherit: 'inherit',
    current: 'currentColor',
    transparent: 'transparent',
    white: '#FFF',
    black: '#000',

    fg: colorWithOpacity<FgColor>('fg-default', 'text'),
    muted: colorWithOpacity<FgColor>('fg-muted', 'text'),
    soft: colorWithOpacity<FgColor>('fg-soft', 'text'),
    'on-emphasis': colorWithOpacity<FgColor>('fg-on-emphasis', 'text'),
    link: colorWithOpacity<IntentColor>('primary-fg', 'text'),

    ...intentColors,
  };
};

const backgroundColors = () => {
  return {
    panel: colorWithOpacity<CanavasColor>('panel', 'bg'),
    'panel-a': colorWithOpacity<CanavasColor>('panel-a', 'bg'),
    surface: colorWithOpacity<CanavasColor>('surface', 'bg'),
    overlay: colorWithOpacity<CanavasColor>('canvas-overlay', 'bg'),
  };
};

const borderColors = () => {
  return {
    DEFAULT: colorWithOpacity<IntentColor>('neutral-soft-3', 'border'),
    /**
     * @TODO the below might not be needed?
     */
    // muted: colorWithOpacity<IntentColor>('border-muted', 'border'),
    // soft: colorWithOpacity<BorderColor>('border-soft', 'border'),
    // emphasis: colorWithOpacity<BorderColor>('border-emphasis', 'border'),
  };
};

const backgroundColor = {
  ...commonColors('bg'),
  ...backgroundColors(),
};

const borderColor = {
  ...commonColors('border'),
  ...borderColors(),
};

const boxShadow = {
  border: `inset 0 0 0 1px ${colorWithOpacity<IntentColor>('neutral-soft-3', 'border', '1')}`,
  'border-b': `inset 0 -1px 0 0 ${colorWithOpacity<IntentColor>('neutral-soft-3', 'border', '1')}`,

  sm: 'var(--shadow-sm)',
  DEFAULT: 'var(--shadow-md)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
};

const fontFamily = {
  inherit: 'inherit',
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
};

export interface GenerateThemeOptions {
  prefix?: string;
}

export const generateTWThemeConfig = (options: GenerateThemeOptions = {}): Config['theme'] => {
  const t = createCssVariableFactory(options.prefix ?? 'm');
  const tp = createTokenProcessor(t);

  const radius = tp(radiusTokens);
  const typography = tp(typographyTokens);
  const font = tp(fontTokens);

  return {
    screens: {
      lg: { min: '1280px' },
      md: { max: '1279px' },
      sm: { max: '767px' },
    },

    opacity: { ...linear(100, '', 100, 0, 5) },
    backgroundColor,
    fill: backgroundColor,
    borderColor,
    borderRadius: borderRadius(radius.tokensCssVars),
    boxShadow,
    colors: commonColors(),
    fontFamily,
    fontSize,
    lineHeight: lineHeight(),

    fontWeight: fontWeight(font.tokensCssVars),

    stroke: borderColor,

    textColor: textColors(),

    extend: {
      placeholderColor: {
        DEFAULT: 'var(--color-text-muted)',
      },

      zIndex: {
        '-1': '-1',
        5: '5',
      },

      spacing: {
        18: '4.5rem',
        112: '28rem',
        128: '32rem',
        144: '36rem',
        160: '40rem',
      },

      width: ({ theme }) => ({
        'form-sm': theme('spacing.7'),
        'form-md': theme('spacing.9'),
        'form-lg': theme('spacing.11'),
        'form-xl': theme('spacing.16'),
        'form-2xl': theme('spacing.20'),
      }),

      height: ({ theme }) => ({
        'form-sm': theme('spacing.7'),
        'form-md': theme('spacing.9'),
        'form-lg': theme('spacing.12'),
        'form-xl': theme('spacing.16'),
        'form-2xl': theme('spacing.20'),
      }),

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },

        slideUpAndFadeIn: {
          from: { opacity: '0', transform: 'translateY(4px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideUpAndFadeOut: {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(-4px) scale(0.97)' },
        },
        slideDownAndFadeIn: {
          from: { opacity: '0', transform: 'translateY(-4px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideDownAndFadeOut: {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(4px) scale(0.97)' },
        },
        slideLeftAndFadeIn: {
          from: { opacity: '0', transform: 'translateX(4px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        slideLeftAndFadeOut: {
          from: { opacity: '1', transform: 'translateX(0) scale(1)' },
          to: { opacity: '0', transform: 'translateX(-4px) scale(0.97)' },
        },
        slideRightAndFadeIn: {
          from: { opacity: '0', transform: 'translateX(-4px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        slideRightAndFadeOut: {
          from: { opacity: '1', transform: 'translateX(0) scale(1)' },
          to: { opacity: '0', transform: 'translateX(4px) scale(0.97)' },
        },
        slideDown: {
          from: { height: '0' },
          to: { height: 'var(--content-height)' },
        },
        slideUp: {
          from: { height: 'var(--content-height)' },
          to: { height: '0' },
        },

        dialogContentShow: {
          from: { opacity: '0', transform: 'translateY(5px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0px) scale(1)' },
        },
        dialogContentHide: {
          from: { opacity: '1', transform: 'translateY(0px) scale(1)' },
          to: { opacity: '0', transform: 'translateY(5px) scale(0.99)' },
        },
      },

      animation: {
        'spin-slow': 'spin 2s linear infinite',

        'fade-in': 'fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-out': 'fadeOut 100ms cubic-bezier(0.16, 1, 0.3, 1) forwards',

        'slide-up-fade-in': 'slideUpAndFadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up-fade-out': 'slideUpAndFadeOut 100ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down-fade-in': 'slideDownAndFadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down-fade-out': 'slideDownAndFadeOut 100ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-left-fade-in': 'slideLeftAndFadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left-fade-out': 'slideLeftAndFadeOut 100ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-right-fade-in': 'slideRightAndFadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right-fade-out': 'slideRightAndFadeOut 100ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 200ms cubic-bezier(0.87, 0, 0.13, 1)',
        'slide-up': 'slideUp 200ms cubic-bezier(0.87, 0, 0.13, 1) forwards',

        'overlay-show': 'fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'overlay-hide': 'fadeOut 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'dialog-content-show': 'dialogContentShow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'dialog-content-hide': 'dialogContentHide 100ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  };
};

const lineHeight = () => ({
  // the rest of the line height utils are added by the typography utilities plugin
  zero: '0',
  none: '1',
});

const fontWeight = (t: TokenCssVars<FontToken>) => ({
  light: `var(${t['font-weight-light']})`,
  normal: `var(${t['font-weight-regular']})`,
  medium: `var(${t['font-weight-medium']})`,
  semibold: `var(${t['font-weight-semibold']})`,
  bold: `var(${t['font-weight-bold']})`,
  extrabold: `var(${t['font-weight-extrabold']})`,
});

const borderRadius = (t: TokenCssVars<RadiusToken>) => ({
  none: '0px',
  inherit: 'inherit',
  sm: `var(${t['radius-sm']})`,
  DEFAULT: `var(${t['radius-md']})`,
  md: `var(${t['radius-md']})`,
  lg: `var(${t['radius-lg']})`,
  xl: `var(${t['radius-xl']})`,
  '2xl': `var(${t['radius-2xl']})`,
  '3xl': `var(${t['radius-3xl']})`,
  full: `var(${t['radius-full']})`,
});

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
