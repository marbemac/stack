import { Router } from '@solidjs/router';
import { manifest } from 'astro:ssr-manifest';
import { hydrate } from 'solid-js/web';

import { manifestContext } from '~/manifest.js';
import { App } from '~/root.js';

hydrate(() => {
  return (
    <manifestContext.Provider value={manifest}>
      <Router>
        <App />
      </Router>
    </manifestContext.Provider>
  );
}, document);
