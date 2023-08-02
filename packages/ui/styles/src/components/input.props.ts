import type { SlotProp, StyleProps } from '../types.ts';
import type { IconProps } from './icon.props.ts';
import type { InputSlots, InputStyleProps } from './input.styles.ts';

export interface InputProps<T> extends InputRootProps<T> {}

interface InputRootProps<T> extends StyleProps, InputStyleProps, SlotProp<InputSlots> {
  /**
   * The icon to show before the input value.
   */
  startIcon?: IconProps<T>['icon'];

  /**
   * The icon to show after the input value.
   */
  endIcon?: IconProps<T>['icon'];

  /** The element to show before the input value, in place of the `startIcon`. */
  startSection?: T;

  /** The element to show after the input value, in place of the `endIcon`. */
  endSection?: T;

  /** Width of start section (in pixel). */
  startSectionWidth?: number;

  /** Width of end section (in pixel). */
  endSectionWidth?: number;
}
