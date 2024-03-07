import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type StackStyleProps = VariantProps<typeof stackStyle>;
export type StackSlots = VariantSlots<typeof stackStyle.slots>;
export type StackSlotProps = SlotProp<StackSlots>;

export const stackStaticClass = makeStaticClass<StackSlots>('stack');

export const stackStyle = tv(
  {
    slots: {
      base: tx('flex'),
      divider: tx('self-stretch border-neutral-line-1/60'),
    },

    defaultVariants: {
      dir: 'vertical',
    },

    variants: {
      dir: {
        vertical: {
          base: tx('flex-col'),
          divider: tx('border-t'),
        },
        verticalReverse: {
          base: tx('flex-col-reverse'),
          divider: tx('border-t'),
        },
        horizontal: {
          divider: tx('border-l'),
        },
        horizontalReverse: {
          base: tx('flex-row-reverse'),
          divider: tx('border-l'),
        },
      },

      spacing: {
        0: tx('gap-0'),
        0.5: tx('gap-0.5'),
        1: tx('gap-1'),
        1.5: tx('gap-1.5'),
        2: tx('gap-2'),
        2.5: tx('gap-2.5'),
        3: tx('gap-3'),
        3.5: tx('gap-3.5'),
        4: tx('gap-4'),
        5: tx('gap-5'),
        6: tx('gap-6'),
        7: tx('gap-7'),
        8: tx('gap-8'),
        9: tx('gap-9'),
        10: tx('gap-10'),
        11: tx('gap-11'),
        12: tx('gap-12'),
        14: tx('gap-14'),
        16: tx('gap-16'),
        18: tx('gap-18'),
        20: tx('gap-20'),
        24: tx('gap-24'),
        28: tx('gap-28'),
        32: tx('gap-32'),
        36: tx('gap-36'),
        40: tx('gap-40'),
        44: tx('gap-44'),
        48: tx('gap-48'),
        52: tx('gap-52'),
        56: tx('gap-56'),
        60: tx('gap-60'),
      },

      center: {
        false: {},
        true: tx('items-center justify-center'),
        y: {},
        x: {},
      },

      stretch: {
        false: {},
        true: tx('items-stretch'),
      },
    },

    compoundVariants: [
      {
        center: 'y',
        dir: ['horizontal', 'horizontalReverse'],
        class: tx('items-center'),
      },
      {
        center: 'x',
        dir: ['horizontal', 'horizontalReverse'],
        class: tx('justify-center'),
      },
      {
        center: 'y',
        dir: ['vertical', 'verticalReverse'],
        class: tx('justify-center'),
      },
      {
        center: 'x',
        dir: ['vertical', 'verticalReverse'],
        class: tx('items-center'),
      },
    ],
  },
  {
    twMergeConfig,
  },
);
