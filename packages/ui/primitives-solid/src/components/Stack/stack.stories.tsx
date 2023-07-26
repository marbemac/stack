import type { Meta, StoryObj } from 'storybook-solidjs';

import { Box } from '../Box/index.ts';
import { HStack, Stack, VStack } from './stack.tsx';

const meta = {
  title: 'Components / Layout / Stack',
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Vertical = {
  render: () => (
    <Stack spacing={4}>
      <Box tw="text-fg">text-fg</Box>
      <Box tw="text-fg-muted">text-fg-muted</Box>
      <Box tw="text-fg-subtle">text-fg-subtle</Box>
      <Box tw="bg-canvas-emphasis text-fg-on-solid">text-fg-on-solid</Box>
    </Stack>
  ),
} satisfies Story;

export const CanvasLayers = {
  render: () => (
    <HStack spacing={8}>
      <VStack spacing={8} tw="w-96">
        <VStack spacing={3} tw="rounded-lg bg-canvas-subtle p-6">
          <Box tw="px-4 py-3">on canvas-subtle</Box>
          <Box tw="bg-canvas px-4 py-3">canvas on canvas-subtle</Box>
        </VStack>

        <VStack spacing={3} tw="rounded-lg bg-canvas-inset p-6">
          <Box tw="px-4 py-3">on canvas-inset</Box>
          <Box tw="bg-canvas px-4 py-3">canvas on canvas-inset</Box>
          <Box tw="bg-canvas-subtle px-4 py-3">canvas-subtle on canvas-inset</Box>
        </VStack>

        <VStack spacing={3} tw="rounded-lg bg-canvas-emphasis p-6">
          <Box tw="px-4 py-3">on canvas-emphasis</Box>
          <Box tw="bg-canvas px-4 py-3">canvas on canvas-emphasis</Box>
          <Box tw="bg-canvas-subtle px-4 py-3">canvas-subtle on canvas-emphasis</Box>
        </VStack>
      </VStack>

      <VStack spacing={3} tw="w-96 rounded-lg bg-canvas-overlay p-6 shadow">
        <Box tw="px-4 py-3">on canvas-overlay</Box>
        <Box tw="bg-canvas px-4 py-3">canvas on canvas-overlay</Box>
        <Box tw="bg-canvas-subtle px-4 py-3">canvas-subtle on canvas-overlay</Box>
        <Box tw="bg-canvas-inset px-4 py-3">canvas-inset on canvas-overlay</Box>
        <Box tw="bg-canvas-emphasis px-4 py-3">canvas-emphasis on canvas-overlay</Box>
      </VStack>
    </HStack>
  ),
} satisfies Story;
