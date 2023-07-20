import type { SlotProp, StyleProps } from '../types.ts';
import type { StackStyleProps } from './stack.styles.ts';

export type StackSlots = 'root';

export interface StackProps<T> extends StackRootProps<T> {}

interface StackRootProps<T> extends StyleProps, StackStyleProps, SlotProp<StackSlots> {
  divider?: boolean | T;
}
