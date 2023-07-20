import type { TPostId } from '@libs/db-model/ids';
import type { Post } from '@libs/db-model/schema';
import { Box } from '@marbemac/ui-primitives';
import { useParams } from '@solidjs/router';

import { Editor } from '~/components/Editor/index.ts';
import { QueryBoundary } from '~/components/QueryBoundary.js';
import { useTrpc } from '~/utils/trpc.ts';

export default function PostEditor() {
  const p = useParams<{ id: TPostId }>();
  const queryRes = useTrpc().posts.byId.useQuery(() => ({ postId: p.id }));

  return (
    <div>
      <QueryBoundary query={queryRes} loadingFallback="Loading...">
        {data => <PostEditorPage post={data()} />}
      </QueryBoundary>
    </div>
  );
}

const PostEditorPage = (props: { post: Post }) => {
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
          <Box>
            <Editor initialContent={props.post.content} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
