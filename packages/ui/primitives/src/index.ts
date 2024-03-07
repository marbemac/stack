/// <reference types="styled-jsx" />

/**
 * Only re-export very simple components and types from the root.
 *
 * Heavier components should get their own export in package.json (anything that uses radix).
 *
 * During development, some consumers such as nextjs process ALL of the modules in the import paths
 * for every route/page (no tree-shaking).
 *
 * Splitting things out into separate export paths
 * helps nextjs build fewer modules per page, speeding up build/re-build times.
 * See lines like "event compiled client and server successfully in 1139 ms (878 modules)" in next terminal logs.
 * Pay attention to the (X modules) bit.
 */

export * from './components/Button/button.tsx';
export * from './components/Card/card.tsx';
export * from './components/ClientOnly/ClientOnly.tsx';
export * from './components/Heading/heading.tsx';
export * from './components/Icon/icon.tsx';
export * from './components/Input/input.tsx';
export * from './components/Stack/stack.tsx';
export * from './components/Text/text.tsx';
export * from './hooks/use-clipboard.ts';
