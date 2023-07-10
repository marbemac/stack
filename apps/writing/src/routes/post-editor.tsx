import { Box } from '@marbemac/ui-primitives';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import StarterKit from '@tiptap/starter-kit';
import { createTiptapEditor } from 'solid-tiptap';

import { QueryBoundary } from '~/components/QueryBoundary.js';
import { postQueries } from '~/domains/posts/web.js';
import type { Post } from '~/domains/schema.ts';

export default function PostEditor() {
  // @ts-expect-error ignore
  const p = useParams<{ id: number }>();

  const queryRes = createQuery(() => ({
    ...postQueries.detail(p.id),
  }));

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

const Editor = (props: { initialContent: string }) => {
  let ref!: HTMLDivElement;

  const editor = createTiptapEditor(() => ({
    element: ref!,
    extensions: [StarterKit],
    content: props.initialContent,
  }));

  return <div id="editor" ref={ref} />;
};
