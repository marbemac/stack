import type { TokenFactory } from './types.ts';

export type FontToken =
  | 'font-weight-light'
  | 'font-weight-regular'
  | 'font-weight-medium'
  | 'font-weight-semibold'
  | 'font-weight-bold'
  | 'font-weight-extrabold';

export const fontTokens: TokenFactory<FontToken> = t => {
  return {
    'font-weight-light': '300',
    'font-weight-regular': '400',
    'font-weight-medium': '500',
    'font-weight-semibold': '600',
    'font-weight-bold': '700',
    'font-weight-extrabold': '800',
  };
};
