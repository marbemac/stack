import type { TokenFactory, UtilityFactory } from './types.ts';

export type TypographyToken =
  | 'default-line-height'
  | 'line-height-1'
  | 'line-height-2'
  | 'line-height-3'
  | 'line-height-4'
  | 'line-height-5'
  | 'line-height-6'
  | 'line-height-7'
  | 'line-height-8'
  | 'line-height-9'
  | 'default-leading-trim-start'
  | 'default-leading-trim-end'
  | 'leading-trim-start'
  | 'leading-trim-end';

export const typographyTokens: TokenFactory<TypographyToken> = t => {
  return {
    'default-line-height': '1.5',
    'line-height-1': '0.75rem', // 12px
    'line-height-2': '1rem', // 16px
    'line-height-3': '1.25rem', // 20px
    'line-height-4': '1.5rem', // 24px
    'line-height-5': '1.75rem', // 28px
    'line-height-6': '2rem', // 32px
    'line-height-7': '2.25rem', // 36px
    'line-height-8': '2.5rem', // 40px
    'line-height-9': '3.75rem', // 60px
    'default-leading-trim-start': '0.42em',
    'default-leading-trim-end': '0.36em',
    'leading-trim-start': `var(${t('default-leading-trim-start')})`,
    'leading-trim-end': `var(${t('default-leading-trim-end')})`,
  };
};

export const typographyUtilities: UtilityFactory = t => ({
  /**
   * base leading utils
   */

  '.leading-1': {
    '--line-height': `var(${t('line-height-1')})`,
    'line-height': `var(--line-height)`,
  },

  '.leading-2': {
    '--line-height': `var(${t('line-height-2')})`,
    'line-height': `var(--line-height)`,
  },

  '.leading-3': {
    '--line-height': `var(${t('line-height-3')})`,
    'line-height': `var(--line-height)`,
  },

  '.leading-4': {
    '--line-height': `var(${t('line-height-4')})`,
    'line-height': `var(--line-height)`,
  },

  '.leading-5': {
    '--line-height': `var(${t('line-height-5')})`,
    'line-height': `var(--line-height)`,
  },

  '.leading-6': {
    '--line-height': `var(${t('line-height-6')})`,
    'line-height': `var(--line-height)`,
  },

  '.leading-7': {
    '--line-height': `var(${t('line-height-7')})`,
    'line-height': `var(--line-height)`,
  },

  '.leading-8': {
    '--line-height': `var(${t('line-height-8')})`,
    'line-height': `var(--line-height)`,
  },

  '.leading-9': {
    '--line-height': `var(${t('line-height-9')})`,
    'line-height': `var(--line-height)`,
  },

  /**
   * leading trim
   *
   * Inspired by https://github.com/radix-ui/themes/blob/main/packages/radix-ui-themes/src/styles/utilities/leading-trim.css
   */

  [`.leading-trim-normal::before,
    .leading-trim-end::before`]: {
    content: 'none',
  },

  [`.leading-trim-normal::after,
    .leading-trim-start::after`]: {
    content: 'none',
  },

  [`.leading-trim-start::before,
    .leading-trim-both::before`]: {
    content: '""',
    display: 'table',
    'margin-bottom': `calc(
      var(${t('leading-trim-start')}, var(${t('default-leading-trim-start')})) -
        var(--line-height, calc(1em * var(${t('default-line-height')}))) / 2
    )`,
  },

  [`.leading-trim-end::after,
    .leading-trim-both::after`]: {
    content: '""',
    display: 'table',
    'margin-top': `calc(
      var(${t('leading-trim-end')}, var(${t('default-leading-trim-end')})) -
        var(--line-height, calc(1em * var(${t('default-line-height')}))) / 2
    )`,
  },
});
