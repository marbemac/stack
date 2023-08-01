import type * as CSS from 'csstype';

import type { ClassNameValue } from './tw.ts';

export type TwProp = ClassNameValue;

export type StyleProps = {
  /**
   * Type-safe styling using tailwind classes.
   */
  tw?: TwProp;

  /**
   * Escape hatch if non-tailwind classes are needed (3rd party integration, etc).
   */
  UNSAFE_class?: ClassNameValue;

  /**
   * Arbitrary css - mostly used for theming.
   *
   * Note! Your StylePropsResolver must support the css prop - the default resolver does not.
   */
  css?: CSSObject | string | TemplateStringsArray;
};

export type StylePropsResolver = (props: StyleProps) => string | undefined;

export interface SlotProp<T extends string> {
  /** CSS classes to be passed to the component slots. */
  slotClasses?: Partial<Record<T, string>>;
}

export type VariantSlots<V extends {}> = keyof V;

/**
 * Custom subset of what twind supports
 *
 * https://github.com/tw-in-js/twind/blob/main/packages/core/src/types.ts
 */

type Falsey = false | null | undefined | void | '';

type MaybeArray<T> = T | T[];

interface CustomProperties {
  label?: string;
}

type CSSProperties = CSS.PropertiesFallback<string | Falsey, string | Falsey> &
  CSS.PropertiesHyphenFallback<string | Falsey, string | Falsey> &
  Partial<CustomProperties>;

interface CSSNested extends Record<string, CSSProperties | MaybeArray<CSSObject | string> | Falsey> {}

type CSSObject = CSSProperties & CSSNested;
