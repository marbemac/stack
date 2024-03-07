import type { Meta } from '@storybook/react';

import { HStack, VStack } from '../Stack/stack.tsx';
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
      <HStack spacing={5} className="text-3xl">
        <Icon icon="house" className="text-danger" />
        <Icon icon="rocket-launch" />
        <Icon icon="spinner" spin />
      </HStack>
    </VStack>
  ),
};
