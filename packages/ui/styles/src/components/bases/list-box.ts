import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../../tw.ts';

/**
 * Base styles for all list-box style components (Select, Menu, etc).
 *
 * Contains a superset of slots for the generic list-box use case.
 */
export const listBoxStyle = tv(
  {
    slots: {
      popover: tx('z-30 bg-panel bg-clip-padding outline-none ring-1 ring-neutral-soft-1-a animate-popper'),
      arrow: tx('fill-panel stroke-neutral-line-2 stroke-2'),

      list: tx(
        'h-full overflow-auto overscroll-contain',
        'max-h-[min(500px,var(--popover-available-height))] min-w-[max(180px,var(--popover-anchor-width))]',
      ),

      item: tx(
        `flex cursor-default select-none items-center rounded outline-none disabled:pointer-events-none
        disabled:opacity-40 active:bg-primary-1 active:text-on-primary`,

        /**
         * We are using sticky for group titles and combo box inputs.
         * This ensures that the scroll snaps up/down enough to show the item when user is scrolling
         * via keyboard to top or bottom of the scrollport.
         */
        'scroll-m-2 scroll-mt-[calc(var(--combobox-height,_0px)+var(--label-height,_32px))]',
      ),

      itemIndicator: tx('pointer-events-none flex items-center text-[0.8em]'),
      itemStartIcon: tx('flex items-center text-[0.9em] leading-none'),
      itemContent: tx('flex flex-1 truncate pr-6'),
      itemEndIcon: tx('ms-auto text-[0.75em] opacity-80'),
      itemShortcut: tx('ms-auto text-[0.75em] tracking-widest opacity-60'),

      group: tx(),
      groupTitle: tx(
        `sticky -top-1.5 select-none truncate bg-panel-a py-1.5 text-sm font-light uppercase tracking-tight text-muted
        backdrop-blur-sm`,
      ),

      separator: tx('h-px bg-neutral-line-1-a'),
    },

    defaultVariants: {
      size: 'md',
    },

    variants: {
      size: {
        sm: {
          popover: tx('rounded-sm shadow-sm'),
          list: tx('p-1 text-sm'),
          item: tx('h-6 gap-1 px-1.5'),
          group: tx(),
          groupTitle: tx('px-1.5', 'text-xs'),
          separator: tx('mx-1 my-1.5'),
        },
        md: {
          popover: tx('rounded shadow-md'),
          list: tx('p-1.5 text-base'),
          item: tx('h-7 gap-1.5 px-1.5'),
          group: tx(),
          groupTitle: tx('px-1.5'),
          separator: tx('mx-1 my-2'),
        },
        lg: {
          popover: tx('rounded-lg shadow-md'),
          list: tx('p-2 text-base'),
          item: tx('h-8 gap-2 px-2.5'),
          group: tx(),
          groupTitle: tx('px-2.5'),
          separator: tx('mx-1.5 my-2'),
        },
      },
    },
  },
  {
    twMergeConfig,
  },
);
