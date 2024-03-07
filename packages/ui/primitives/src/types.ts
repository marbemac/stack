type As<Props = any> = React.ElementType<Props>;

type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T>;

export type HTMLProps<T extends As, K extends object = object> = Omit<
  Omit<PropsOf<T>, 'ref' | 'color' | 'slot' | 'dir' | 'size'>,
  keyof K
> &
  K;

export type ReactRef<T> = React.RefObject<T> | React.MutableRefObject<T> | React.Ref<T>;

export type MaybeRenderProp<P, R = React.ReactNode> = R | ((props: P) => R);
