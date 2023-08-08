import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { tx } from '../tw.ts';
import type { VariantSlots } from '../types.ts';
import { focusStyles } from '../utils/focus.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';
import { formSizes } from '../utils/size.ts';

/**
 * Button component styles
 *
 * @example
 *
 * const c = buttonStyle({ ... })
 *
 * <button className={c} />
 */
export const buttonStyle = tv({
  slots: {
    base: tx(
      'group',
      'select-none appearance-none',
      'inline-flex items-center justify-center',
      'max-w-full cursor-pointer whitespace-nowrap',
      'transform-gpu motion-safe:transition',
      focusStyles,
    ),

    icon: tx('[display:inherit]'),

    text: tx('overflow-hidden'),
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
    intent: 'neutral',
    fullWidth: false,
    isDisabled: false,
    isLoading: false,
    isInteractive: false,
    isInGroup: false,
  },
  variants: {
    variant: {
      solid: {},
      soft: {},
      outline: tx('border'),
      ghost: {},
      inverted: {},
    },
    intent: {
      neutral: {},
      primary: {},
      success: {},
      warning: {},
      danger: {},
    },
    size: {
      sm: formSizes.sm,
      md: formSizes.md,
      lg: formSizes.lg,
    },
    fullWidth: {
      true: tx('w-full'),
    },
    isDisabled: {
      true: tx('opacity-50'),
    },
    isLoading: {
      true: tx('opacity-80'),
    },
    isInteractive: {
      true: {},
      false: tx('pointer-events-none select-none'),
    },
    isInGroup: {
      true: tx('[&:not(:first-child):not(:last-child)]:rounded-none'),
    },
    isIconOnly: {
      true: tx('gap-0 p-0'),
      false: tx('[&>svg]:max-w-[2em]'),
    },
  },
  compoundVariants: [
    // outline / intent
    {
      variant: 'outline',
      intent: 'neutral',
      class: tx('border-input text-neutral'),
    },
    {
      variant: 'outline',
      intent: 'primary',
      class: tx('border-primary text-primary'),
    },
    {
      variant: 'outline',
      intent: 'success',
      class: tx('border-success text-success'),
    },
    {
      variant: 'outline',
      intent: 'warning',
      class: tx('border-warning text-warning'),
    },
    {
      variant: 'outline',
      intent: 'danger',
      class: tx('border-danger text-danger'),
    },

    // outline / intent / isInteractive
    {
      variant: 'outline',
      intent: 'neutral',
      isInteractive: true,
      class: tx('hover:bg-neutral-soft active:bg-neutral-soft-hover'),
    },
    {
      variant: 'outline',
      intent: 'primary',
      isInteractive: true,
      class: tx('hover:bg-primary-soft active:bg-primary-soft-hover'),
    },
    {
      variant: 'outline',
      intent: 'success',
      isInteractive: true,
      class: tx('hover:bg-success-soft active:bg-success-soft-hover'),
    },
    {
      variant: 'outline',
      intent: 'warning',
      isInteractive: true,
      class: tx('hover:bg-warning-soft active:bg-warning-soft-hover'),
    },
    {
      variant: 'outline',
      intent: 'danger',
      isInteractive: true,
      class: tx('hover:bg-danger-soft active:bg-danger-soft-hover'),
    },

    // solid / intent
    {
      variant: 'solid',
      intent: 'neutral',
      class: tx('bg-neutral text-on-neutral'),
    },
    {
      variant: 'solid',
      intent: 'primary',
      class: tx('bg-primary text-on-primary'),
    },
    {
      variant: 'solid',
      intent: 'success',
      class: tx('bg-success text-on-success'),
    },
    {
      variant: 'solid',
      intent: 'warning',
      class: tx('bg-warning text-on-warning'),
    },
    {
      variant: 'solid',
      intent: 'danger',
      class: tx('bg-danger text-on-danger'),
    },

    // solid / intent / isInteractive
    {
      variant: 'solid',
      intent: 'neutral',
      isInteractive: true,
      class: tx('hover:bg-neutral-hover active:bg-neutral-active'),
    },
    {
      variant: 'solid',
      intent: 'primary',
      isInteractive: true,
      class: tx('hover:bg-primary-hover active:bg-primary-active'),
    },
    {
      variant: 'solid',
      intent: 'success',
      isInteractive: true,
      class: tx('hover:bg-success-hover active:bg-success-active'),
    },
    {
      variant: 'solid',
      intent: 'warning',
      isInteractive: true,
      class: tx('hover:bg-warning-hover active:bg-warning-active'),
    },
    {
      variant: 'solid',
      intent: 'danger',
      isInteractive: true,
      class: tx('hover:bg-danger-hover active:bg-danger-active'),
    },

    // soft / intent
    {
      variant: 'soft',
      intent: 'neutral',
      class: tx('bg-neutral-soft text-neutral'),
    },
    {
      variant: 'soft',
      intent: 'primary',
      class: tx('bg-primary-soft text-primary'),
    },
    {
      variant: 'soft',
      intent: 'success',
      class: tx('bg-success-soft text-success'),
    },
    {
      variant: 'soft',
      intent: 'warning',
      class: tx('bg-warning-soft text-warning'),
    },
    {
      variant: 'soft',
      intent: 'danger',
      class: tx('bg-danger-soft text-danger'),
    },

    // soft / intent / isInteractive
    {
      variant: 'soft',
      intent: 'neutral',
      isInteractive: true,
      class: tx('hover:bg-neutral-soft-hover active:bg-neutral-soft-active'),
    },
    {
      variant: 'soft',
      intent: 'primary',
      isInteractive: true,
      class: tx('hover:bg-primary-soft-hover active:bg-primary-soft-active'),
    },
    {
      variant: 'soft',
      intent: 'success',
      isInteractive: true,
      class: tx('hover:bg-success-soft-hover active:bg-success-soft-active'),
    },
    {
      variant: 'soft',
      intent: 'warning',
      isInteractive: true,
      class: tx('hover:bg-warning-soft-hover active:bg-warning-soft-active'),
    },
    {
      variant: 'soft',
      intent: 'danger',
      isInteractive: true,
      class: tx('hover:bg-danger-soft-hover active:bg-danger-soft-active'),
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
      intent: 'success',
      class: tx('text-success'),
    },
    {
      variant: 'ghost',
      intent: 'warning',
      class: tx('text-warning'),
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
      isInteractive: true,
      class: tx('hover:bg-neutral-soft active:bg-neutral-soft-hover'),
    },
    {
      variant: 'ghost',
      intent: 'primary',
      isInteractive: true,
      class: tx('hover:bg-primary-soft active:bg-primary-soft-hover'),
    },
    {
      variant: 'ghost',
      intent: 'success',
      isInteractive: true,
      class: tx('hover:bg-success-soft active:bg-success-soft-hover'),
    },
    {
      variant: 'ghost',
      intent: 'warning',
      isInteractive: true,
      class: tx('hover:bg-warning-soft active:bg-warning-soft-hover'),
    },
    {
      variant: 'ghost',
      intent: 'danger',
      isInteractive: true,
      class: tx('hover:bg-danger-soft active:bg-danger-soft-hover'),
    },
  ],
});

export type ButtonStyleProps = VariantProps<typeof buttonStyle>;
export type ButtonSlots = VariantSlots<typeof buttonStyle.slots>;

export const buttonStaticClass = makeStaticClass<ButtonSlots>('button');

/**
 * ButtonGroup wrapper **Tailwind Variants** component
 *
 * const classNames = buttonGroup({...})
 *
 * @example
 * <div role="group" className={classNames())}>
 *   // button elements
 * </div>
 */
export const buttonGroupStyle = tv({
  base: 'inline-flex items-center justify-center h-auto',
  variants: {
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

export type ButtonGroupStyleProps = VariantProps<typeof buttonGroupStyle>;
