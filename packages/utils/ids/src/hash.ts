// @ts-expect-error no typings
import fnv from 'fnv-plus';

export const hash = (str: string) => fnv.fast1a64(str) as string;
export const hash32 = (str: string) => fnv.fast1a32hex(str) as string;
