import type { SlotProp, StyleProps } from '../types.ts';
import type { LabelSlots, LabelStyleProps } from './label.styles.ts';

export interface LabelProps extends LabelRootProps {}

interface LabelRootProps extends StyleProps, LabelStyleProps, SlotProp<LabelSlots> {}
