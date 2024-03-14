import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz');

/**
 * Generates a semi-readable token for use in password resets, magic links, etc.
 *
 * @example output
 * kkdew-hnqvu-yiurl-svmca
 */
export const generateAuthToken = () => {
  return [...Array(4)].map(() => nanoid(5)).join('-');
};
