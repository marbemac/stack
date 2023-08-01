import type { Meta } from '@storybook/react';

import { Box, Button, HStack, VStack } from './index.ts';

const meta = {
  title: 'Performance',
} satisfies Meta<typeof Button>;

export default meta;

export const Rows = () => {
  return (
    <VStack tw="w-96 rounded border" divider>
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
      <Row />
    </VStack>
  );
};

const Row = () => {
  return (
    <HStack tw="items-center px-3 py-2">
      <Box tw="flex-1 font-medium">Marc</Box>
      <HStack spacing={2}>
        <Button size="sm" intent="danger">
          Delete
        </Button>
        <Button endIcon="arrow-right" size="sm" />
      </HStack>
    </HStack>
  );
};
