import { Route } from '@tanstack/router';

import { useTrpc } from '~/utils/trpc.ts';

import { postsRoute } from '../posts.tsx';

// export const postLoader = new Loader({
//   fn: async (postId: string) => {
//     console.log(`Fetching post with id ${postId}...`);

//     await new Promise(r => setTimeout(r, 1000 + Math.round(Math.random() * 300)));

//     return fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`).then(r => r.json() as Promise<PostType>);
//   },
//   onInvalidate: async () => {
//     await postsLoader.invalidate();
//   },
// });

export const postIdRoute = new Route({
  getParentRoute: () => postsRoute,
  path: '$postId',
  loader: ({ context, params: { postId } }) => {
    return context.trpc.posts.byId.ensureQueryData({ postId });
  },
  component: function Post({ useParams }) {
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
