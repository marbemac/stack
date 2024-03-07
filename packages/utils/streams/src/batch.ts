import type { Transform } from './types.ts';

export function batch<T>(count: number): Transform<T, T[]> {
  let buffer: T[] = [];
  return new TransformStream<T, T[]>(
    {
      async transform(chunk, controller) {
        buffer.push(chunk);
        if (buffer.length === count) {
          controller.enqueue(buffer);
          buffer = [];
        }
      },
      flush(controller) {
        if (buffer.length > 0) {
          controller.enqueue(buffer);
        }
      },
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );
}
