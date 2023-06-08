import type { SlotProp, StyleProps } from '../types.ts';
import type { ButtonStyleProps } from './button.styles.ts';
import type { IconProps } from './icon.props.ts';

export type ButtonSlots = 'root' | 'icon' | 'text';

export interface ButtonProps<T> extends ButtonRootProps<T> {}

interface ButtonRootProps<T> extends Omit<StyleProps, 'isInteractive'>, ButtonStyleProps, SlotProp<ButtonSlots> {
  /** If added, the button will show an icon before the button's label. */
  startIcon?: IconProps<T>['icon'];

  /** If added, the button will show an icon after the button's label. */
  endIcon?: IconProps<T>['icon'];

  /** The icon to show when `isLoading` is true. */
  loadingIcon?: IconProps<T>['icon'];

  /** The label to show in the button when `isLoading` is true. */
  loadingText?: string;

  /** The placement of the loader when `isLoading` is true. */
  loadingPlacement?: 'start' | 'end';
}
