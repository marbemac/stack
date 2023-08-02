import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { tx } from '../tw.ts';
import type { VariantSlots } from '../types.ts';
import { inputFocusStyles } from '../utils/focus.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';
import { formSizes } from '../utils/size.ts';

const inputStyles = tx(
  'w-full appearance-none border',
  'placeholder:text-fg-muted',
  'disabled:cursor-not-allowed disabled:opacity-50',
  inputFocusStyles,
);

const baseIconStyles = tx('pointer-events-none absolute inset-y-0 flex items-center justify-center text-fg-muted');

export const inputStyle = tv({
  slots: {
    base: tx('group relative flex items-center'),
    input: inputStyles,
    textarea: tx(inputStyles, 'h-full resize'),
    startIcon: tx(baseIconStyles, 'left-0'),
    endIcon: tx(baseIconStyles, 'right-0'),
    startSection: tx('absolute inset-y-0 left-0 flex items-center'),
    endSection: tx('absolute inset-y-0 right-0 flex items-center'),
  },

  defaultVariants: {
    variant: 'outline',
    size: 'md',
    isDisabled: false,
  },

  variants: {
    variant: {
      outline: {},
      ghost: {
        input: tx('border-transparent'),
      },
    },

    size: {
      sm: {
        input: formSizes.sm,
        startIcon: tx('w-7 text-sm'),
        endIcon: tx('w-7 text-sm'),
      },
      md: {
        input: formSizes.md,
        startIcon: tx('w-9 text-base'),
        endIcon: tx('w-9 text-base'),
      },
      lg: {
        input: formSizes.lg,
        startIcon: tx('w-11 text-base'),
        endIcon: tx('w-11 text-base'),
      },
    },

    isDisabled: { true: '' },
    hasStartIcon: { true: '' },
    hasEndIcon: { true: '' },
    hasSection: { true: '' },
  },

  compoundSlots: [
    {
      slots: ['startIcon', 'endIcon'],
      isDisabled: true,
      class: tx('pointer-events-none opacity-50'),
    },
  ],

  compoundVariants: [
    // icon + size + input
    {
      hasStartIcon: true,
      size: 'sm',
      class: {
        input: tx('pl-6'),
      },
    },
    {
      hasStartIcon: true,
      size: 'md',
      class: {
        input: tx('pl-8'),
      },
    },
    {
      hasStartIcon: true,
      size: 'lg',
      class: {
        input: tx('pl-10'),
      },
    },
    {
      hasEndIcon: true,
      size: 'sm',
      class: {
        input: tx('pr-6'),
      },
    },
    {
      hasEndIcon: true,
      size: 'md',
      class: {
        input: tx('pr-8'),
      },
    },
    {
      hasEndIcon: true,
      size: 'lg',
      class: {
        input: tx('pr-10'),
      },
    },
  ],
});

export type InputStyleProps = VariantProps<typeof inputStyle>;
export type InputSlots = VariantSlots<typeof inputStyle.slots>;

export const inputStaticClass = makeStaticClass<InputSlots>('input');
