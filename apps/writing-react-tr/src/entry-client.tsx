import { createQueryClient, mount } from '@marbemac/ssr-react/client';
import { RouterProvider } from '@tanstack/router';
import React from 'react';

import { createRouter } from '~/router.tsx';

const { queryClient } = createQueryClient();

const router = createRouter({ queryClient });
void router.hydrate();

const Wrap = router.options.Wrap || React.Fragment;

mount({
  Root: () => (
    <Wrap>
      <RouterProvider router={router} />
    </Wrap>
  ),
});
