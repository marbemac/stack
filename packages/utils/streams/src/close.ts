export const closeWriter = <I>(writer: WritableStreamDefaultWriter | WritableStreamDefaultWriter[]) =>
  new TransformStream<I, I>({
    flush() {
      if (Array.isArray(writer)) {
        writer.map(w => w.close());
      } else {
        void writer.close();
      }
    },
  });
