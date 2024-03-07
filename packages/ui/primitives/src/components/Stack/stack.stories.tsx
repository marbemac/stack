import type { Meta, StoryObj } from '@storybook/react';

import { Stack, VStack } from './stack.tsx';

const meta = {
  title: 'Components / Stack',
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  render: () => (
    <VStack spacing={4}>
      <div className="text-fg">text-fg</div>
      <div className="text-muted">text-muted</div>
      <div className="text-soft">text-fg-soft</div>
    </VStack>
  ),
};

export const WithDivider: Story = {
  render: () => (
    <VStack divider className="w-40 border">
      <div className="px-4 py-3">Item</div>
      <div className="px-4 py-3">Item</div>
      <div className="px-4 py-3">Item</div>
      <div className="px-4 py-3">Item</div>
      <div className="px-4 py-3">Item</div>
    </VStack>
  ),
};
