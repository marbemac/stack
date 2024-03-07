import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type HeadingStyleProps = VariantProps<typeof headingStyle>;
export type HeadingSlots = VariantSlots<typeof headingStyle.slots>;
export type HeadingSlotProps = SlotProp<HeadingSlots>;

export const headingStaticClass = makeStaticClass<HeadingSlots>('heading');

export const headingStyle = tv(
  {
    slots: {
      base: tx(''),
    },
    defaultVariants: {
      size: 6,
    },
    variants: {
      size: {
        1: tx('text-sm font-medium leading-2'),
        2: tx('text-base font-medium leading-2'),
        3: tx('text-lg font-medium leading-3'),
        4: tx('text-xl font-medium leading-4'),
        5: tx('text-2xl font-semibold leading-5'),
        6: tx('text-3xl font-bold leading-6'),
        7: tx('text-4xl font-bold leading-7'),
        8: tx('text-5xl font-extrabold leading-8'),
        9: tx('text-7xl font-extrabold leading-9'),
      },
      trim: {
        normal: tx('leading-trim-normal'),
        start: tx('leading-trim-start'),
        end: tx('leading-trim-end'),
        both: tx('leading-trim-both'),
      },
    },
  },
  {
    twMergeConfig,
  },
);
