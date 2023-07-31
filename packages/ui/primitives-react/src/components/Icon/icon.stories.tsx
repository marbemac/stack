import type { Meta } from '@storybook/react';

import { HStack, VStack } from '../Stack/index.ts';
import { Icon } from './icon.tsx';

const meta = {
  title: 'Components / Icon',
  component: Icon,
  parameters: { controls: { sort: 'requiredFirst' } },
} satisfies Meta<typeof Icon>;

export default meta;

export const Basic = {
  render: () => (
    <VStack spacing={4}>
      <HStack spacing={5} tw="text-3xl">
        <Icon icon="house" tw="text-success-fg" />
        <Icon icon="rocket-launch" />
        <Icon icon="spinner" spin />
      </HStack>
    </VStack>
  ),
};
