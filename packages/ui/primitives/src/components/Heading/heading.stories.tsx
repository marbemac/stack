import type { Meta } from '@storybook/react';

import { VStack } from '../Stack/stack.tsx';
import { Heading } from './heading.tsx';

const meta = {
  title: 'Components / Heading',
  component: Heading,
  parameters: { controls: { sort: 'requiredFirst' } },
} satisfies Meta<typeof Heading>;

export default meta;

export const Sizes = () => (
  <VStack spacing={4}>
    <Heading size={1} className="leading-1">
      The quick brown fox jumps over the lazy dog
    </Heading>
    <Heading size={2}>The quick brown fox jumps over the lazy dog</Heading>
    <Heading size={3}>The quick brown fox jumps over the lazy dog</Heading>
    <Heading size={4}>The quick brown fox jumps over the lazy dog</Heading>
    <Heading size={5}>The quick brown fox jumps over the lazy dog</Heading>
    <Heading size={6}>The quick brown fox jumps over the lazy dog</Heading>
    <Heading size={7}>The quick brown fox jumps over the lazy dog</Heading>
    <Heading size={8}>The quick brown fox jumps over the lazy dog</Heading>
    <Heading size={9}>The quick brown fox jumps over the lazy dog</Heading>
  </VStack>
);

export const Trim = () => (
  <VStack spacing={4} className="w-96">
    <Heading className="border-y border-dashed bg-neutral-soft-1">Without trim</Heading>

    <Heading trim="start" className="border-y border-dashed bg-neutral-soft-1">
      With trim (start)
    </Heading>

    <Heading trim="end" className="border-y border-dashed bg-neutral-soft-1">
      With trim (end)
    </Heading>

    <Heading trim="both" className="border-y border-dashed bg-neutral-soft-1">
      With trim (both)
    </Heading>

    <Heading trim="both" size={8} className="border-y border-dashed bg-neutral-soft-1">
      With trim (both)
    </Heading>

    <Heading trim="both" size={9} className="border-y border-dashed bg-neutral-soft-1">
      With trim (both)
    </Heading>
  </VStack>
);
