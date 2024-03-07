import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button/button.tsx';
import { HStack, VStack } from '../Stack/stack.tsx';
import { Input } from './input.tsx';

const meta = {
  title: 'Components / Input',
  component: Input,
  parameters: { controls: { sort: 'requiredFirst' } },
  argTypes: {
    disabled: {
      control: 'boolean',
      defaultValue: false,
    },
    readOnly: {
      control: 'boolean',
      defaultValue: false,
    },
    size: {
      control: 'select',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
    },
  },
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
        <div className="w-36 underline">outline (default)</div>
        <Input {...args} />
      </HStack>

      <HStack spacing={5}>
        <div className="w-36 underline">ghost</div>
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
        size="md"
        {...args}
        endSectionWidth={80}
        endSection={
          <Button variant="solid" size="sm" input className="mr-1.5 h-4/6 text-xs">
            Subscribe
          </Button>
        }
      />

      <Input
        size="md"
        {...args}
        endSectionWidth={50}
        endSection={
          <Button variant="soft" size="sm" input className="mr-1.5 h-4/6 text-xs">
            ESC
          </Button>
        }
      />
    </VStack>
  ),
};
