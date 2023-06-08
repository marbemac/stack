import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { tw } from '../tw.ts';

/**
 * Icon component styles
 *
 * @example
 *
 * const c = iconStyle({ spin: true })
 *
 * <i className={c} />
 */
const iconStyle = tv({
  slots: {
    base: tw('h-[1em]'),
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
      true: tw('w-[1.25em] text-center'),
    },

    spin: {
      true: tw('animate-spin-slow'),
    },

    ping: {
      true: tw('animate-ping'),
    },

    pulse: {
      true: tw('animate-pulse'),
    },

    bounce: {
      true: tw('animate-bounce'),
    },
  },
});

export type IconStyleProps = VariantProps<typeof iconStyle>;

export { iconStyle };
