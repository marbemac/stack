import type { TPostId } from '@libs/db-model/ids';
import { Box } from '@marbemac/ui-primitives-react';
import { Themed } from '@marbemac/ui-theme-next';

import { ToggleTheme } from '~/components/ToggleTheme.tsx';
import { getPost } from '~/lib/fetchers/posts.ts';

export default async function Post({ params }: { params: { postId: TPostId } }) {
  console.log('Post.render');

  const post = await getPost(params.postId);

  return (
    <Box tw="flex flex-1 flex-col divide-y">
      {/* <HStack className="h-16 items-center justify-end px-8" spacing={4}>
        <ToggleDraft postId={props.post.id} isDraft={props.post.isDraft} />
        <DeletePostButton
          postId={props.post.id}
          onSuccess={() => {
            void navigate({ to: '/posts', replace: true });
          }}
        />
      </HStack> */}

      <Box tw="p-8">
        <Box tw="flex flex-col gap-4">
          <Themed theme="default_dark">
            <h1 className="text-2xl font-semibold">{post.title}</h1>
            <Box>{post.content}</Box>
          </Themed>

          {/* <Link to="/posts/$postId/edit" params={{ postId: props.post.id }}>
            Edit
          </Link> */}

          <ToggleTheme />
        </Box>
      </Box>
    </Box>
  );
}
