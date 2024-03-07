import type { Transform, TransformOpts } from './types.ts';

export function mapTruthy<S, T>(f: (x: S) => T | Promise<T>, opts?: TransformOpts): Transform<S, NonNullable<T>> {
  return new TransformStream<S, NonNullable<T>>(
    {
      async transform(chunk, controller) {
        try {
          const res = await f(chunk);
          if (res) {
            controller.enqueue(res);
          }
        } catch (error) {
          if (opts?.errorWriter) {
            void opts.errorWriter.write({ error });
          } else {
            controller.error(error);
          }
        }
      },
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );
}

export function mapStream<S, T>(f: (x: S) => T) {
  return new TransformStream<S, T>({
    transform(chunk, controller) {
      controller.enqueue(f(chunk));
    },
  });
}
