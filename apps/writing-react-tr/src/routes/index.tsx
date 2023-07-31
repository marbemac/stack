import { Route } from '@tanstack/router';

import { rootRoute } from './root.tsx';

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Home() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    );
  },
});
