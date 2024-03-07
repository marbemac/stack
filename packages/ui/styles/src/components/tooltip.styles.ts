import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type TooltipStyleProps = VariantProps<typeof tooltipStyle>;
export type TooltipSlots = VariantSlots<typeof tooltipStyle.slots>;
export type TooltipSlotProps = SlotProp<TooltipSlots>;

export const tooltipStaticClass = makeStaticClass<TooltipSlots>('tooltip');

export const tooltipStyle = tv(
  {
    slots: {
      base: tx('rounded-sm bg-canvas-emphasis px-2 py-1 animate-popper'),
      text: tx('cursor-default select-none text-sm text-on-emphasis'),
      arrow: tx('fill-canvas-emphasis'),
    },

    defaultVariants: {
      multiline: true,
    },

    variants: {
      multiline: {
        true: tx('max-w-xs'),
      },
    },
  },
  {
    twMergeConfig,
  },
);
