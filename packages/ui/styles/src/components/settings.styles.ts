import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { twMergeConfig, tx } from '../tw.ts';
import type { VariantSlots } from '../types.ts';
import { focusStyles } from '../utils/focus.ts';
import { makeStaticClass } from '../utils/make-static-class.ts';

/**
 * SettingsSections
 */

export const settingSectionsStyle = tv(
  {
    slots: {
      base: tx(''),
    },
    variants: {},
  },
  {
    twMergeConfig,
  },
);

export type SettingSectionsStyleProps = VariantProps<typeof settingSectionsStyle>;
export type SettingSectionsSlots = VariantSlots<typeof settingSectionsStyle.slots>;

export const settingSectionsStaticClass = makeStaticClass<SettingSectionsSlots>('setting-sections');

/**
 * SettingsSection
 */

export const settingSectionStyle = tv(
  {
    slots: {
      base: tx(''),
      title: tx(''),
      content: tx('-mx-2 rounded-lg'),
    },
    defaultVariants: {
      isDangerZone: false,
    },
    variants: {
      isDangerZone: {
        true: {
          title: tx('text-danger'),
          content: tx('border border-danger-line-1'),
        },
      },
    },
  },
  {
    twMergeConfig,
  },
);

export type SettingSectionStyleProps = VariantProps<typeof settingSectionStyle>;
export type SettingSectionSlots = VariantSlots<typeof settingSectionStyle.slots>;

export const settingSectionStaticClass = makeStaticClass<SettingSectionSlots>('setting-section');

/**
 * SettingsRow
 */

export const settingsRowStyle = tv(
  {
    slots: {
      base: tx(''),
      container: tx('flex items-center rounded-lg px-2 py-5'),
      startIcon: tx('w-14 text-4xl text-muted'),
      content: tx('flex flex-1 items-center gap-10'),
      label: tx('flex-1'),
      hint: tx('text-sm text-muted'),
      endIcon: tx('text-muted'),

      dialogContent: tx('w-full'),

      listContainer: tx('pl-14'),
      listDivider: tx('h-px bg-neutral-line-1/60'),
    },
    defaultVariants: {
      canInteract: false,
    },
    variants: {
      canInteract: {
        true: {
          container: tx(focusStyles, 'cursor-pointer hover:bg-neutral-soft-1/50'),
        },
        false: {
          container: tx('cursor-auto'),
        },
      },
    },
  },
  {
    twMergeConfig,
  },
);

export type SettingsRowStyleProps = VariantProps<typeof settingsRowStyle>;
export type SettingsRowSlots = VariantSlots<typeof settingsRowStyle.slots>;

export const settingsRowStaticClass = makeStaticClass<SettingsRowSlots>('settings-row');

/**
 * SettingsRowChild
 */

export const settingsRowChildStyle = tv(
  {
    slots: {
      base: tx('flex items-center px-2 py-3'),
      content: tx('flex flex-1 items-center'),
      endIcon: tx('text-muted'),
    },
    defaultVariants: {
      isDisabled: false,
    },
    variants: {
      isDisabled: {
        true: {
          base: tx('cursor-auto'),
        },
        false: {
          base: tx('cursor-pointer hover:bg-neutral-soft-1/50'),
        },
      },
    },
  },
  {
    twMergeConfig,
  },
);

export type SettingsRowChildStyleProps = VariantProps<typeof settingsRowChildStyle>;
export type SettingsRowChildSlots = VariantSlots<typeof settingsRowChildStyle.slots>;

export const settingsRowChildStaticClass = makeStaticClass<SettingsRowChildSlots>('settings-row-child');
