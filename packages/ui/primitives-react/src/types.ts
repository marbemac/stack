export type As = React.ElementType;

export type HTMLUIProps<T extends As = 'div', K extends object = object> = Omit<
  Omit<React.ComponentPropsWithoutRef<T>, 'ref' | 'color' | 'slot' | 'dir' | 'tw' | 'className'>,
  keyof K
> &
  K;
