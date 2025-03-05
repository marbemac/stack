import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { focusStyles, inputFocusStyles } from '../utils/focus.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';
import { formSizes } from '../utils/size.ts';

export type ButtonStyleProps = VariantProps<typeof buttonStyle>;
export type ButtonSlots = VariantSlots<typeof buttonStyle.slots>;
export type ButtonSlotProps = SlotProp<ButtonSlots>;

export const buttonStaticClass = makeStaticClass<ButtonSlots>('button');

export const buttonStyle = tv(
  {
    slots: {
      base: tx(
        `group inline-flex max-w-full transform-gpu cursor-pointer select-none appearance-none items-center
        justify-center whitespace-nowrap font-medium placeholder-shown:text-muted motion-safe:transition`,
      ),

      startIcon: tx('[display:inherit]'),

      endIcon: tx('text-[0.8em] [display:inherit]'),

      text: tx('overflow-hidden'),
    },
    defaultVariants: {
      size: 'md',
      variant: 'solid',
      intent: 'neutral',
      fullWidth: false,
      disabled: false,
      isLoading: false,
    },
    variants: {
      variant: {
        solid: {},
        soft: {},
        outline: tx('shadow-border'),
        ghost: {},
      },
      intent: {
        neutral: {},
        primary: {},
        danger: {},
      },
      size: {
        sm: {
          base: formSizes.sm,
          icon: tx('text-[0.9em]'),
        },
        md: formSizes.md,
        lg: formSizes.lg,
      },
      fullWidth: {
        true: tx('w-full'),
      },
      disabled: {
        true: tx('pointer-events-none select-none opacity-50'),
      },
      input: {
        true: tx('font-normal', inputFocusStyles),
        false: tx(focusStyles),
      },
      isLoading: {
        true: tx('pointer-events-none select-none opacity-80'),
      },
    },
    compoundVariants: [
      // outline / input
      {
        variant: 'outline',
        input: true,
        class: tx('bg-surface'),
      },

      // outline / intent
      {
        variant: 'outline',
        intent: 'neutral',
        class: tx('text-neutral shadow-neutral-line-1'),
      },
      {
        variant: 'outline',
        intent: 'primary',
        class: tx('text-primary shadow-primary-line-1'),
      },
      {
        variant: 'outline',
        intent: 'danger',
        class: tx('text-danger shadow-danger-line-1'),
      },

      // outline / intent / isInteractive
      {
        variant: 'outline',
        intent: 'neutral',
        disabled: false,
        isLoading: false,
        input: false,
        class: tx('hover:bg-neutral-soft-1-a hover:shadow-neutral-line-2 active:bg-neutral-soft-2-a'),
      },
      {
        variant: 'outline',
        intent: 'primary',
        disabled: false,
        isLoading: false,
        input: false,
        class: tx('hover:bg-primary-soft-1-a hover:shadow-primary-line-2 active:bg-primary-soft-2-a'),
      },
      {
        variant: 'outline',
        intent: 'danger',
        disabled: false,
        isLoading: false,
        input: false,
        class: tx('hover:bg-danger-soft-1-a hover:shadow-danger-line-2 active:bg-danger-soft-2-a'),
      },

      // solid / intent
      {
        variant: 'solid',
        intent: 'neutral',
        class: tx('bg-neutral-1-a text-on-neutral'),
      },
      {
        variant: 'solid',
        intent: 'primary',
        class: tx('bg-primary-1-a text-on-primary'),
      },
      {
        variant: 'solid',
        intent: 'danger',
        class: tx('bg-danger-1-a text-on-danger'),
      },

      // solid / intent / isInteractive
      {
        variant: 'solid',
        intent: 'neutral',
        disabled: false,
        isLoading: false,
        class: tx('hover:bg-neutral-2-a active:bg-neutral-3-a'),
      },
      {
        variant: 'solid',
        intent: 'primary',
        disabled: false,
        isLoading: false,
        class: tx('hover:bg-primary-2-a active:bg-primary-3-a'),
      },
      {
        variant: 'solid',
        intent: 'danger',
        disabled: false,
        isLoading: false,
        class: tx('hover:bg-danger-2-a active:bg-danger-3-a'),
      },

      // soft / intent
      {
        variant: 'soft',
        intent: 'neutral',
        class: tx('bg-neutral-soft-1-a text-neutral'),
      },
      {
        variant: 'soft',
        intent: 'primary',
        class: tx('bg-primary-soft-1-a text-primary'),
      },
      {
        variant: 'soft',
        intent: 'danger',
        class: tx('bg-danger-soft-1-a text-danger'),
      },

      // soft / intent / isInteractive
      {
        variant: 'soft',
        intent: 'neutral',
        disabled: false,
        isLoading: false,
        class: tx('hover:bg-neutral-soft-2-a active:bg-neutral-soft-3-a'),
      },
      {
        variant: 'soft',
        intent: 'primary',
        disabled: false,
        isLoading: false,
        class: tx('hover:bg-primary-soft-2-a active:bg-primary-soft-3-a'),
      },
      {
        variant: 'soft',
        intent: 'danger',
        disabled: false,
        isLoading: false,
        class: tx('hover:bg-danger-soft-2-a active:bg-danger-soft-3-a'),
      },

      // ghost / intent
      {
        variant: 'ghost',
        intent: 'neutral',
        class: tx('text-neutral'),
      },
      {
        variant: 'ghost',
        intent: 'primary',
        class: tx('text-primary'),
      },
      {
        variant: 'ghost',
        intent: 'danger',
        class: tx('text-danger'),
      },

      // ghost / intent / isInteractive
      {
        variant: 'ghost',
        intent: 'neutral',
        disabled: false,
        isLoading: false,
        class: tx('hover:bg-neutral-soft-1-a active:bg-neutral-soft-2-a'),
      },
      {
        variant: 'ghost',
        intent: 'primary',
        disabled: false,
        isLoading: false,
        class: tx('hover:bg-primary-soft-1-a active:bg-primary-soft-2-a'),
      },
      {
        variant: 'ghost',
        intent: 'danger',
        disabled: false,
        isLoading: false,
        class: tx('hover:bg-danger-soft-1-a active:bg-danger-soft-2-a'),
      },
    ],
  },
  {
    twMergeConfig,
  },
);

/**
 * ButtonGroup
 */

export type ButtonGroupStyleProps = VariantProps<typeof buttonGroupStyle>;
export type ButtonGroupSlots = VariantSlots<typeof buttonGroupStyle.slots>;
export type ButtonGroupSlotProps = SlotProp<ButtonGroupSlots>;

export const buttonGroupStaticClass = makeStaticClass<ButtonGroupSlots>('button-group');

export const buttonGroupStyle = tv(
  {
    slots: {
      base: tx(''),
    },
    variants: {
      fullWidth: {
        true: tx('w-full'),
      },
      isAttached: {
        true: tx(
          // ... These are ugly - COULD move them to dedicated classes in the tailwind plugin... but not a huge deal.
          '[&>_*:first-of-type:not(:last-of-type)]:rounded-e-none',
          '[&>_*:not(:first-of-type):not(:last-of-type)]:rounded-none',
          '[&>_*:not(:first-of-type):last-of-type]:rounded-s-none',
          '[&>_*:not(:last-of-type)]:-me-px',
        ),
      },
    },
    defaultVariants: {
      fullWidth: false,
      isAttached: false,
    },
  },
  {
    twMergeConfig,
  },
);
