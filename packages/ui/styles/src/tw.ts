import { type ClassNameValue, extendTailwindMerge, twJoin as cx } from 'tailwind-merge';

type ClassValue = ClassArray | ClassDictionary | string | number | bigint | null | boolean | undefined;
type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];

export type TW_STR = 'TW_STR';

/**
 * Simple template literal tag for tailwind classes (eslint and vscode are configured to check / autocomplete this fn).
 *
 * Use when all you need is autocomplete, with no need for the full power of `cx` / `twMerge`.
 *
 * @example
 * const className = tw`text-primary p-4`;
 */
function tw(strings: TemplateStringsArray, ...interpolations: string[]) {
  return strings
    .map((string, i) => string + (interpolations[i] || ''))
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * cx that expects tailwind classes (eslint and vscode are configured to check / autocomplete this fn).
 *
 * Use when you need the full power of `cx` / `twMerge`. Otherwise, use `tw`.
 */
const tx = cx as (...classLists: ClassNameValue[]) => TW_STR;

/**
 * Supports all the same arguments as `tx`, but also supports nested arrays and objects.
 *
 * Internally it uses `txMerge(tx(...))`.
 *
 * When you can't decide between the confusing `tw` and `tx` functions, use this one.
 */
const cn = (...classNames: ClassValue[]) => {
  const groups: ClassNameValue[] = classNames.flatMap(className => {
    if (Array.isArray(className)) {
      return cn(...className);
    }

    if (className && typeof className === 'object') {
      return Object.entries(className).map(([key, value]) => {
        if (value) {
          return key;
        }
      });
    }

    if (typeof className === 'string') {
      return className;
    }

    return [];
  });

  return txMerge(tx(...groups)) as TW_STR;
};

/**
 * Optionally customize the twMerge config. Use this everywhere!
 * Do not use the default twMerge from `tailwind-merge` directly.
 *
 * Named txMerge rather than twMerge to clarify.
 *
 * https://github.com/dcastil/tailwind-merge/blob/v2.0.0/docs/configuration.md
 */
export const twMergeConfig: Partial<Parameters<typeof extendTailwindMerge>[0]> = {
  extend: {
    // ↓ Add values to existing theme scale or create a new one
    // spacing: ['sm', 'md', 'lg'],
    theme: {
      spacing: ['form-sm', 'form-md', 'form-lg', 'form-xl', 'form-2xl'],
    },

    // // ↓ Add values to existing class groups or define new ones
    // classGroups: {
    //     foo: ['foo', 'foo-2', { 'bar-baz': ['', '1', '2'] }],
    //     bar: [{ qux: ['auto', (value) => Number(value) >= 1000] }],
    //     baz: ['baz-sm', 'baz-md', 'baz-lg'],
    // },
    classGroups: {
      shadow: [{ shadow: ['border'] }],
    },

    // // ↓ Here you can define additional conflicts across class groups
    // conflictingClassGroups: {
    //     foo: ['bar'],
    // },

    // // ↓ Define conflicts between postfix modifiers and class groups
    // conflictingClassGroupModifiers: {
    //     baz: ['bar'],
    // },
  },
};
const txMerge = extendTailwindMerge(twMergeConfig);

export type { ClassNameValue };
export { cn, cx, tw, tx, txMerge };
