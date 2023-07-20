/* eslint-disable @typescript-eslint/ban-types */
// Adapted from https://github.com/fabien-ml/kobalte/blob/8ab09d87f7ea68f9fb79d32458a06dd3ae62029d/packages/utils/src/polymorphic.tsx
// asProps design came out of this discussion -> https://github.com/orgs/kobaltedev/discussions/138#discussioncomment-5245471

import type { SetRequired } from '@marbemac/utils-types';
import type { Component, ComponentProps as BaseComponentProps, JSX } from 'solid-js';

/** All HTML and SVG elements. */
export type DOMElements = keyof JSX.IntrinsicElements;

/** Any HTML element or SolidJS component. */
export type ElementType<Props = any> = DOMElements | Component<Props>;

/**
 * Allows for extending a set of props (`Source`) by an overriding set of props (`Override`),
 * ensuring that any duplicates are overridden by the overriding set of props.
 */
export type OverrideProps<Source = {}, Override = {}> = Omit<Source, keyof Override> & Override;

/** The `as` prop type. */
export type As<Props = any> = ElementType<Props>;

/** Clean-up autocomplete and omit a bunch of props we don't use */
export type ComponentProps<T extends As> = Omit<BaseComponentProps<T>, keyof IgnoredHTMLAttributes<T>>;

export type IgnoredHTMLAttributes<T> = Pick<
  JSX.HTMLAttributes<T>,
  // Feel free to remove any items from this list if any end up being needed
  | '$ServerOnly'
  | 'about'
  | 'accessKey'
  | 'aria-atomic'
  | 'aria-flowto'
  | 'autocapitalize'
  | 'class'
  | 'classList'
  | 'color'
  | 'contenteditable'
  | 'contextmenu'
  | 'datatype'
  | 'dir'
  | 'exportParts'
  | 'exportparts'
  | 'inert'
  | 'inlist'
  | 'inputMode'
  | 'inputmode'
  | 'itemId'
  | 'itemProp'
  | 'itemRef'
  | 'itemScope'
  | 'itemType'
  | 'itemid'
  | 'itemprop'
  | 'itemref'
  | 'itemscope'
  | 'itemtype'
  | 'onabort'
  | 'onanimationend'
  | 'onanimationiteration'
  | 'onanimationstart'
  | 'onauxclick'
  | 'onbeforeinput'
  | 'onblur'
  | 'oncanplay'
  | 'oncanplaythrough'
  | 'onchange'
  | 'onclick'
  | 'oncontextmenu'
  | 'ondblclick'
  | 'ondrag'
  | 'ondragend'
  | 'ondragenter'
  | 'ondragleave'
  | 'ondragover'
  | 'ondragstart'
  | 'ondrop'
  | 'ondurationchange'
  | 'onemptied'
  | 'onended'
  | 'onerror'
  | 'onfocus'
  | 'ongotpointercapture'
  | 'oninput'
  | 'oninvalid'
  | 'onkeydown'
  | 'onkeypress'
  | 'onkeyup'
  | 'onload'
  | 'onloadeddata'
  | 'onloadedmetadata'
  | 'onloadstart'
  | 'onlostpointercapture'
  | 'onmousedown'
  | 'onmouseenter'
  | 'onmouseleave'
  | 'onmousemove'
  | 'onmouseout'
  | 'onmouseover'
  | 'onmouseup'
  | 'onpause'
  | 'onplay'
  | 'onplaying'
  | 'onpointercancel'
  | 'onpointerdown'
  | 'onpointerenter'
  | 'onpointerleave'
  | 'onpointermove'
  | 'onpointerout'
  | 'onpointerover'
  | 'onpointerup'
  | 'onprogress'
  | 'onratechange'
  | 'onreset'
  | 'onscroll'
  | 'onseeked'
  | 'onseeking'
  | 'onselect'
  | 'onstalled'
  | 'onsubmit'
  | 'onsuspend'
  | 'ontimeupdate'
  | 'ontouchcancel'
  | 'ontouchend'
  | 'ontouchmove'
  | 'ontouchstart'
  | 'ontransitionstart'
  | 'ontransitionend'
  | 'ontransitionrun'
  | 'ontransitioncancel'
  | 'onvolumechange'
  | 'onwaiting'
  | 'onwheel'
  | 'oncompositionend'
  | 'oncompositionstart'
  | 'oncompositionupdate'
  | 'oncopy'
  | 'oncut'
  | 'ondragexit'
  | 'onencrypted'
  | 'onfocusout'
  | 'onfocusin'
  | 'onpaste'
  | 'part'
  | 'prefix'
  | 'property'
  | 'resource'
  | 'slot'
  | 'tabindex'
  | 'typeof'
  | 'vocab'
>;

/** Props object that includes the `as` prop. */
export type PolymorphicProps<Type extends As = As, Props = {}> = OverrideProps<
  ComponentProps<Type>,
  // Props & { as?: Type }
  Props & AsProp<Type>
>;

interface AsProp<T extends As, P = ComponentProps<T>> {
  as?: T;
  asProps?: P;
}

type WithAs<T extends As> = SetRequired<AsProp<T>, 'as'>;

/** A component with the `as` prop. */
export type PolymorphicComponent<DefaultType extends As, Props = {}> = {
  <Type extends As>(props: PolymorphicProps<Type, Props> & WithAs<Type>): JSX.Element;
  (props: PolymorphicProps<DefaultType, Props>): JSX.Element;
};

/**
 * Create a component with the type cast to `PolymorphicComponent`.
 * You have to use `Dynamic` internally and pass the `as` prop to handle polymorphism correctly.
 */
export function createPolymorphicComponent<DefaultType extends As, Props = {}>(
  component: Component<PolymorphicProps<DefaultType, Props>>,
) {
  return component as unknown as PolymorphicComponent<DefaultType, Props>;
}
