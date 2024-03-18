/**
 * Original source: https://github.com/ClickHouse/clickhouse-js/blob/main/src/utils/stream.ts
 */

import type { ResultSetStreamRow } from '../types.ts';
import { decode } from './formatter.ts';

export async function getAsText(stream: ReadableStream): Promise<string> {
  let result = '';
  const textDecoder = new TextDecoder();

  for await (const chunk of stream) {
    result += textDecoder.decode(chunk, { stream: true });
  }

  // flush
  result += textDecoder.decode();
  return result;
}

export const streamToRow = <T>() => {
  return new TransformStream<string[], ResultSetStreamRow<T>[]>({
    transform(rows, controller) {
      controller.enqueue(
        rows.map(r => ({
          text: r,
          json(): T {
            return decode(r, 'JSON');
          },
        })),
      );
    },
  });
};
