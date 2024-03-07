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
