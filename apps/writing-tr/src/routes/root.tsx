import { Link, Outlet, RootRoute } from '@tanstack/router';
import React from 'react';

// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import type { RouterContext } from '~/router.tsx';
import { RouterHydrationContext } from '~/utils/router-hydration-context.ts';

export const rootRoute = RootRoute.withRouterContext<RouterContext>()({
  component: Root,
});

function Root() {
  console.log('BLAH');

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
      </head>

      <body tw="min-h-screen">
        <div>
          <div>
            <Link
              to="/"
              activeProps={{
                className: 'font-bold',
              }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>{' '}
            <Link
              to="/posts"
              activeProps={{
                className: 'font-bold',
              }}
            >
              Posts
            </Link>
            <Link
              to="/debug"
              activeProps={{
                className: 'font-bold',
              }}
            >
              Debug
            </Link>
          </div>
          <Outlet /> {/* Start rendering router matches */}
          {/* <Scripts /> */}
          {/* <TanStackRouterDevtools position="bottom-right" /> */}
          <DehydrateRouter />
        </div>
      </body>
    </html>
  );
}

export function DehydrateRouter() {
  const dehydrated = React.useContext(RouterHydrationContext);

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          window.__TSR_DEHYDRATED__ = ${JSON.stringify(dehydrated)}
        `,
      }}
    />
  );
}
