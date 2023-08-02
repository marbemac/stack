import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../Box/index.ts';
import { Button } from '../Button/index.ts';
import { HStack, VStack } from '../Stack/index.ts';
import { Input } from './input.tsx';

const meta = {
  title: 'Components / Input',
  component: Input,
  parameters: { controls: { sort: 'requiredFirst' } },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Variants: Story = {
  args: {
    size: 'md',
    placeholder: 'example@acme.com',
  },
  render: args => (
    <VStack spacing={10}>
      <HStack spacing={5}>
        <Box tw="w-36 underline">outline (default)</Box>

        <Input {...args} />
      </HStack>

      <HStack spacing={5}>
        <Box tw="w-36 underline">ghost</Box>

        <Input {...args} variant="ghost" />
      </HStack>
    </VStack>
  ),
};

export const WithIcon: Story = {
  args: {
    placeholder: 'example@acme.com',
    startIcon: ['far', 'user-alt'],
    endIcon: ['far', 'envelope'],
  },
  render: args => (
    <VStack spacing={10}>
      <Input {...args} size="sm" />
      <Input {...args} size="md" />
      <Input {...args} size="lg" />
    </VStack>
  ),
};

export const WithSection: Story = {
  args: {
    placeholder: 'example@acme.com',
  },
  render: args => (
    <VStack spacing={10}>
      <Input
        {...args}
        size="md"
        endSectionWidth={80}
        endSection={
          <Button variant="solid" size="sm" tw="mr-1">
            Subscribe
          </Button>
        }
      />

      <Input
        {...args}
        size="lg"
        endSectionWidth={100}
        endSection={
          <Button variant="solid" size="md" tw="mr-1.5">
            Subscribe
          </Button>
        }
      />
    </VStack>
  ),
};
