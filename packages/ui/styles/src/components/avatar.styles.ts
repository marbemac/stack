import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type AvatarStyleProps = VariantProps<typeof avatarStyle>;
export type AvatarSlots = VariantSlots<typeof avatarStyle.slots>;
export type AvatarSlotProps = SlotProp<AvatarSlots>;

export const avatarStaticClass = makeStaticClass<AvatarSlots>('avatar');

export const avatarStyle = tv(
  {
    slots: {
      base: tx('inline-flex shrink-0 select-none items-center justify-center rounded'),
      image: tx('size-full rounded-inherit object-cover'),
      fallback: tx(
        'z-0 flex size-full items-center justify-center rounded-inherit font-medium uppercase leading-none',
        'bg-primary-soft-1 text-primary',
      ),
    },
    defaultVariants: {
      size: 'md',
    },
    variants: {
      size: {
        sm: tx('h-form-sm w-form-sm text-sm'),
        md: tx('h-form-md w-form-md text-base'),
        lg: tx('h-form-lg w-form-lg text-base'),
        xl: tx('h-form-xl w-form-xl rounded-lg text-lg'),
        '2xl': tx('h-form-2xl w-form-2xl rounded-xl text-xl'),
      },
    },
  },
  {
    twMergeConfig,
  },
);
