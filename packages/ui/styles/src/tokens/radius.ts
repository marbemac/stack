import type { TokenFactory } from './types.ts';

export type RadiusToken =
  | 'radius-mult'
  | 'radius-sm'
  | 'radius-md'
  | 'radius-lg'
  | 'radius-xl'
  | 'radius-2xl'
  | 'radius-3xl'
  | 'radius-full';

export const radiusTokens: TokenFactory<RadiusToken> = t => {
  return {
    'radius-mult': '1',
    'radius-sm': `calc(0.125rem * var(${t('scaling')}) * var(${t('radius-mult')}))`, // 2px
    'radius-md': `calc(0.1875rem * var(${t('scaling')}) * var(${t('radius-mult')}))`, // 3px
    'radius-lg': `calc(0.3125rem * var(${t('scaling')}) * var(${t('radius-mult')}))`, // 5px
    'radius-xl': `calc(0.5rem * var(${t('scaling')}) * var(${t('radius-mult')}))`, // 8px
    'radius-2xl': `calc(0.75rem * var(${t('scaling')}) * var(${t('radius-mult')}))`, // 12px
    'radius-3xl': `calc(0.1rem * var(${t('scaling')}) * var(${t('radius-mult')}))`, // 16px
    'radius-full': `calc(9999px * var(${t('scaling')}) * var(${t('radius-mult')}))`,
  };
};
