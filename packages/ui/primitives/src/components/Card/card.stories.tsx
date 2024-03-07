import type { Meta } from '@storybook/react';

import { Avatar } from '../Avatar/avatar.tsx';
import { Button } from '../Button/button.tsx';
import { Heading } from '../Heading/heading.tsx';
import { Input } from '../Input/input.tsx';
import { Label } from '../Label/label.tsx';
import { HStack, VStack } from '../Stack/stack.tsx';
import { Card } from './card.tsx';
import { ThemesPanelBackgroundImage } from './panel-bg-image.tsx';

const meta = {
  title: 'Components / Card',
  component: Card,
  parameters: { controls: { sort: 'requiredFirst' } },
} satisfies Meta<typeof Card>;

export default meta;

export const Basic = {
  render: () => (
    <VStack spacing={4}>
      <Card style={{ width: 300 }}>
        <HStack spacing={4} center="y">
          <Avatar src="https://bit.ly/kent-c-dodds" fallback="K" className="rounded-full" size="lg" />

          <div>
            <div className="font-bold">Kent Dodds</div>
            <div className="text-muted">Engineering</div>
          </div>
        </HStack>
      </Card>
    </VStack>
  ),
};

export const Sizes = {
  render: () => (
    <VStack spacing={4}>
      <Card size="sm" style={{ width: 300 }}>
        <HStack spacing={3} center="y">
          <Avatar src="https://bit.ly/kent-c-dodds" fallback="K" className="rounded-full" />

          <div>
            <div className="text-sm font-bold">Kent Dodds</div>
            <div className="text-sm text-muted">Engineering</div>
          </div>
        </HStack>
      </Card>

      <Card size="md" style={{ width: 400 }}>
        <HStack spacing={3} center="y">
          <Avatar src="https://bit.ly/kent-c-dodds" fallback="K" className="rounded-full" size="lg" />

          <div>
            <div className="font-bold">Kent Dodds</div>
            <div className="text-muted">Engineering</div>
          </div>
        </HStack>
      </Card>

      <Card size="lg" style={{ width: 500 }}>
        <HStack spacing={4} center="y">
          <Avatar src="https://bit.ly/kent-c-dodds" fallback="K" className="rounded-full" size="xl" />

          <div>
            <div className="text-xl font-bold">Kent Dodds</div>
            <div className="text-xl text-muted">Engineering</div>
          </div>
        </HStack>
      </Card>
    </VStack>
  ),
};

export const Variants = {
  render: () => (
    <VStack spacing={4}>
      <Card style={{ width: 400 }}>
        <HStack spacing={3} center="y">
          <Avatar src="https://bit.ly/kent-c-dodds" fallback="K" className="rounded-full" size="lg" />

          <div>
            <div className="font-bold">Kent Dodds</div>
            <div className="text-muted">Engineering</div>
          </div>
        </HStack>
      </Card>

      <Card style={{ width: 400 }} variant="ghost">
        <HStack spacing={3} center="y">
          <Avatar src="https://bit.ly/kent-c-dodds" fallback="K" className="rounded-full" size="lg" />

          <div>
            <div className="font-bold">Kent Dodds</div>
            <div className="text-muted">Engineering</div>
          </div>
        </HStack>
      </Card>
    </VStack>
  ),
};

export const Transparency = {
  render: () => (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-2xl shadow-border"
      style={{ width: 800, height: 500 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <ThemesPanelBackgroundImage id="1" width="900" height="200%" style={{ opacity: 0.5 }} />
      </div>

      <Card style={{ width: 400 }} size="lg">
        <VStack spacing={10}>
          <Heading className="ml-px">Sign up</Heading>

          <VStack spacing={6}>
            <div>
              <Label className="mb-2 ml-px">Email Address</Label>
              <Input placeholder="Enter your email" />
            </div>

            <div>
              <Label className="mb-2 ml-px">Password</Label>
              <Input type="password" />
            </div>
          </VStack>

          <HStack>
            <Button variant="solid" intent="primary">
              Sign in
            </Button>
          </HStack>
        </VStack>
      </Card>
    </div>
  ),
};
