import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import type { TPostId } from '@libs/db-model/ids';
import type { Post } from '@libs/db-model/schema';
import { Box } from '@marbemac/ui-primitives';
import { useNavigate, useParams } from '@solidjs/router';

import { Checkbox } from '~/components/Checkbox.tsx';
import { Icon } from '~/components/Icon.tsx';
import { Link } from '~/components/Link.js';
import { QueryBoundary } from '~/components/QueryBoundary.js';
import { useTrpc } from '~/utils/trpc.ts';

export default function PostHome() {
  const p = useParams<{ id: TPostId }>();
  const queryRes = useTrpc().posts.nested.byId.useQuery(() => ({ postId: p.id }));

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
      <Box tw="flex h-16 items-center justify-end gap-4 px-8">
        <ToggleDraft postId={props.post.id} isDraft={props.post.isDraft} />
        <DeletePostButton
          postId={props.post.id}
          onSuccess={() => {
            navigate('/posts', { replace: true });
          }}
        />
      </Box>

      <Box tw="p-8">
        <Box tw="flex flex-col gap-4">
          <h1 class="text-2xl font-semibold">{props.post.title}</h1>
          <Box>{props.post.content}</Box>
          <Link href={`/posts/${props.post.id}/edit`}>Edit</Link>
        </Box>
      </Box>
    </Box>
  );
};

const ToggleDraft = (props: { postId: TPostId; isDraft: number; class?: string }) => {
  const trpc = useTrpc();
  const updatePost = trpc.posts.update.useMutation(() => ({
    onSuccess(data) {
      trpc.posts.byId.invalidate({ postId: data.id }, { exact: true }, { cancelRefetch: true });
      trpc.posts.list.invalidate();
    },
  }));

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
    <Box
      as="button"
      tw="appearance-none rounded bg-danger-solid p-1.5 text-xs text-white disabled:opacity-50"
      disabled={deletePost.isPending}
      onClick={() => {
        deletePost.mutate({ lookup: { id: props.postId } }, { onSuccess: props.onSuccess });
      }}
    >
      <Icon icon={faTrashAlt} />
    </Box>
  );
};
