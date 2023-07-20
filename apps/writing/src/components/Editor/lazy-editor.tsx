import type { Component } from 'solid-js';
import { Suspense } from 'solid-js';
import { lazy } from 'solid-js';
import { isServer } from 'solid-js/web';

import { ClientOnly } from '../ClientOnly.tsx';
import type { EditorProps } from './editor.tsx';

const LazyEditor = isServer ? null : lazy(() => import('./editor.tsx').then(r => ({ default: r.Editor })));

export const Editor: Component<EditorProps> = props => {
  return (
    <ClientOnly>
      {isServer || !LazyEditor ? null : (
        <Suspense>
          <LazyEditor {...props} />
        </Suspense>
      )}
    </ClientOnly>
  );
};
