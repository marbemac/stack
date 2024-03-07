/**
 * Credits to @ariakit for most of this code, and the "render" composition pattern.
 */

import { getRefProperty, mergeProps } from '@ariakit/react-core/utils/misc';
import { cloneElement, isValidElement } from 'react';

import { mergeRefs } from './merge-refs.ts';

/**
 * Render prop type.
 * @template P Props
 * @example
 * const children: RenderProp = (props) => <div {...props} />;
 */
export type RenderProp<P = React.HTMLAttributes<any> & React.RefAttributes<any>> = (props: P) => React.ReactNode;

/**
 * The `wrapElement` prop.
 */
export type WrapElement = (element: React.ReactElement) => React.ReactElement;

/**
 * Custom props including the `render` prop.
 */
export interface Options {
  wrapElement?: WrapElement;
  /**
   * Allows the component to be rendered as a different HTML element or React
   * component. The value can be a React element or a function that takes in the
   * original component props and gives back a React element with the props
   * merged.
   *
   * Check out the [Composition](https://ariakit.org/guide/composition) guide
   * for more details.
   */
  render?: RenderProp | React.ReactElement | keyof React.JSX.IntrinsicElements;
}

/**
 * Any object.
 */
export type AnyObject = Record<string, any>;

/**
 * Empty object.
 */
export type EmptyObject = Record<keyof any, never>;

/**
 * Any function.
 */
export type AnyFunction = (...args: any) => any;

/**
 * HTML props based on the element type, excluding custom props.
 * @template T The element type.
 * @template P Custom props.
 * @example
 * type ButtonHTMLProps = HTMLProps<"button", { custom?: boolean }>;
 */
export type HTMLProps<T extends React.ElementType, P extends AnyObject = EmptyObject> = Omit<
  React.ComponentPropsWithRef<T>,
  keyof P
> &
  Record<`data-${string}`, unknown>;

/**
 * Props based on the element type, including custom props.
 * @template T The element type.
 * @template P Custom props.
 */
export type Props<T extends React.ElementType, P extends AnyObject = EmptyObject> = P & HTMLProps<T, P>;

/**
 * Creates a React element that supports the `render` and `wrapElement` props.
 */
export function createElement(Type: React.ElementType, props: Props<React.ElementType, Options>) {
  const { wrapElement, render, ...rest } = props;
  const mergedRef = mergeRefs(props['ref'], getRefProperty(render));

  let element: React.ReactElement;

  if (isValidElement<any>(render)) {
    const renderProps = { ...render.props, ref: mergedRef };
    element = cloneElement(render, mergeProps(rest, renderProps));
  } else if (typeof render === 'string') {
    element = createElement(render, rest);
  } else if (render) {
    element = render(rest) as React.ReactElement;
  } else {
    element = <Type {...rest} />;
  }

  if (wrapElement) {
    return wrapElement(element);
  }

  return element;
}
