import type { CustomTheme, GeneratedTheme, PrebuiltThemeIds } from '@marbemac/ui-theme';
import { generateTheme } from '@marbemac/ui-theme';
import type { SetRequired } from '@marbemac/utils-types';
import basePlugin from 'tailwindcss/plugin';

import { fontTokens } from '../tokens/fonts.ts';
import { createCssVariableFactory, createTokenProcessor } from '../tokens/helpers.ts';
import { radiusTokens } from '../tokens/radius.ts';
import { spaceTokens } from '../tokens/space.ts';
import { typographyTokens, typographyUtilities } from '../tokens/typography.ts';
import { tx } from '../tw.ts';
import { generateTWThemeConfig } from './theme.ts';

export interface PluginOptions {
  prefix?: string;

  theme?:
    | false
    | {
        default: PrebuiltThemeIds | CustomTheme;
        dark?: PrebuiltThemeIds | CustomTheme | false;
        additional?: [PrebuiltThemeIds | SetRequired<CustomTheme, 'name'>];
      };
}

export const plugin = basePlugin.withOptions(
  (options: PluginOptions = {}) => {
    const t = createCssVariableFactory(options.prefix ?? 'm');
    const tokenProcessor = createTokenProcessor(t);

    const themes = computeThemeVars(options.theme);

    return ({ addBase, addUtilities, addVariant }) => {
      addBase({
        ':root': {
          ...tokenProcessor(spaceTokens).variables,
          ...tokenProcessor(radiusTokens).variables,
          ...tokenProcessor(typographyTokens).variables,
          ...tokenProcessor(fontTokens).variables,
          ...(themes.defaultTheme ? cssPropsToJSInCss(themes.defaultTheme.css) : {}),
        },
      });

      if (themes.darkTheme) {
        addBase({
          '@media (prefers-color-scheme: dark)': {
            ':root': {
              ...(themes.darkTheme ? cssPropsToJSInCss(themes.darkTheme.css) : {}),
            },
          },
        });
      }

      if (themes.additional?.length) {
        for (const theme of themes.additional) {
          addBase({
            [`[data-theme="${theme.theme.name}"]`]: {
              ...cssPropsToJSInCss(theme.css),
            },
          });
        }
      }

      /**
       * New variants, some of which are helpers for ariakit selectors (https://ariakit.org/guide/styling)
       */

      // https://larsmagnus.co/blog/focus-visible-within-the-missing-pseudo-class
      addVariant('focus-visible-within', '&:has(:focus-visible)');

      addVariant(
        'supports-backdrop-blur',
        '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))',
      );
      addVariant('backdrop', '&[data-backdrop]');
      addVariant('open', '&[data-open]');
      addVariant('enter', '&[data-enter]');
      addVariant('leave', '&[data-leave]');
      addVariant('checked', ['&[aria-checked="true"]']);
      addVariant('expanded', ['&[aria-expanded="true"]']);
      addVariant('hover', ['&:hover', '&[aria-expanded="true"]']);
      addVariant('invalid', ['&[aria-invalid="true"]']);
      addVariant('placeholder-shown', ['&:placeholder-shown', '&[data-placeholder="true"]']);
      addVariant('disabled', ['&:disabled', '&[aria-disabled="true"]']);
      addVariant('group-active-item', ':merge(.group)[data-active-item] &');
      addVariant('active', ['&:active', '&[data-active]', '&[data-active-item]']);
      addVariant('focus-visible', ['&:focus-visible', '&[data-focus-visible]']);

      /**
       * New utilities
       */

      addUtilities(typographyUtilities(t));

      addUtilities({
        /**
         * Resets
         */

        '.reset-a': {
          'text-decoration': 'none',
          color: 'inherit',
          outline: 'none',
        },

        '.reset-button': {
          appearance: 'none',
          'background-color': 'transparent',
          border: 'none',
          'font-size': 'inherit',
          'font-family': 'inherit',
          'line-height': 'inherit',
          'letter-spacing': 'inherit',
          color: 'inherit',
          outline: 'none',
          padding: '0',
          margin: '0',
        },

        /**
         * Animations
         */

        '.animate-popper': {
          '&[data-open="true"]': {
            "&[data-side='top']": {
              [`@apply ${tx('motion-safe:animate-slide-up-fade-in')}`]: {},
            },
            "&[data-side='bottom']": {
              [`@apply ${tx('motion-safe:animate-slide-down-fade-in')}`]: {},
            },
            "&[data-side='left']": {
              [`@apply ${tx('motion-safe:animate-slide-left-fade-in')}`]: {},
            },
            "&[data-side='right']": {
              [`@apply ${tx('motion-safe:animate-slide-right-fade-in')}`]: {},
            },
          },

          '&[data-leave]': {
            "&[data-side='top']": {
              [`@apply ${tx('motion-safe:animate-slide-down-fade-out')}`]: {},
            },
            "&[data-side='bottom']": {
              [`@apply ${tx('motion-safe:animate-slide-up-fade-out')}`]: {},
            },
            "&[data-side='left']": {
              [`@apply ${tx('motion-safe:animate-slide-right-fade-out')}`]: {},
            },
            "&[data-side='right']": {
              [`@apply ${tx('motion-safe:animate-slide-left-fade-out')}`]: {},
            },
          },
        },

        '.animate-overlay': {
          "&[data-open='true']": {
            [`@apply ${tx('motion-safe:animate-overlay-show')}`]: {},
          },

          '&[data-leave]': {
            [`@apply ${tx('motion-safe:animate-overlay-hide')}`]: {},
          },
        },

        '.animate-dialog-content': {
          "&[data-open='true']": {
            [`@apply ${tx('motion-safe:animate-dialog-content-show')}`]: {},
          },

          '&[data-leave]': {
            [`@apply ${tx('motion-safe:animate-dialog-content-hide')}`]: {},
          },
        },
      });
    };
  },
  options => {
    return {
      theme: generateTWThemeConfig(options),
    };
  },
);

const computeThemeVars = (options: PluginOptions['theme']) => {
  if (options === false) return {};

  let defaultTheme;
  const defaultId = options?.default ?? 'default';
  if (defaultId) {
    defaultTheme = typeof defaultId === 'string' ? generateTheme(defaultId) : generateTheme('default', defaultId);
  }

  let darkTheme;
  const darkId = options?.dark === false ? false : options?.dark ?? 'default_dark';
  if (darkId) {
    darkTheme = typeof darkId === 'string' ? generateTheme(darkId) : generateTheme('default_dark', darkId);
  }

  const additional: GeneratedTheme[] = [];
  for (const theme of options?.additional ?? []) {
    additional.push(typeof theme === 'string' ? generateTheme(theme) : generateTheme('default', theme));
  }

  return { defaultTheme, darkTheme, additional };
};

/**
 * Most values should be strings, or tailwind will add a unit to them. E.g. turn `opacity: 0.5` into `opacity: 0.5px`
 *
 * https://tailwindcss.com/docs/plugins#css-in-js-syntax
 */
const cssPropsToJSInCss = (css: Record<string, unknown>) => {
  const rules = Object.keys(css);
  const result: Record<string, string> = {};

  for (const rule of rules) {
    const value = css[rule]!;
    result[rule] = typeof value === 'string' ? value : String(value);
  }

  return result;
};
