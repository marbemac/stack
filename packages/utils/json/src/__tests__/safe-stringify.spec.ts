import { expect, it } from 'vitest';

import { safeStringify } from '../safe-stringify.ts';

it('should work', () => {
  const val = { foo: true };
  expect(safeStringify(val)).toEqual('{"foo":true}');
  expect(safeStringify([0, 1])).toEqual('[0,1]');
});

it('should not serialize undefined', () => {
  expect(safeStringify(undefined)).toBeUndefined();
});

it('should handle falsey values correctly', () => {
  expect(safeStringify(null)).toBe('null');
  expect(safeStringify(0)).toBe('0');
  expect(safeStringify(-0)).toBe('0');
  expect(safeStringify(NaN)).toBe('null');
  expect(safeStringify(false)).toBe('false');
  expect(safeStringify({ value: undefined })).toBe('{}');
});

it('should not stringify something that is already a string', () => {
  // invalid json (for example coming from user in code editor) SHOULD not stringify again
  expect(safeStringify('{"foo": "bar",}')).toBe('{"foo": "bar",}');
  expect(safeStringify(JSON.stringify({ foo: 'bar' }))).toBe(JSON.stringify({ foo: 'bar' }));
});
