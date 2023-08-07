import type { TPostId } from '@libs/db-model/ids';
import { Themed } from '@marbemac/ui-theme-next';

import { ToggleTheme } from '~/components/ToggleTheme.tsx';
import { getPost } from '~/lib/fetchers/posts.ts';

export default async function Post({ params }: { params: { postId: TPostId } }) {
  console.log('Post.render');

  const post = await getPost(params.postId);

  return (
    <div className="flex flex-1 flex-col divide-y">
      {/* <HStack className="h-16 items-center justify-end px-8" spacing={4}>
        <ToggleDraft postId={props.post.id} isDraft={props.post.isDraft} />
        <DeletePostButton
          postId={props.post.id}
          onSuccess={() => {
            void navigate({ to: '/posts', replace: true });
          }}
        />
      </HStack> */}

      <div className="p-8">
        <div className="flex flex-col gap-4">
          <Themed theme="default_dark">
            <h1 className="text-2xl font-semibold">{post.title}</h1>
            <div>{post.content}</div>
          </Themed>

          {/* <Link to="/posts/$postId/edit" params={{ postId: props.post.id }}>
            Edit
          </Link> */}

          <ToggleTheme />
        </div>
      </div>
    </div>
  );
}
