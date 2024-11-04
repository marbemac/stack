import type { StringifiedJSONBranded } from './safe-stringify.ts';

export const safeParse = <T>(
  text: T | string,
  reviver?: (key: string, value: unknown) => unknown,
): Exclude<T, string> | undefined => {
  if (typeof text !== 'string') return text as Exclude<T, string>;

  try {
    return JSON.parse(text, reviver);
  } catch (e) {
    return undefined;
  }
};

/**
 * @example
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * // Type-safe JSON string
 * const userStringJSON: StringifiedJSONBranded<User> = '{"id": 1, "name": "John", "email": "john@example.com"}' as StringifiedJSONBranded<User>;
 *
 * const user = safeParseBranded(userStringJSON);
 */
export const safeParseBranded = <T>(text: StringifiedJSONBranded<T>) => {
  return safeParse<T>(text);
};
