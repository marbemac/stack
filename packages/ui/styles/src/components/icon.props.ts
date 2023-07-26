import type { IconDefinition, IconLookup, IconName, IconPrefix } from '@fortawesome/fontawesome-common-types';

import type { SlotProp, StyleProps } from '../types.ts';
import type { IconStyleProps } from './icon.styles.ts';

export type IconSlots = 'root';

export interface IconProps<T> extends IconRootProps<T> {}

interface IconRootProps<T> extends StyleProps, IconStyleProps, SlotProp<IconSlots> {
  icon: IconDefinition | IconName | [IconPrefix, IconName] | IconLookup | T;
}
