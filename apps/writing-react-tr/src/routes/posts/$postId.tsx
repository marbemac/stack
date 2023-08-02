import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { TPostId } from '@libs/db-model/ids';
import type { Post } from '@libs/db-model/schema';
import { useHead } from '@marbemac/ssr-react';
import { Box, Button, HStack } from '@marbemac/ui-primitives-react';
import { Link, Route, useNavigate } from '@tanstack/router';

import { Checkbox } from '~/components/Forms/Checkbox.tsx';
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
    const post = postQuery.data;

    useHead({ title: `Post - ${postQuery.data?.title}` });

    if (!post) {
      return <div>loading...</div>;
    }

    return <PostPage post={post} />;
  },
});

const PostPage = (props: { post: Post }) => {
  const navigate = useNavigate();

  return (
    <Box tw="flex flex-1 flex-col divide-y">
      <HStack tw="h-16 items-center justify-end px-8" spacing={4}>
        <ToggleDraft postId={props.post.id} isDraft={props.post.isDraft} />
        <DeletePostButton
          postId={props.post.id}
          onSuccess={() => {
            void navigate({ to: '/posts', replace: true });
          }}
        />
      </HStack>

      <Box tw="p-8">
        <Box tw="flex flex-col gap-4">
          <Box as="h1" tw="text-2xl font-semibold">
            {props.post.title}
          </Box>
          <Box>{props.post.content}</Box>
          <Link to="/posts/$postId/edit" params={{ postId: props.post.id }}>
            Edit
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

const ToggleDraft = (props: { postId: TPostId; isDraft: number; class?: string }) => {
  const updatePost = useTrpc().posts.update.useMutation();

  return (
    <Checkbox
      checked={!!props.isDraft}
      label="Is Draft"
      name="isDraft"
      disabled={updatePost.isPending}
      tw={updatePost.isPending ? 'opacity-50' : undefined}
      onCheckedChange={newVal => {
        updatePost.mutate({
          lookup: { id: props.postId },
          values: {
            isDraft: newVal ? 1 : 0,
          },
        });
      }}
    />
  );
};

const DeletePostButton = (props: { postId: TPostId; class?: string; onSuccess?: () => void }) => {
  const deletePost = useTrpc().posts.delete.useMutation();

  return (
    <Button
      variant="solid"
      size="sm"
      intent="danger"
      disabled={deletePost.isPending}
      startIcon={faTrashAlt}
      onClick={() => {
        deletePost.mutate({ lookup: { id: props.postId } }, { onSuccess: props.onSuccess });
      }}
    />
  );
};
