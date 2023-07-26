import type { ButtonProps, ButtonSlots, IconProps, IconSlots, StackProps, StackSlots } from '@marbemac/ui-styles';
import type { ValidComponent } from 'solid-js';

export interface ComponentTheme<Props, Slots extends string> {
  /** Default props to be passed to the component. */
  defaultProps?: Partial<Props>;

  /** CSS classes to be passed to the component slots. */
  slotClasses?: Partial<Record<Slots, string>> | ((props: Props) => Partial<Record<Slots, string>>);
}

/** Components configuration. */
export interface ComponentsConfig {
  // alphabetical order
  Button?: ComponentTheme<ButtonProps<ValidComponent>, ButtonSlots>;
  Icon?: ComponentTheme<IconProps<ValidComponent>, IconSlots>;
  Stack?: ComponentTheme<StackProps<ValidComponent>, StackSlots>;
}
