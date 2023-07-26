import { Route } from '@tanstack/router';

import { useTrpc } from '~/utils/trpc.ts';

import { postsRoute } from '../posts.tsx';

export const postIdRoute = new Route({
  getParentRoute: () => postsRoute,
  path: '$postId',
  loader: ({ context, params: { postId } }) => {
    return context.trpc.posts.byId.ensureQueryData({ postId });
  },
  component: function Post({ useParams }) {
    console.log('PostId.render');

    const { postId } = useParams();
    const postQuery = useTrpc().posts.byId.useQuery({ postId });

    return (
      <div className="space-y-2">
        <h4 className="text-xl font-bold underline">{postQuery.data?.title}</h4>
        <div className="text-sm">{postQuery.data?.content}</div>
      </div>
    );
  },
});
