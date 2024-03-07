import { tx } from '../tw.ts';

export const focusStyles = tx(
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1',
);

export const inputFocusStyles = tx(
  `outline-none focus-visible:shadow-border focus-visible:shadow-primary-1 focus-visible:ring-1
  focus-visible:ring-primary-1`,
);

export const focusWithinStyles = tx(
  'focus-visible-within:relative focus-visible-within:z-10',
  `outline-none focus-visible-within:shadow-border focus-visible-within:shadow-primary-1 focus-visible-within:ring-1
  focus-visible-within:ring-primary-1`,
);
