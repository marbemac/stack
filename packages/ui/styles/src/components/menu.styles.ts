import { tv, type VariantProps } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';
import { listBoxStyle } from './bases/list-box.ts';

export type MenuStyleProps = VariantProps<typeof menuStyle>;
export type MenuSlots = VariantSlots<typeof menuStyle.slots & typeof listBoxStyle.slots>;
export type MenuSlotProps = SlotProp<MenuSlots>;

export const menuStaticClass = makeStaticClass<MenuSlots>('menu');

export const menuStyle = tv(
  {
    extend: listBoxStyle,

    slots: {
      //   @apply sticky
      // bg-inherit
      // top-0
      // p-1
      // z-10
      // [&~*]:[--combobox-height:theme(spacing.11)]
      // sm:[&~*]:[--combobox-height:theme(spacing.9)];
      comboboxWrapper: tx('sticky top-0 z-10 bg-panel pb-2', '[&~*]:[--combobox-height:theme(spacing.11)]'),
    },

    variants: {
      size: {},
    },
  },
  {
    twMergeConfig,
  },
);
