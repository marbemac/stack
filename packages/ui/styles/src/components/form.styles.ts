import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type FormStyleProps = VariantProps<typeof formStyle>;
export type FormSlots = VariantSlots<typeof formStyle.slots>;
export type FormSlotProps = SlotProp<FormSlots>;

export const formStaticClass = makeStaticClass<FormSlots>('form');

export const formStyle = tv(
  {
    slots: {
      base: tx('flex flex-col'),

      field: tx('flex w-full flex-col'),
      fieldHeader: tx('flex items-center justify-between gap-4'),
      fieldLabel: tx('ps-px'),
      fieldError: tx('text-end text-sm text-danger'),
      fieldHint: tx('ps-px text-sm text-muted'),
    },

    defaultVariants: {
      size: 'md',
    },

    variants: {
      size: {
        sm: {
          base: tx('gap-5'),
          field: tx('gap-1.5'),
          fieldError: tx('text-xs'),
          fieldHint: tx('text-xs'),
        },
        md: {
          base: tx('gap-6'),
          field: tx('gap-1.5'),
        },
        lg: {
          base: tx('gap-7'),
          field: tx('gap-2'),
        },
      },
    },
  },
  {
    twMergeConfig,
  },
);
