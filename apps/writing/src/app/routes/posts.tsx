import type { SubmitHandler } from '@modular-forms/solid';
import { createForm, reset, zodForm } from '@modular-forms/solid';
import { A, Outlet, useNavigate } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { For, Show } from 'solid-js';

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

  // const queryRes = postsQuery();
  const queryRes = createQuery(() => ({
    ...postQueries.list(),
  }));

  return (
    <div class="min-h-screen flex divide-x">
      <div class="flex flex-col flex-1 divide-y">
        {/* <AddPostForm
          onSuccess={res => {
            navigate(`/posts/${res.id}`);
          }}
        /> */}

        <QueryBoundary query={queryRes} loadingFallback="Loading...">
          {data => <PostsList posts={data().items} />}
        </QueryBoundary>
      </div>

      <div class="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

const PostsList = (props: { posts: Post[] }) => {
  return (
    <div class="divide-y">
      <Show
        when={props.posts.length}
        fallback={<div class="text-center py-24 text-gray-400">No posts... add one above</div>}
      >
        <For each={props.posts}>
          {post => (
            <A
              href={`/posts/${post.id}`}
              class="flex p-4 items-center"
              activeClass="bg-sky-50"
              inactiveClass="hover:bg-slate-50"
            >
              <div class="font-medium flex-1">{post.title}</div>
              <Show when={post.isDraft}>
                <div class="border text-slate-600 rounded uppercase text-xs py-0.5 px-1">draft</div>
              </Show>
            </A>
          )}
        </For>
      </Show>
    </div>
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
