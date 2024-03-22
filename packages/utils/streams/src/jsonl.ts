import type { Transform } from './types.ts';

export function toJsonl<T>(): Transform<T, string> {
  let first = true;

  return new TransformStream<T, string>(
    {
      transform(chunk, controller) {
        controller.enqueue(`${first ? '' : '\n'}${JSON.stringify(chunk)}`);
        first = false;
      },
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );
}
