import { mount } from '@marbemac/ui-react/client';
import { RouterProvider } from '@tanstack/router';
import React from 'react';

import { createRouter } from '~/router.tsx';

const router = createRouter();
void router.hydrate();

const Wrap = router.options.Wrap || React.Fragment;

mount({
  Root: () => (
    <Wrap>
      <RouterProvider router={router} />
    </Wrap>
  ),
});
