import { Box } from '@marbemac/ui-primitives-react';
import { Route } from '@tanstack/router';

import { rootRoute } from './root.tsx';

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Home() {
    return (
      <Box tw="p-2 text-danger-solid">
        <h3>Welcome Home!</h3>
      </Box>
    );
  },
});
