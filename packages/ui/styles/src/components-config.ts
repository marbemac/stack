import type {
  ButtonProps,
  ButtonSlots,
  IconProps,
  IconSlots,
  InputProps,
  InputSlots,
  StackProps,
  StackSlots,
} from './components/index.ts';

export interface ComponentTheme<Props, Slots extends string> {
  /** Default props to be passed to the component. */
  defaultProps?: Partial<Props>;

  /** CSS classes to be passed to the component slots. */
  slotClasses?: Partial<Record<Slots, string>> | ((props: Props) => Partial<Record<Slots, string>>);
}

/** Components configuration. */
export interface ComponentsConfig<T> {
  // alphabetical order
  Button?: ComponentTheme<ButtonProps<T>, ButtonSlots>;
  Icon?: ComponentTheme<IconProps<T>, IconSlots>;
  Stack?: ComponentTheme<StackProps<T>, StackSlots>;
  Input?: ComponentTheme<InputProps<T>, InputSlots>;
}
