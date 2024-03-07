import type { DomainName } from './types.ts';

/**
 * Best effort to return the appropriate root level domain.
 *
 * Examples:
 * - non.se.com => se.com
 * - ext.wefox.com => wefox.com
 * - sub.ext.wefox.com => wefox.com
 * - students.oamk.fi => oamk.fi
 * - team.blue => team.blue
 * - avamae.co.uk => avamae.co.uk
 * - pexa.com.au => pexa.com.au
 * - sub.pexa.com.au => pexa.com.au
 */
export const getRootDomain = (domain: DomainName) => {
  const domainParts = domain.split('.');

  // if the domain has 3 or more parts, and the second to last part is one of these, include 3 parts
  if (
    domainParts.length >= 3 &&
    ['co', 'com', 'gov', 'net', 'org'].includes(domainParts[domainParts.length - 2] || '')
  ) {
    return `${domainParts.splice(-3).join('.')}`;
  } else if (domainParts.length >= 2) {
    // include 2 parts
    return `${domainParts.splice(-2).join('.')}`;
  }

  return domain;
};
