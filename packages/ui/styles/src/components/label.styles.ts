import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type LabelStyleProps = VariantProps<typeof labelStyle>;
export type LabelSlots = VariantSlots<typeof labelStyle.slots>;
export type LabelSlotProps = SlotProp<LabelSlots>;

export const labelStaticClass = makeStaticClass<LabelSlots>('label');

export const labelStyle = tv(
  {
    slots: {
      base: tx(
        `w-fit cursor-default text-base font-medium leading-trim-start peer-disabled:cursor-not-allowed
        peer-disabled:opacity-70`,
      ),
    },

    variants: {
      size: {
        sm: {
          base: tx('text-sm'),
        },
        md: {
          base: tx('text-base'),
        },
        lg: {
          base: tx('text-lg'),
        },
      },

      disabled: {
        true: {
          base: tx('opacity-85'),
        },
      },
    },
  },
  {
    twMergeConfig,
  },
);
