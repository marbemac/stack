import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { tx } from '../tw.ts';
import type { VariantSlots } from '../types.ts';
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
      class: tx('border-neutral-solid/40 text-neutral-fg'),
    },
    {
      variant: 'outline',
      intent: 'primary',
      class: tx('border-primary-solid/70 text-primary-fg'),
    },
    {
      variant: 'outline',
      intent: 'success',
      class: tx('border-success-solid/70 text-success-fg'),
    },
    {
      variant: 'outline',
      intent: 'warning',
      class: tx('border-warning-solid/70 text-warning-fg'),
    },
    {
      variant: 'outline',
      intent: 'danger',
      class: tx('border-danger-solid/70 text-danger-fg'),
    },

    // outline / intent / isInteractive
    {
      variant: 'outline',
      intent: 'neutral',
      isInteractive: true,
      class: tx('hover:bg-neutral-subtle active:bg-neutral-subtle-hover'),
    },
    {
      variant: 'outline',
      intent: 'primary',
      isInteractive: true,
      class: tx('hover:bg-primary-subtle active:bg-primary-subtle-hover'),
    },
    {
      variant: 'outline',
      intent: 'success',
      isInteractive: true,
      class: tx('hover:bg-success-subtle active:bg-success-subtle-hover'),
    },
    {
      variant: 'outline',
      intent: 'warning',
      isInteractive: true,
      class: tx('hover:bg-warning-subtle active:bg-warning-subtle-hover'),
    },
    {
      variant: 'outline',
      intent: 'danger',
      isInteractive: true,
      class: tx('hover:bg-danger-subtle active:bg-danger-subtle-hover'),
    },

    // solid / intent
    {
      variant: 'solid',
      intent: 'neutral',
      class: tx('bg-neutral-solid text-on-neutral'),
    },
    {
      variant: 'solid',
      intent: 'primary',
      class: tx('bg-primary-solid text-on-primary'),
    },
    {
      variant: 'solid',
      intent: 'success',
      class: tx('bg-success-solid text-on-success'),
    },
    {
      variant: 'solid',
      intent: 'warning',
      class: tx('bg-warning-solid text-on-warning'),
    },
    {
      variant: 'solid',
      intent: 'danger',
      class: tx('bg-danger-solid text-on-danger'),
    },

    // solid / intent / isInteractive
    {
      variant: 'solid',
      intent: 'neutral',
      isInteractive: true,
      class: tx('hover:bg-neutral-solid-hover active:bg-neutral-solid-active'),
    },
    {
      variant: 'solid',
      intent: 'primary',
      isInteractive: true,
      class: tx('hover:bg-primary-solid-hover active:bg-primary-solid-active'),
    },
    {
      variant: 'solid',
      intent: 'success',
      isInteractive: true,
      class: tx('hover:bg-success-solid-hover active:bg-success-solid-active'),
    },
    {
      variant: 'solid',
      intent: 'warning',
      isInteractive: true,
      class: tx('hover:bg-warning-solid-hover active:bg-warning-solid-active'),
    },
    {
      variant: 'solid',
      intent: 'danger',
      isInteractive: true,
      class: tx('hover:bg-danger-solid-hover active:bg-danger-solid-active'),
    },

    // soft / intent
    {
      variant: 'soft',
      intent: 'neutral',
      class: tx('bg-neutral-subtle text-neutral-fg'),
    },
    {
      variant: 'soft',
      intent: 'primary',
      class: tx('bg-primary-subtle text-primary-fg'),
    },
    {
      variant: 'soft',
      intent: 'success',
      class: tx('bg-success-subtle text-success-fg'),
    },
    {
      variant: 'soft',
      intent: 'warning',
      class: tx('bg-warning-subtle text-warning-fg'),
    },
    {
      variant: 'soft',
      intent: 'danger',
      class: tx('bg-danger-subtle text-danger-fg'),
    },

    // soft / intent / isInteractive
    {
      variant: 'soft',
      intent: 'neutral',
      isInteractive: true,
      class: tx('hover:bg-neutral-subtle-hover active:bg-neutral-subtle-active'),
    },
    {
      variant: 'soft',
      intent: 'primary',
      isInteractive: true,
      class: tx('hover:bg-primary-subtle-hover active:bg-primary-subtle-active'),
    },
    {
      variant: 'soft',
      intent: 'success',
      isInteractive: true,
      class: tx('hover:bg-success-subtle-hover active:bg-success-subtle-active'),
    },
    {
      variant: 'soft',
      intent: 'warning',
      isInteractive: true,
      class: tx('hover:bg-warning-subtle-hover active:bg-warning-subtle-active'),
    },
    {
      variant: 'soft',
      intent: 'danger',
      isInteractive: true,
      class: tx('hover:bg-danger-subtle-hover active:bg-danger-subtle-active'),
    },

    // ghost / intent
    {
      variant: 'ghost',
      intent: 'neutral',
      class: tx('text-neutral-fg'),
    },
    {
      variant: 'ghost',
      intent: 'primary',
      class: tx('text-primary-fg'),
    },
    {
      variant: 'ghost',
      intent: 'success',
      class: tx('text-success-fg'),
    },
    {
      variant: 'ghost',
      intent: 'warning',
      class: tx('text-warning-fg'),
    },
    {
      variant: 'ghost',
      intent: 'danger',
      class: tx('text-danger-fg'),
    },

    // ghost / intent / isInteractive
    {
      variant: 'ghost',
      intent: 'neutral',
      isInteractive: true,
      class: tx('hover:bg-neutral-subtle active:bg-neutral-subtle-hover'),
    },
    {
      variant: 'ghost',
      intent: 'primary',
      isInteractive: true,
      class: tx('hover:bg-primary-subtle active:bg-primary-subtle-hover'),
    },
    {
      variant: 'ghost',
      intent: 'success',
      isInteractive: true,
      class: tx('hover:bg-success-subtle active:bg-success-subtle-hover'),
    },
    {
      variant: 'ghost',
      intent: 'warning',
      isInteractive: true,
      class: tx('hover:bg-warning-subtle active:bg-warning-subtle-hover'),
    },
    {
      variant: 'ghost',
      intent: 'danger',
      isInteractive: true,
      class: tx('hover:bg-danger-subtle active:bg-danger-subtle-hover'),
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
