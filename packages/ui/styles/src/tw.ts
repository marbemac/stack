import { type ClassNameValue, twJoin } from 'tailwind-merge';

export type TW_STR = 'TW_STR';

const tw = twJoin as (...classLists: ClassNameValue[]) => TW_STR;

export type { ClassNameValue };
export { tw };
