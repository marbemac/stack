import { zodResolver } from '@hookform/resolvers/zod';
import { type InsertablePost, insertPostSchema, type Post } from '@libs/db-model/schema';
import type { TrpcRouterOutput } from '@libs/internal-api';
import { useHead } from '@marbemac/ssr-react';
import { Box, Button, Form, FormInputField } from '@marbemac/ui-primitives-react';
import { tx } from '@marbemac/ui-styles';
import { Link, Outlet, Route, useNavigate, useParams } from '@tanstack/router';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useTrpc } from '~/utils/trpc.ts';

import { rootRoute } from './root.tsx';

export const postsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'posts',
  loader: ({ context }) => {
    void context.trpc.posts.list.ensureQueryData(undefined);
  },
  pendingComponent: () => <div>loading...</div>,
  component: function PostsRoute() {
    console.log('Posts.render');

    useHead({ title: 'Posts page' });

    const navigate = useNavigate();

    const posts = useTrpc().posts.list.useQuery();
    if (posts.isLoading || !posts.data) {
      return <div>no data...</div>;
    }

    return (
      <Box tw="flex min-h-screen w-full divide-x">
        <Box tw="flex flex-1 flex-col divide-y">
          <AddPostForm
            onSuccess={res => {
              void navigate({ to: '/posts/$postId', params: { postId: res.id } });
            }}
          />

          <PostsList posts={posts.data.items} />
        </Box>

        <Box tw="flex-1">
          <Outlet />
        </Box>
      </Box>
    );
  },
});

const PostsList = ({ posts }: { posts: Post[] }) => {
  const { postId } = useParams();

  if (!posts.length) {
    return <Box tw="py-24 text-center text-fg-muted">No posts... add one above</Box>;
  }

  return (
    <Box tw="divide-y">
      {posts.map(post => {
        const isActive = post.id === postId;

        return (
          <Box
            key={post.id}
            as={Link}
            to={isActive ? '/posts' : `/posts/$postId`}
            params={{ postId: post.id }}
            tw={[
              'flex items-center p-4',
              isActive && tx('bg-primary-subtle'),
              !isActive && tx('hover:bg-neutral-subtle'),
            ]}
          >
            <Box tw="flex-1 font-medium">{post.title}</Box>
            {post.isDraft ? <Box tw="rounded border px-1 py-0.5 text-xs uppercase text-fg-muted">draft</Box> : null}
          </Box>
        );
      })}
    </Box>
  );
};

const AddPostForm = (props: { onSuccess?: (res: TrpcRouterOutput['posts']['create']) => void }) => {
  const createPost = useTrpc().posts.create.useMutation();

  const methods = useForm<InsertablePost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit: SubmitHandler<InsertablePost> = async data => {
    const res = await createPost.mutateAsync(data);

    methods.reset();

    if (props.onSuccess) {
      props.onSuccess(res);
    }
  };

  const submitElem = (
    <Button type="submit" variant="solid" disabled={methods.formState.isSubmitting} tw="mr-2">
      {methods.formState.isSubmitting ? 'Adding...' : 'Add Post'}
    </Button>
  );

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <FormInputField
        control={methods.control}
        name="title"
        inputProps={{ variant: 'ghost', size: 'lg', placeholder: 'New post title...', endSection: submitElem }}
      />
    </Form>
  );
};
