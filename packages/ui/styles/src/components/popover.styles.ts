import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type PopoverStyleProps = VariantProps<typeof popoverStyle>;
export type PopoverSlots = VariantSlots<typeof popoverStyle.slots>;
export type PopoverSlotProps = SlotProp<PopoverSlots>;

export const popoverStaticClass = makeStaticClass<PopoverSlots>('popover');

export const popoverStyle = tv(
  {
    slots: {
      base: tx(
        'z-30 rounded bg-panel bg-clip-padding p-3 shadow-md ring-1 ring-neutral-soft-1-a animate-popper',
        'max-h-[inherit] max-w-[min(calc(100vw-16px),320px)]',
      ),

      arrow: tx('fill-panel stroke-neutral-line-2 stroke-2'),
    },
    defaultVariants: {},
    variants: {},
  },
  {
    twMergeConfig,
  },
);
