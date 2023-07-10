import { mount } from '@marbemac/ui-solid-js/client';

import { App } from '~/root.js';

mount({
  Root: App,
  router: {
    preload: 'intent',
    preloadDelay: 500,
  },
});
