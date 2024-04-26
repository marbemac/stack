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

const nanoidShortToken = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');

// 33K tokens needed in order to have a 1% probability of at least one collision
export const generateShortToken = (length = 6) => {
  return nanoidShortToken(length);
};
