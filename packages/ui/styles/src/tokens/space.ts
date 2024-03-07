import type { TokenFactory } from './types.ts';

export type SpaceToken = 'scaling';

export const spaceTokens: TokenFactory<SpaceToken> = t => {
  return {
    scaling: '1',
  };
};
