import { createQueryClient, mount } from '@marbemac/ssr-react/client';
import { createTwind } from '@marbemac/ui-twind';
import { RouterProvider } from '@tanstack/router';

import { createRouter } from '~/router.tsx';

const { queryClient } = createQueryClient();
const twind = createTwind();

const router = createRouter({ twind, queryClient });
void router.hydrate();

mount({
  Root: () => <RouterProvider router={router} />,
});
