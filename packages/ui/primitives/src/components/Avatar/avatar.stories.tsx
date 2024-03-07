import type { Meta } from '@storybook/react';

import { HStack, VStack } from '../Stack/stack.tsx';
import { Avatar } from './avatar.tsx';

const meta = {
  title: 'Components / Avatar',
  component: Avatar,
  parameters: { controls: { sort: 'requiredFirst' } },
} satisfies Meta<typeof Avatar>;

export default meta;

const avatarUrl = 'https://bit.ly/dan-abramov';

export const Basic = {
  render: () => (
    <VStack spacing={4}>
      <Avatar src={avatarUrl} name="Dan" />

      <Avatar name="Dan" />
    </VStack>
  ),
};

export const Sizes = {
  render: () => {
    return (
      <VStack spacing={8}>
        <HStack spacing={4}>
          <Avatar src={avatarUrl} name="John" size="2xl" />
          <Avatar src={avatarUrl} name="John" size="xl" />
          <Avatar src={avatarUrl} name="John" size="lg" />
          <Avatar src={avatarUrl} name="John" size="md" />
          <Avatar src={avatarUrl} name="John" size="sm" />
        </HStack>

        <HStack spacing={3}>
          <Avatar name="John" size="2xl" />
          <Avatar name="John" size="xl" />
          <Avatar name="John" size="lg" />
          <Avatar name="John" size="md" />
          <Avatar name="John" size="sm" />
        </HStack>

        <HStack spacing={3}>
          <Avatar name="John" size="2xl" className="rounded-full" />
          <Avatar name="Sam" size="xl" className="rounded-full" />
          <Avatar name="Marc" size="lg" className="rounded-full" />
          <Avatar name="Jack" size="md" className="rounded-full" />
          <Avatar name="Chris" size="sm" className="rounded-full" />
        </HStack>
      </VStack>
    );
  },
};

export const Icons = {
  render: () => {
    return (
      <VStack spacing={8}>
        <HStack spacing={3}>
          <Avatar icon="user-alt" size="2xl" className="rounded-full" />
          <Avatar icon="rocket-launch" size="xl" className="rounded-full" />
          <Avatar icon="cube" size="lg" className="rounded-full" />
          <Avatar icon="plus" size="md" className="rounded-full" />
          <Avatar icon="plus" size="sm" className="rounded-full" />
        </HStack>
      </VStack>
    );
  },
};

export const Fallback = {
  render: () => {
    return (
      <VStack spacing={8}>
        <HStack spacing={3}>
          <Avatar name="Sally" size="2xl" src="https://bit.ly/broken-link" />
        </HStack>
      </VStack>
    );
  },
};
