import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { tx } from '../tw.ts';
import type { VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export const labelStyle = tv({
  slots: {
    base: tx('font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'),
  },

  variants: {},
});

export type LabelStyleProps = VariantProps<typeof labelStyle>;
export type LabelSlots = VariantSlots<typeof labelStyle.slots>;

export const labelStaticClass = makeStaticClass<LabelSlots>('label');
