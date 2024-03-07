import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { focusStyles } from '../utils/focus.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type TabsStyleProps = VariantProps<typeof tabsStyle>;
export type TabsSlots = VariantSlots<typeof tabsStyle.slots>;
export type TabsSlotProps = SlotProp<TabsSlots>;

export const tabsStaticClass = makeStaticClass<TabsSlots>('tabs');

const triggerInnerSharedTx = tx('flex items-center justify-center', 'rounded px-2 py-1');

export const tabsStyle = tv(
  {
    slots: {
      list: tx(),

      tab: tx('group'),

      tabInner: tx('absolute'),

      tabInnerHidden: tx('invisible'),

      panels: tx(),

      panel: tx(focusStyles),
    },

    defaultVariants: {
      animate: false,
      variant: 'line',
    },

    variants: {
      variant: {
        unstyled: {},

        line: {
          list: tx('flex h-10 gap-2 overflow-x-auto whitespace-nowrap'),

          tab: tx(
            'relative flex shrink-0 cursor-default select-none items-center justify-center outline-none',
            'px-1.5 text-base',
            'text-muted aria-selected:text-fg hover:text-fg',
            'aria-selected:before:h-[2px]',
            'aria-selected:before:absolute',
            'aria-selected:before:bottom-0',
            'aria-selected:before:inset-x-0',
            'aria-selected:before:bg-primary-1-a',
          ),

          tabInner: tx(
            triggerInnerSharedTx,
            'group-hover:bg-neutral-soft-1',
            'group-focus-visible:shadow-[0_0_0_2px] group-focus-visible:shadow-primary-1-a',
            'group-aria-selected:font-medium',
            'group-aria-selected:tracking-[-0.01em]',
          ),

          /**
           * Separate hidden from inner so that there is no horizontal shifting on screen
           * as user changes active tab and amount of bold text changes
           */
          tabInnerHidden: tx(triggerInnerSharedTx, 'font-medium'),

          panels: tx('px-3.5 py-3'),
        },
      },
    },
  },
  {
    twMergeConfig,
  },
);
