import { Box } from '@marbemac/ui-primitives';
import { tw } from '@marbemac/ui-styles';
import { createForm, reset, type SubmitHandler, zodForm } from '@modular-forms/solid';
import { Outlet, useNavigate } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { For, Show } from 'solid-js';

import { Link } from '~/components/Link.js';
import { QueryBoundary } from '~/components/QueryBoundary.js';
import { TextField } from '~/components/TextField.js';
import { postQueries } from '~/domains/posts/web.js';
// import { insertPost, listPosts } from '~/db/posts/queries.js';
import type { InsertablePost, Post } from '~/domains/schema';
import { insertPostSchema } from '~/domains/schema.js';
import { cn } from '~/utils/cn.js';

// export const postsQuery = query$({
//   key: 'posts',
//   queryFn: async () => {
//     console.log('postsQuery.run');
//     await sleep();

//     const posts = listPosts();

//     return { items: posts };
//   },
// });

// export const addPostMutation = mutation$({
//   key: 'addPost',
//   schema: insertPostSchema,
//   mutationFn: async ({ payload }) => {
//     console.log('addPost.run', payload);
//     await sleep();

//     return insertPost(payload);
//   },
// });

// type AddPostMutationRes = NonNullable<ReturnType<typeof addPostMutation>['data']>;

export default function PostsLayout() {
  const navigate = useNavigate();

  const queryRes = createQuery(() => ({
    ...postQueries.list(),
  }));

  return (
    <Box tw="flex min-h-screen w-full divide-x">
      <Box tw="flex flex-1 flex-col divide-y">
        <Box>
          <Link href="/">Back to home</Link>
        </Box>
        {/* <AddPostForm
          onSuccess={res => {
            navigate(`/posts/${res.id}`);
          }}
        /> */}

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
  return (
    <Box tw="divide-y">
      <Show
        when={props.posts.length}
        fallback={<Box tw="py-24 text-center text-fg-muted">No posts... add one above</Box>}
      >
        <For each={props.posts}>
          {post => (
            <Link
              href={`/posts/${post.id}`}
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

const AddPostForm = (props: { class?: string; onSuccess?: (res: AddPostMutationRes) => void }) => {
  const addPost = addPostMutation();
  const [addPostForm, AddPost] = createForm<InsertablePost>({
    initialValues: { title: '' },
    validate: zodForm(insertPostSchema),
  });

  const handleSubmit: SubmitHandler<InsertablePost> = async values => {
    const res = await addPost.mutateAsync(values);

    reset(addPostForm);

    if (props.onSuccess) {
      props.onSuccess(res);
    }
  };

  return (
    <AddPost.Form onSubmit={handleSubmit} class={cn('flex px-4 items-center h-16', props.class)}>
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
        <button
          type="submit"
          disabled={addPostForm.submitting}
          class="bg-slate-900 text-white appearance-none rounded px-2 py-1 disabled:opacity-50"
        >
          {addPostForm.submitting ? 'Adding...' : 'Add Post'}
        </button>
      </div>
    </AddPost.Form>
  );
};
