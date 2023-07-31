import type { ButtonProps, ButtonSlots, IconProps, IconSlots, StackProps, StackSlots } from '@marbemac/ui-styles';

export interface ComponentTheme<Props, Slots extends string> {
  /** Default props to be passed to the component. */
  defaultProps?: Partial<Props>;

  /** CSS classes to be passed to the component slots. */
  slotClasses?: Partial<Record<Slots, string>> | ((props: Props) => Partial<Record<Slots, string>>);
}

/** Components configuration. */
export interface ComponentsConfig {
  // alphabetical order
  Button?: ComponentTheme<ButtonProps<React.ReactNode>, ButtonSlots>;
  Icon?: ComponentTheme<IconProps<React.ReactNode>, IconSlots>;
  Stack?: ComponentTheme<StackProps<React.ReactNode>, StackSlots>;
}
