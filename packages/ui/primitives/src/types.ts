type As<Props = any> = React.ElementType<Props>;

type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T>;

export type HTMLProps<T extends As, K extends object = object> = Omit<
  Omit<PropsOf<T>, 'ref' | 'color' | 'slot' | 'dir' | 'size'>,
  keyof K
> &
  K;

export type CleanRACProps<T> = Omit<T, 'className' | 'style'>;

export type ReactRef<T> = React.RefObject<T> | React.MutableRefObject<T> | React.Ref<T>;

export type DOMElement = {} & Element & HTMLOrSVGElement;

type DataAttributes = Record<string, any>;

export type DOMAttributes<T = DOMElement> = React.AriaAttributes &
  React.DOMAttributes<T> &
  DataAttributes & {
    id?: string;
    tabIndex?: number;
    style?: React.CSSProperties;
  };

export type Merge<M, N> = N extends Record<string, unknown> ? M : Omit<M, keyof N> & N;

export type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (
  props?: Merge<DOMAttributes, P>,
  ref?: React.Ref<any>,
) => R & React.RefAttributes<any>;

export type MaybeRenderProp<P, R = React.ReactNode> = R | ((props: P) => R);
