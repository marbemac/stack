import type { TPostId } from '@libs/db-model/ids';
import { type InsertablePost, insertPostSchema, type Post } from '@libs/db-model/schema';
import type { TrpcRouterOutput } from '@libs/internal-api';
import { Box, Button } from '@marbemac/ui-primitives';
import { tw } from '@marbemac/ui-styles';
import type { SubmitHandler } from '@modular-forms/solid';
import { createForm, reset, zodForm } from '@modular-forms/solid';
import { Outlet, useNavigate, useParams } from '@solidjs/router';
import { For, Show } from 'solid-js';

import { Link } from '~/components/Link.js';
import { QueryBoundary } from '~/components/QueryBoundary.js';
import { TextField } from '~/components/TextField.tsx';
import { useTrpc } from '~/utils/trpc.ts';

export default function PostsLayout() {
  const navigate = useNavigate();
  const queryRes = useTrpc().posts.list.useQuery();

  return (
    <Box tw="flex min-h-screen w-full divide-x">
      <Box tw="flex flex-1 flex-col divide-y">
        <Box>
          <Link href="/">Back to home</Link>
        </Box>
        <AddPostForm
          onSuccess={res => {
            navigate(`/posts/${res.id}`);
          }}
        />

        <QueryBoundary query={queryRes} loadingFallback="Loading...">
          {data => <PostsList posts={data().items} />}
        </QueryBoundary>
      </Box>

      <Box tw="flex-1">
        <Outlet />
      </Box>
    </Box>
  );
}

const PostsList = (props: { posts: Post[] }) => {
  const p = useParams<{ id: TPostId }>();

  return (
    <Box tw="divide-y">
      <Show
        when={props.posts.length}
        fallback={<Box tw="py-24 text-center text-fg-muted">No posts... add one above</Box>}
      >
        <For each={props.posts}>
          {post => (
            <Link
              href={p.id === post.id ? '/posts' : `/posts/${post.id}`}
              tw="flex items-center p-4"
              activeTw={tw('bg-primary-subtle')}
              inactiveTw={tw('hover:bg-neutral-subtle')}
            >
              <Box tw="flex-1 font-medium">{post.title}</Box>
              <Show when={post.isDraft}>
                <Box tw="rounded border px-1 py-0.5 text-xs uppercase text-fg-muted">draft</Box>
              </Show>
            </Link>
          )}
        </For>
      </Show>
    </Box>
  );
};

const AddPostForm = (props: { onSuccess?: (res: TrpcRouterOutput['posts']['create']) => void }) => {
  const createPost = useTrpc().posts.create.useMutation();
  const [addPostForm, AddPost] = createForm<InsertablePost>({
    initialValues: { title: '' },
    validate: zodForm(insertPostSchema),
  });

  const handleSubmit: SubmitHandler<InsertablePost> = async values => {
    const res = await createPost.mutateAsync(values);

    reset(addPostForm);

    if (props.onSuccess) {
      props.onSuccess(res);
    }
  };

  return (
    <Box as={AddPost.Form} onSubmit={handleSubmit} tw="flex h-16 items-center px-4">
      <AddPost.Field name="title">
        {(field, props) => (
          <TextField
            {...props}
            {...field}
            class="flex-1 self-stretch"
            inputClass="h-full w-full"
            placeholder="New post title..."
          />
        )}
      </AddPost.Field>

      <div>
        <Button as="button" type="submit" disabled={addPostForm.submitting}>
          {addPostForm.submitting ? 'Adding...' : 'Add Post'}
        </Button>
      </div>
    </Box>
  );
};
