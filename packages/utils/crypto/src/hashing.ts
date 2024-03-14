import { generateAuthToken } from '@marbemac/utils-ids';
import type { StringWithAutocomplete } from '@marbemac/utils-types';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import { Argon2id } from 'oslo/password';

/**
 * Generates the token + a hash of the token.
 * This is useful for storing the token in a database.
 */
export const generateAuthTokenWithHash = async () => {
  const token = generateAuthToken();

  return {
    token,
    hashedToken: await hashAuthToken(token),
  };
};

export const hashAuthToken = async (token: string) => encodeHex(await sha256(new TextEncoder().encode(token)));

export type PasswordHasher = StringWithAutocomplete<'argon2'>;

export const hashPassword = async (password: string): Promise<{ hashedPassword: string; hasher: PasswordHasher }> => {
  return {
    hashedPassword: await new Argon2id().hash(password),
    hasher: 'argon2',
  };
};

export const verifyPassword = async (password: string, hashedPassword: string, hasher: PasswordHasher) => {
  if (hasher === 'argon2') {
    return new Argon2id().verify(hashedPassword, password);
  }

  throw new Error('Unknown hasher');
};
