import type { Transform } from './types.ts';

export function subchain<S, T>(f: (x: ReadableStream<S>) => ReadableStream<T>): Transform<S, T> {
  const { readable, writable } = new TransformStream(undefined, { highWaterMark: 1 }, { highWaterMark: 0 });
  return {
    writable,
    readable: f(readable),
  };
}
