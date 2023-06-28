import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Box } from '@marbemac/ui-primitives';
import { useNavigate, useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';

import { Checkbox } from '~/components/Checkbox.js';
import { Icon } from '~/components/Icon.js';
import { QueryBoundary } from '~/components/QueryBoundary.js';
// import { deletePost, getPost, updatePost } from '~/db/posts/queries.js';
import type { Post, PostLookup } from '~/db/schema.js';
import { postQueries } from '~/domains/posts/web.js';

// export const postQuery = query$({
//   key: 'post',
//   schema: z.object({
//     lookup: postLookupSchema,
//   }),
//   queryFn: async ({ payload }) => {
//     console.log('postQuery.run');
//     await sleep();

//     return getPost(payload.lookup);
//   },
// });

// export const updatePostMutation = mutation$({
//   key: "updatePost",
//   schema: z.object({
//     lookup: postLookupSchema,
//     post: updatePostSchema,
//   }),
//   mutationFn: async ({ payload }) => {
//     console.log("addPost.run", payload);
//     await sleep();

//     return updatePost(payload.lookup, payload.post);
//   },
// });

// export const deletePostMutation = mutation$({
//   key: "deletePost",
//   schema: z.object({
//     lookup: postLookupSchema,
//   }),
//   mutationFn: async ({ payload }) => {
//     console.log("deletePost.run", payload);

//     return deletePost(payload.lookup);
//   },
// });

export default function PostHome() {
  // @ts-expect-error ignore
  const p = useParams<{ id: number }>();

  const queryRes = createQuery(() => ({
    ...postQueries.detail(p.id),
  }));

  return (
    <div>
      <QueryBoundary query={queryRes} loadingFallback="Loading...">
        {data => <PostPage post={data()} />}
      </QueryBoundary>
    </div>
  );
}

const PostPage = (props: { post: Post }) => {
  const navigate = useNavigate();

  return (
    <Box tw="flex flex-1 flex-col divide-y">
      {/* <div class="flex items-center h-16 px-8 justify-end gap-4">
        <ToggleDraft postId={props.post.id} isDraft={props.post.isDraft} />
        <DeletePostButton
          postId={props.post.id}
          onSuccess={() => {
            navigate("/posts", { replace: true });
          }}
        />
      </div> */}

      <Box tw="p-8">
        <Box tw="flex flex-col gap-4">
          <h1 class="text-2xl font-semibold">{props.post.title}</h1>
          <Box>{props.post.title}</Box>
        </Box>
      </Box>
    </Box>
  );
};

const ToggleDraft = (props: { postId: number; isDraft: number; class?: string }) => {
  const updatePost = updatePostMutation();

  return (
    <Checkbox
      checked={!!props.isDraft}
      label={`Is Draft`}
      name="isDraft"
      disabled={updatePost.isPending}
      class={updatePost.isPending ? 'opacity-50' : undefined}
      onChange={newVal => {
        updatePost.mutate({
          lookup: { id: props.postId },
          post: {
            isDraft: newVal ? 1 : 0,
          },
        });
      }}
    />
  );
};

const DeletePostButton = (props: { postId: number; class?: string; onSuccess?: () => void }) => {
  const deletePost = deletePostMutation();

  return (
    <button
      class="bg-slate-900 text-white appearance-none rounded px-1.5 py-1.5 disabled:opacity-50 text-xs"
      disabled={deletePost.isPending}
      onClick={() => {
        deletePost.mutate({ lookup: { id: props.postId } }, { onSuccess: props.onSuccess });
      }}
    >
      <Icon icon={faTrashAlt} />
    </button>
  );
};
