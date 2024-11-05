// NOTE: There are many safe stringify implementations. This one has proven to handle the most edge cases.
// Be very careful if considering switching out the underlying library to a different one!
import fastStringify from 'safe-stable-stringify';

export type StringifiedJSON = string;

export const safeStringify = (
  value: unknown,
  replacer?: (key: string, value: unknown) => unknown | (number | string)[] | null,
  space?: string | number,
): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }

  try {
    // try regular stringify first as mentioned in this tip:
    // https://github.com/davidmarkclements/fast-safe-stringify#protip
    return JSON.stringify(value, replacer, space);
  } catch {
    return fastStringify(value, replacer, space);
  }
};

export const safeStringifyBranded = <T>(value: T): StringifiedJSONBranded<T> => {
  return safeStringify(value) as StringifiedJSONBranded<T>;
};

type JSONPrimitive = string | number | boolean | null;

// Use type instead of interface to avoid circular reference
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONArray = JSONValue[];

// Define JSONValue after the other types
type JSONValue = JSONPrimitive | JSONObject | JSONArray;

// Utility type for stringified JSON
export type StringifiedJSONBranded<T> = string & {
  __brand: 'StringifiedJSON';
  __type: T;
};

export type ParsedFromBranded<T extends StringifiedJSONBranded<any>> = T['__type'];
