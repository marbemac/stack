import StarterKit from '@tiptap/starter-kit';
import { createTiptapEditor } from 'solid-tiptap';

export type EditorProps = { initialContent: string };

export const Editor = (props: EditorProps) => {
  let ref!: HTMLDivElement;

  const editor = createTiptapEditor(() => ({
    element: ref!,
    extensions: [StarterKit],
    content: props.initialContent,
  }));

  return <div id="editor" ref={ref} />;
};
