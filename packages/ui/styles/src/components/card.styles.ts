import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type CardStyleProps = VariantProps<typeof cardStyle>;
export type CardSlots = VariantSlots<typeof cardStyle.slots>;
export type CardSlotProps = SlotProp<CardSlots>;

export const cardStaticClass = makeStaticClass<CardSlots>('card');

export const cardStyle = tv(
  {
    slots: {
      base: tx('relative reset-a reset-button'),
      inner: tx('overflow-hidden rounded-inherit bg-panel-a'),
    },

    defaultVariants: {
      size: 'md',
      variant: 'outline',
    },

    variants: {
      variant: {
        outline: {
          inner: tx('shadow-border'),
        },
        ghost: {},
      },

      isInteractive: {
        true: {},
      },
      size: {
        sm: {
          base: tx('rounded'),
          inner: tx('p-3'),
        },
        md: {
          base: tx('rounded-lg'),
          inner: tx('p-4'),
        },
        lg: {
          base: tx('rounded-xl'),
          inner: tx('p-6'),
        },
      },
    },

    compoundVariants: [
      {
        variant: 'outline',
        isInteractive: true,
        class: tx('hover:shadow-neutral-soft-2 active:shadow-neutral-soft-1'),
      },
      {
        variant: 'ghost',
        isInteractive: true,
        class: tx('hover:bg-neutral-soft-1 active:bg-neutral-soft-2'),
      },
    ],
  },
  {
    twMergeConfig,
  },
);
