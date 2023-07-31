import { Route } from '@tanstack/router';

import { postsRoute } from '../posts.tsx';

export const postsIndexRoute = new Route({
  getParentRoute: () => postsRoute,
  path: '/',
  component: function PostsList() {
    return <div>Select a post.</div>;
  },
});
