export const isReadableStream = (val: unknown): val is ReadableStream =>
  val !== null &&
  typeof val === 'object' &&
  // @ts-expect-error ignore
  typeof val.pipeTo === 'function' &&
  // @ts-expect-error ignore
  typeof val.getReader === 'function';
