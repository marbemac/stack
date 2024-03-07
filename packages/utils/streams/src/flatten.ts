export const flattenStream = <T extends any[]>() => {
  return new TransformStream<T, T[number]>({
    async transform(chunk, controller) {
      for (const c of chunk) {
        controller.enqueue(c);
      }
    },
  });
};
