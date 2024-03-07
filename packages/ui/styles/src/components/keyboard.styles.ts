import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type KeyboardStyleProps = VariantProps<typeof keyboardStyle>;
export type KeyboardSlots = VariantSlots<typeof keyboardStyle.slots>;
export type KeyboardSlotProps = SlotProp<KeyboardSlots>;

export const keyboardStaticClass = makeStaticClass<KeyboardSlots>('keyboard');

export const keyboardStyle = tv(
  {
    slots: {
      base: tx(),
    },
    defaultVariants: {},
    variants: {},
  },
  {
    twMergeConfig,
  },
);
