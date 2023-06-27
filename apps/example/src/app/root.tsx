import './root.css';

import type { RouteDefinition } from '@solidjs/router';
import { Link, Outlet } from '@solidjs/router';
import { import$ } from '@tanstack/bling';
import { createSignal, lazy, Suspense, useContext } from 'solid-js';
import { HydrationScript, NoHydration } from 'solid-js/web';

// import { useAction, useLoader } from './data/index.ts';
import { manifestContext } from './manifest.tsx';

// const sayHello = server$(() => console.log('Hello world'));

// const LazyHello3 = lazy(() =>
//   import$({
//     default: () => {
//       return (
//         <>
//           <button onClick={() => sayHello()}>Split up</button>
//         </>
//       );
//     },
//   }),
// );

// const inlineSecret = secret$('I am an inline server secret!');

export function App() {
  // console.log('Do you know the inline server secret?', inlineSecret ?? 'Not even.');

  // const [state, setState] = createSignal(0);

  return (
    <html>
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <div>Hello world</div>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Suspense fallback={'loading'}>
          <Outlet />
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}

function Scripts() {
  const manifest = useContext(manifestContext);
  return (
    <NoHydration>
      <HydrationScript />
      {import.meta.env.DEV ? (
        <>
          <script type="module" src="/@vite/client" $ServerOnly></script>
          <script type="module" src="/src/entry-client.tsx" $ServerOnly></script>
        </>
      ) : (
        <>
          <script type="module" src={manifest['entry-client']} $ServerOnly></script>
        </>
      )}
    </NoHydration>
  );
}

// let count = 0;

// const increment = server$(async () => {
//   count = count + 1;
//   return redirect('/about');
// });

export const routes = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '',
        component: lazy(() => import$({ default: () => <div>Home</div> })),
      },
    ],
  },
] satisfies RouteDefinition[];
