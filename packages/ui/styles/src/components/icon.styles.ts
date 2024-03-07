import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type IconStyleProps = VariantProps<typeof iconStyle>;
export type IconSlots = VariantSlots<typeof iconStyle.slots>;
export type IconSlotProps = SlotProp<IconSlots>;

export const iconStaticClass = makeStaticClass<IconSlots>('icon');

export const iconStyle = tv(
  {
    slots: {
      base: tx('h-[1em] leading-none'),
    },

    defaultVariants: {
      fw: false,
      spin: false,
      ping: false,
      pulse: false,
      bounce: false,
    },

    variants: {
      fw: {
        true: tx('w-[1.25em] text-center'),
      },

      spin: {
        true: tx('animate-spin-slow'),
      },

      ping: {
        true: tx('animate-ping'),
      },

      pulse: {
        true: tx('animate-pulse'),
      },

      bounce: {
        true: tx('animate-bounce'),
      },
    },
  },
  {
    twMergeConfig,
  },
);
