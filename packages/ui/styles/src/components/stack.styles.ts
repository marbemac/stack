import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { tw } from '../tw.ts';

/**
 * Stack component styles
 *
 * @example
 *
 * const c = stackStyle({ dir: 'vertical', spacing: 2 })
 *
 * <div className={c} />
 */
const stackStyle = tv({
  slots: {
    base: tw('flex'),
    divider: tw('self-stretch border-muted'),
  },

  defaultVariants: {
    dir: 'vertical',
  },

  variants: {
    dir: {
      vertical: {
        base: tw('flex-col'),
        divider: tw('border-t'),
      },
      verticalReverse: {
        base: tw('flex-col-reverse'),
        divider: tw('border-t'),
      },
      horizontal: {
        divider: tw('border-l'),
      },
      horizontalReverse: {
        base: tw('flex-row-reverse'),
        divider: tw('border-l'),
      },
    },

    spacing: {
      0: tw('gap-0'),
      0.5: tw('gap-0.5'),
      1: tw('gap-1'),
      1.5: tw('gap-1.5'),
      2: tw('gap-2'),
      2.5: tw('gap-2.5'),
      3: tw('gap-3'),
      3.5: tw('gap-3.5'),
      4: tw('gap-4'),
      5: tw('gap-5'),
      6: tw('gap-6'),
      7: tw('gap-7'),
      8: tw('gap-8'),
      9: tw('gap-9'),
      10: tw('gap-10'),
      11: tw('gap-11'),
      12: tw('gap-12'),
      14: tw('gap-14'),
      16: tw('gap-16'),
      18: tw('gap-18'),
      20: tw('gap-20'),
      24: tw('gap-24'),
      28: tw('gap-28'),
      32: tw('gap-32'),
      36: tw('gap-36'),
      40: tw('gap-40'),
      44: tw('gap-44'),
      48: tw('gap-48'),
      52: tw('gap-52'),
      56: tw('gap-56'),
      60: tw('gap-60'),
    },
  },
});

export type StackStyleProps = VariantProps<typeof stackStyle>;

export { stackStyle };
