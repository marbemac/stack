import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { tx } from '../tw.ts';
import type { VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

/**
 * Icon component styles
 *
 * @example
 *
 * const c = iconStyle({ spin: true })
 *
 * <i className={c} />
 */
export const iconStyle = tv({
  slots: {
    base: tx('h-[1em]'),
  },

  defaultVariants: {
    fw: false,
    spin: false,
    ping: false,
    pulse: false,
    bounce: false,
  },

  variants: {
    fw: {
      true: tx('w-[1.25em] text-center'),
    },

    spin: {
      true: tx('animate-spin-slow'),
    },

    ping: {
      true: tx('animate-ping'),
    },

    pulse: {
      true: tx('animate-pulse'),
    },

    bounce: {
      true: tx('animate-bounce'),
    },
  },
});

export type IconStyleProps = VariantProps<typeof iconStyle>;
export type IconSlots = VariantSlots<typeof iconStyle.slots>;

export const iconStaticClass = makeStaticClass<IconSlots>('icon');
