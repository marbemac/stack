import type { Meta, StoryObj } from '@storybook/react';

import { HStack, VStack } from '../Stack/stack.tsx';
import type { ButtonProps } from './button.tsx';
import { Button } from './button.tsx';
import { ButtonGroup } from './button-group.tsx';

const meta = {
  title: 'Components / Button',
  component: Button,
  parameters: { controls: { sort: 'requiredFirst' } },
  argTypes: {
    variant: {
      control: 'select',
      defaultValue: 'solid',
      options: ['solid', 'outline', 'soft', 'ghost'],
    },
    size: {
      control: 'select',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
      defaultValue: false,
    },
    isLoading: {
      control: 'boolean',
      defaultValue: false,
    },
    input: {
      control: 'boolean',
      defaultValue: false,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  args: {
    size: 'md',
    disabled: false,
    isLoading: false,
  },
  render: args => (
    <VStack spacing={10}>
      <HStack spacing={5}>
        <div className="w-36 underline">solid (default)</div>

        <Button {...args} variant="solid">
          neutral
        </Button>
        <Button {...args} variant="solid" intent="primary">
          primary
        </Button>
        <Button {...args} variant="solid" intent="danger">
          danger
        </Button>
      </HStack>

      <HStack spacing={5}>
        <div className="w-36 underline">outline</div>

        <Button {...args} variant="outline">
          neutral
        </Button>
        <Button {...args} variant="outline" intent="primary">
          primary
        </Button>
        <Button {...args} variant="outline" intent="danger">
          danger
        </Button>
      </HStack>

      <HStack spacing={5}>
        <div className="w-36 underline">soft</div>

        <Button {...args} variant="soft">
          neutral
        </Button>
        <Button {...args} variant="soft" intent="primary">
          primary
        </Button>
        <Button {...args} variant="soft" intent="danger">
          danger
        </Button>
      </HStack>

      <HStack spacing={5}>
        <div className="w-36 underline">ghost</div>

        <Button {...args} variant="ghost">
          neutral
        </Button>
        <Button {...args} variant="ghost" intent="primary">
          primary
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

export const ButtonGroups: Story = {
  args: {
    disabled: false,
  },
  render: args => (
    <VStack spacing={6}>
      <ButtonGroup intent="primary" {...args}>
        <Button>Save</Button>
        <Button>Publish</Button>
        <Button intent="danger">Cancel</Button>
      </ButtonGroup>

      <ButtonGroup {...args}>
        <Button startIcon="pencil" />
        <Button startIcon="cog" />
        <Button startIcon="star" />
      </ButtonGroup>

      <ButtonGroup variant="outline" isAttached {...args}>
        <Button>Create Commit</Button>
        <Button startIcon="caret-down" />
      </ButtonGroup>
    </VStack>
  ),
};
