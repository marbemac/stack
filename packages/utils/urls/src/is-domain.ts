import type { DomainName } from './types.ts';

const VALID_DOMAIN_CHARACTERS = /^[A-Za-z0-9-.]{3,200}$/;

/**
 * VERY basic check, does not need to be comprehensive. Better to be more permissive than miss valid domains.
 */
export const isDomain = (maybeDomain: unknown): maybeDomain is DomainName => {
  return Boolean(
    typeof maybeDomain === 'string' && maybeDomain.includes('.') && maybeDomain.match(VALID_DOMAIN_CHARACTERS),
  );
};
