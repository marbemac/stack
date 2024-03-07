import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { VariantSlots } from '../types.ts';
import { focusWithinStyles } from '../utils/focus.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type AccordionStyleProps = VariantProps<typeof accordionStyle>;
export type AccordionSlots = VariantSlots<typeof accordionStyle.slots>;

export const accordionStaticClass = makeStaticClass<AccordionSlots>('accordion');

export const accordionStyle = tv(
  {
    slots: {
      base: '',

      item: tx('mt-px first:mt-0 first:rounded-t last:rounded-b', focusWithinStyles),

      trigger: tx(
        'group flex flex-1 cursor-default items-center justify-between py-3 font-medium outline-none transition-all',
      ),

      triggerIcon: tx('shrink-0 text-sm transition-transform duration-200 group-data-[state=open]:rotate-180'),

      content: tx(
        'overflow-hidden text-base transition-all',
        'data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down',
      ),
    },

    variants: {},
  },
  {
    twMergeConfig,
  },
);
