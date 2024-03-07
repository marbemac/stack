import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';
import { listBoxStyle } from './bases/list-box.ts';

export type SelectStyleProps = VariantProps<typeof selectStyle>;
export type SelectSlots = VariantSlots<typeof selectStyle.slots & typeof listBoxStyle.slots>;
export type SelectSlotProps = SlotProp<SelectSlots>;

export const selectStaticClass = makeStaticClass<SelectSlots>('select');

export const selectStyle = tv(
  {
    extend: listBoxStyle,

    slots: {
      base: tx('group flex flex-col place-items-start gap-1'),
      list: tx('max-h-[min(var(--popover-available-height,400px),400px)] min-w-[--popover-anchor-width]'),
    },

    variants: {
      size: {},
    },
  },
  {
    twMergeConfig,
  },
);
