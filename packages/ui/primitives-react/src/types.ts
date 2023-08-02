type As<Props = any> = React.ElementType<Props>;

type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T>;

export type HTMLProps<T extends As, K extends object = object> = Omit<
  Omit<PropsOf<T>, 'ref' | 'color' | 'slot' | 'dir' | 'tw' | 'size'>,
  keyof K
> &
  K;
