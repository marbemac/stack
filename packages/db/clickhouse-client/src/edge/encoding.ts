/**
 * Original source: https://github.com/ClickHouse/clickhouse-js/blob/8ac409eebdddedf6f8816dfc1d7d982d9b0fdc22/src/client.ts#L281
 */

import { isReadableStream, mapStream } from '@marbemac/utils-streams';

import type { DataFormat, InsertValues } from '../types.ts';
import { encodeJSON, isStreamableJSONFamily } from './formatter.ts';

/**
 * A function encodes an array or a stream of JSON objects to a format compatible with ClickHouse.
 * If values are provided as an array of JSON objects, the function encodes it in place.
 * If values are provided as a stream of JSON objects, the function sets up the encoding of each chunk.
 * If values are provided as a raw non-object stream, the function does nothing.
 *
 * @param values a set of values to send to ClickHouse.
 * @param format a format to encode value to.
 */
export function encodeValues<T>(values: InsertValues<T>, format: DataFormat): string | ReadableStream {
  if (isReadableStream(values)) {
    // JSON* formats streams
    if (isStreamableJSONFamily(format)) {
      return values.pipeThrough(mapStream(value => encodeJSON(value, format)));
    }

    // TSV/CSV/CustomSeparated formats don't require additional serialization
    return values;
  }

  // JSON* arrays
  if (Array.isArray(values)) {
    return values.map(value => encodeJSON(value, format)).join('');
  }

  // JSON & JSONObjectEachRow format input
  if (typeof values === 'object') {
    return encodeJSON(values, format);
  }

  throw new Error(`Cannot encode values of type ${typeof values} with ${format} format`);
}
