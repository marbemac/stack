import type { ComponentProps, JSX } from 'solid-js';
import { children } from 'solid-js';
import { insert, isServer, spread, ssrElement } from 'solid-js/web';

import { Links } from './Links.js';
import { Meta } from './Meta.js';

export function Html(props: ComponentProps<'html'>) {
  if (isServer) {
    return ssrElement('html', props, undefined, false) as unknown as JSX.Element;
  }
  spread(document.documentElement, props, false, true);
  return props.children;
}

export function Head(props: ComponentProps<'head'>) {
  if (isServer) {
    return ssrElement(
      'head',
      props,
      () => (
        <>
          {props.children}
          <Meta />
          <Links />
        </>
      ),
      false,
    ) as unknown as JSX.Element;
  } else {
    spread(document.head, props, false, true);
    return props.children;
  }
}

export function Body(props: ComponentProps<'body'>) {
  if (isServer) {
    return ssrElement('body', props, () => props.children, false) as unknown as JSX.Element;
  } else {
    const child = children(() => props.children);
    spread(document.body, props, false, true);
    insert(
      document.body,
      () => {
        const childNodes = child();
        if (childNodes) {
          if (Array.isArray(childNodes)) {
            const els = childNodes.filter(n => Boolean(n));

            if (!els.length) {
              return null;
            }

            return els;
          }
          return childNodes;
        }
        return null;
      },
      null,
      [...document.body.childNodes],
    );

    return document.body;
  }
}
