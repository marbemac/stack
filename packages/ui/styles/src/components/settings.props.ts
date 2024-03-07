import type { SlotProp } from '../types.ts';
import type { IconProps } from './icon.props.ts';
import type { SelectProps } from './select.props.ts';
import type {
  SettingSectionSlots,
  SettingSectionStyleProps,
  SettingsRowChildStyleProps,
  SettingsRowSlots,
  SettingsRowStyleProps,
} from './settings.styles.ts';

export interface SettingsSectionsProps<T> {
  title?: string;

  /** Should be a list of SettingsSections components */
  children: T;
}

export type SettingsSectionProps<T> = SettingSectionStyleProps &
  SlotProp<SettingSectionSlots> & {
    title?: string;

    /** Should be a list of SettingsRow components */
    children: T;
  };

/**
 * SettingsRow
 */

export type SettingsRowProps<T> =
  | SwitchSettingsRowProps<T>
  | DialogSettingsRowProps<T>
  | SelectSettingsRowProps<T>
  | ListSettingsRowProps<T>
  | ActionSettingsRowProps<T>
  | CopySettingsRowProps<T>;

export type SettingsRowChildProps<T> = SelectChildSettingsRowProps<T> | ActionChildSettingsRowProps<T>;

type CommonSettingsRowProps<T> = SettingsRowStyleProps &
  SlotProp<SettingsRowSlots> & {
    label: string;
    hint?: string | T;
    icon?: IconProps<T>['icon'];
    isDisabled?: boolean;
  };

type SwitchSettingsRowProps<T> = CommonSettingsRowProps<T> & {
  type: 'switch';
  onPress: (isSelected: boolean) => unknown;
  isSelected: boolean;
  switchLabel: string;
};

type DialogSettingsRowProps<T> = CommonSettingsRowProps<T> & {
  type: 'dialog';
  // The contents to put in the Dialog
  children: T;
  value?: string | T;
};

type SelectSettingsRowProps<T> = CommonSettingsRowProps<T> &
  Pick<SelectProps<T>, 'value' | 'onValueChange'> & {
    type: 'select';
    renderSelectContent: () => T;
  };

type ListSettingsRowProps<T> = CommonSettingsRowProps<T> & {
  type: 'list';
  onPress?: () => unknown;
  noAction?: boolean;
  actionText?: string;
  items: SettingsRowChildProps<T>[];
  isLoadingItems?: boolean;
};

type ActionSettingsRowProps<T> = CommonSettingsRowProps<T> & {
  type: 'action';
  onPress: () => unknown;
  hasMoreIcon?: IconProps<T>['icon'];
  value?: string;
};

type CopySettingsRowProps<T> = CommonSettingsRowProps<T> & {
  type: 'copy';
  value: string;
};

type CommonSettingsRowChildProps<T> = SettingsRowChildStyleProps & {
  children: T;
};

type SelectChildSettingsRowProps<T> = CommonSettingsRowChildProps<T> &
  Pick<SelectProps<T>, 'value' | 'onValueChange'> & {
    type: 'select';
    renderSelectContent: () => T;
  };

type ActionChildSettingsRowProps<T> = CommonSettingsRowChildProps<T> & {
  type: 'action';
  onPress: () => void;
};
