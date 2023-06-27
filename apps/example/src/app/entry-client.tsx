import { Router, useRoutes } from '@solidjs/router';
import { manifest } from 'astro:ssr-manifest';
import { hydrate } from 'solid-js/web';

import { manifestContext } from './manifest.js';
import { routes } from './root.js';

hydrate(() => {
  const Routes = useRoutes(routes);
  return (
    <manifestContext.Provider value={manifest}>
      <Router>
        <Routes />
      </Router>
    </manifestContext.Provider>
  );
}, document);
