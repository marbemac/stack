import stringify from 'fast-json-stable-stringify';

import { hash } from './hash.ts';

export const hashJson = (data: unknown) => {
  return hash(stringify(data));
};
