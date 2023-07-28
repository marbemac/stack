import { mount } from '@marbemac/ssr-solid/client';

import { App } from '~/root.tsx';

mount({
  Root: App,
  router: {
    preload: 'intent',
    preloadDelay: 250,
  },
});
