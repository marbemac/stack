import { mount } from '@marbemac/ui-solid-js/client';

import { App } from '~/root.tsx';

mount({
  Root: App,
  router: {
    preload: 'intent',
    preloadDelay: 250,
  },
});
