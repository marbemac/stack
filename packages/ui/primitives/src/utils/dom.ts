import type { Ref, RefObject } from 'react';
import { useImperativeHandle, useRef } from 'react';

export function useDOMRef<T extends HTMLElement = HTMLElement>(ref?: RefObject<T | null> | Ref<T | null>) {
  const domRef = useRef<T>(null);

  // @ts-expect-error ignore
  useImperativeHandle(ref, () => domRef.current);

  return domRef;
}
