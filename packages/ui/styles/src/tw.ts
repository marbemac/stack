import { type ClassNameValue, twJoin as cx, twMerge as txMerge } from 'tailwind-merge';

import type { StylePropsResolver } from './types.ts';

export type TW_STR = 'TW_STR';

/**
 * cx that expects tailwind classes
 */
const tx = cx as (...classLists: ClassNameValue[]) => TW_STR;

export type { ClassNameValue };
export { cx, tx, txMerge };

export const stylePropsResolver: StylePropsResolver = ({ tw, UNSAFE_class }) => {
  if (!tw && !UNSAFE_class) {
    return undefined;
  }

  return cx(txMerge(tw), UNSAFE_class);
};
