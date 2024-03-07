export const splitStream = (splitOn: string) => {
  let buffer = '';
  return new TransformStream<string, string[]>({
    transform(chunk, controller) {
      buffer += chunk;
      const parts = buffer.split(splitOn);
      controller.enqueue(parts.slice(0, -1));
      buffer = parts[parts.length - 1] || '';
    },
    flush(controller) {
      if (buffer) controller.enqueue([buffer]);
    },
  });
};
