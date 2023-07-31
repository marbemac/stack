import type { Meta, StoryObj } from '@storybook/react';

import { Box } from '../Box/index.ts';
import { HStack, VStack } from '../Stack/index.ts';
import type { ButtonProps } from './button.tsx';
import { Button } from './button.tsx';

const meta = {
  title: 'Components / Button',
  component: Button,
  parameters: { controls: { sort: 'requiredFirst' } },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  args: {
    size: 'md',
    isDisabled: false,
    isLoading: false,
  },
  render: args => (
    <VStack spacing={10}>
      <HStack spacing={5}>
        <Box tw="w-36 underline">outline (default)</Box>

        <Button {...args}>neutral</Button>
        <Button {...args} intent="primary">
          primary
        </Button>
        <Button {...args} intent="success">
          success
        </Button>
        <Button {...args} intent="warning">
          warning
        </Button>
        <Button {...args} intent="danger">
          danger
        </Button>
      </HStack>

      <HStack spacing={5}>
        <Box tw="w-36 underline">solid</Box>

        <Button {...args} variant="solid">
          neutral
        </Button>
        <Button {...args} variant="solid" intent="primary">
          primary
        </Button>
        <Button {...args} variant="solid" intent="success">
          success
        </Button>
        <Button {...args} variant="solid" intent="warning">
          warning
        </Button>
        <Button {...args} variant="solid" intent="danger">
          danger
        </Button>
      </HStack>

      <HStack spacing={5}>
        <Box tw="w-36 underline">soft</Box>

        <Button {...args} variant="soft">
          neutral
        </Button>
        <Button {...args} variant="soft" intent="primary">
          primary
        </Button>
        <Button {...args} variant="soft" intent="success">
          success
        </Button>
        <Button {...args} variant="soft" intent="warning">
          warning
        </Button>
        <Button {...args} variant="soft" intent="danger">
          danger
        </Button>
      </HStack>

      <HStack spacing={5}>
        <Box tw="w-36 underline">ghost</Box>

        <Button {...args} variant="ghost">
          neutral
        </Button>
        <Button {...args} variant="ghost" intent="primary">
          primary
        </Button>
        <Button {...args} variant="ghost" intent="success">
          success
        </Button>
        <Button {...args} variant="ghost" intent="warning">
          warning
        </Button>
        <Button {...args} variant="ghost" intent="danger">
          danger
        </Button>
      </HStack>
    </VStack>
  ),
};

export const Sizes = (props: ButtonProps) => {
  return (
    <VStack spacing={10}>
      <HStack spacing={8}>
        <Button {...props} size="sm">
          Login (sm)
        </Button>
        <Button {...props} size="md">
          Login (md)
        </Button>
        <Button {...props} size="lg">
          Login (lg)
        </Button>
      </HStack>
    </VStack>
  );
};

export const FullWidth = (props: ButtonProps) => {
  return (
    <HStack spacing={4}>
      <div style={{ width: '200px' }}>
        <Button fullWidth {...props}>
          Full width button
        </Button>
      </div>

      <div style={{ width: '130px' }}>
        <Button {...props}>Button with overflow</Button>
      </div>
    </HStack>
  );
};

export const WithIcons = (props: ButtonProps) => {
  return (
    <VStack spacing={6}>
      <Button startIcon="rocket-launch" {...props}>
        Lift-off!
      </Button>

      <HStack spacing={4}>
        <Button startIcon="arrow-left" variant="outline" {...props}>
          Previous Page
        </Button>
        <Button endIcon="arrow-right" variant="outline" {...props}>
          Next Page
        </Button>
      </HStack>

      <HStack spacing={4}>
        <Button startIcon="copy" {...props}>
          Copy
        </Button>
        <Button startIcon="search" {...props}>
          Search
        </Button>
        <Button startIcon="code" {...props}>
          Code
        </Button>
        <Button startIcon="layer-group" {...props}>
          Stack It
        </Button>
        <Button endIcon="arrow-right" {...props}>
          Next Page
        </Button>
        <Button startIcon="page" endIcon="arrow-right" {...props}>
          Next Page
        </Button>
      </HStack>
    </VStack>
  );
};

export const Loading = (props: ButtonProps) => {
  return (
    <VStack spacing={6}>
      <HStack spacing={4}>
        <Button isLoading {...props}>
          Loading
        </Button>
        <Button isLoading loadingText="Processing">
          Save
        </Button>
      </HStack>

      <HStack spacing={4}>
        <Button isLoading loadingText="Processing" loadingPlacement="start">
          Save
        </Button>
        <Button isLoading loadingText="Processing" loadingPlacement="end">
          Save
        </Button>
      </HStack>
    </VStack>
  );
};
