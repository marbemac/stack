import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { SlotProp, VariantSlots } from '../types.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

export type DialogStyleProps = VariantProps<typeof dialogStyle>;
export type DialogSlots = VariantSlots<typeof dialogStyle.slots>;
export type DialogSlotProps = SlotProp<DialogSlots>;

export const dialogStaticClass = makeStaticClass<DialogSlots>('dialog');

export const dialogStyle = tv(
  {
    slots: {
      wrapper: tx('fixed inset-0 isolate flex h-[100dvh] w-screen justify-center'),

      base: tx(
        'bg-panel bg-clip-padding outline-none ring-1 ring-neutral-soft-1-a',
        'animate-dialog-content',
        'flex w-full flex-col',
        'mx-6 my-16 sm:m-1.5',
        'rounded-xl shadow-lg sm:rounded-lg sm:shadow-md',
      ),

      backdrop: tx('fixed inset-0 animate-overlay'),

      header: tx('px-6 py-4'),
      body: tx('px-6 py-2'),
      footer: tx('flex flex-row justify-end gap-3 px-6 py-4'),
      close: tx('absolute right-1 top-1'),
    },

    defaultVariants: {
      size: 'md',
      placement: 'auto',
      scrollBehavior: 'inside',
      backdrop: 'opaque',
    },

    variants: {
      size: {
        xs: {
          base: tx('max-w-xs'),
        },
        sm: {
          base: tx('max-w-sm'),
        },
        md: {
          base: tx('max-w-md'),
        },
        lg: {
          base: tx('max-w-lg'),
        },
        xl: {
          base: tx('max-w-xl'),
        },
        '2xl': {
          base: tx('max-w-2xl'),
        },
        '3xl': {
          base: tx('max-w-3xl'),
        },
        '4xl': {
          base: tx('max-w-4xl'),
        },
        '5xl': {
          base: tx('max-w-5xl'),
        },
        full: {
          base: tx('m-0 h-[100dvh] max-w-full !rounded-none sm:m-0'),
        },
      },

      placement: {
        auto: {
          wrapper: tx('items-center sm:items-end'),
        },
      },

      scrollBehavior: {
        inside: {
          wrapper: tx('overflow-y-hidden'),
          base: tx('max-h-[calc(100%_-_7.5rem)]'),
          body: tx('overflow-y-auto'),
        },
        outside: {
          wrapper: tx('items-start overflow-y-auto sm:items-start'),
          base: tx('my-16'),
        },
      },

      backdrop: {
        transparent: {
          backdrop: tx('hidden'),
        },
        opaque: {
          backdrop: tx('bg-overlay saturate-50'),
        },
        blur: {
          backdrop: tx('bg-overlay/70 backdrop-blur-sm'),
        },
      },
    },
  },
  {
    twMergeConfig,
  },
);
