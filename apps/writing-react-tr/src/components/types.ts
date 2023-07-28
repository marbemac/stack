// import type { ClassNameValue } from '~/primitive-styles/tw.ts';
type ClassNameArray = ClassNameValue[];
export type ClassNameValue = ClassNameArray | string | null | undefined | 0 | false;

export type As<Props = any> = React.ElementType<Props>;
export type DOMElements = keyof JSX.IntrinsicElements;
export type CapitalizedDOMElements = Capitalize<DOMElements>;

export type TwProp = ClassNameValue;

export interface UIProps {
  /**
   * The HTML element to render.
   */
  as?: As;

  /**
   * Type-safe styling using tailwind classes.
   */
  tw?: TwProp;
}

export interface DOMElement extends Element, HTMLOrSVGElement {}

type DataAttributes = {
  [dataAttr: string]: any;
};

export type DOMAttributes<T = DOMElement> = React.AriaAttributes &
  React.DOMAttributes<T> &
  DataAttributes & {
    id?: string;
    role?: React.AriaRole;
    tabIndex?: number;
    style?: React.CSSProperties;
  };

export type OmitCommonProps<Target, OmitAdditionalProps extends keyof any = never> = Omit<
  Target,
  'transition' | 'as' | 'color' | 'tw' | OmitAdditionalProps
>;

export type RightJoinProps<
  SourceProps extends object = object,
  OverrideProps extends object = object,
> = OmitCommonProps<SourceProps, keyof OverrideProps> & OverrideProps;

export type MergeWithAs<
  ComponentProps extends object,
  AsProps extends object,
  AdditionalProps extends object = object,
  AsComponent extends As = As,
> = RightJoinProps<ComponentProps, AdditionalProps> &
  RightJoinProps<AsProps, AdditionalProps> & {
    as?: AsComponent;
  };

export type ComponentWithAs<Component extends As, Props extends object = object> = {
  <AsComponent extends As = Component>(
    props: MergeWithAs<React.ComponentProps<Component>, React.ComponentProps<AsComponent>, Props, AsComponent>,
  ): JSX.Element;

  displayName?: string;
  propTypes?: React.WeakValidationMap<any>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<any>;
  id?: string;
};

/**
 * Extract the props of a React element or component
 */
export type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T> & {
  as?: As;
};

export type Merge<M, N> = N extends Record<string, unknown> ? M : Omit<M, keyof N> & N;

export type HTMLUIProps<T extends As = 'div', K extends object = object> = Omit<
  Omit<PropsOf<T>, 'ref' | 'color' | 'slot' | 'dir' | 'tw'> & UIProps,
  keyof K
> &
  K;

export type PropGetter<P = Record<string, unknown>, R = DOMAttributes> = (
  props?: Merge<DOMAttributes, P>,
  ref?: React.Ref<any>,
) => R & React.RefAttributes<any>;
