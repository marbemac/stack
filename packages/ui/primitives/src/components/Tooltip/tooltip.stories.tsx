import type { Meta } from '@storybook/react';

import { Button } from '../Button/button.tsx';
import { Icon } from '../Icon/icon.tsx';
import { HStack, VStack } from '../Stack/stack.tsx';
import { Tooltip, type TooltipProps } from './tooltip.tsx';

const meta = {
  title: 'Components / Tooltip',
  component: Tooltip,
  parameters: { controls: { sort: 'requiredFirst' } },
} satisfies Meta<typeof Tooltip>;

export default meta;

export const Basic = (props: Partial<TooltipProps>) => (
  <VStack spacing={4}>
    <Tooltip
      content="I am a tooltip with a bunch of text that will not wrap since multiline is set to false"
      placement="top"
      {...props}
      defaultOpen
      multiline={false}
    >
      <div>No Multiline</div>
    </Tooltip>

    <Tooltip
      content="I am a tooltip with a bunch of text that WILL wrap since multiline is set to true (default)"
      placement="bottom"
      {...props}
      multiline
    >
      <div>With Multiline</div>
    </Tooltip>

    <div>
      <Tooltip content="Here is the help text" placement="bottom" {...props}>
        <Icon icon="circle-question" />
      </Tooltip>
    </div>
  </VStack>
);

export const Placement = (props: Partial<TooltipProps>) => {
  const Pop = ({ placement }: Partial<TooltipProps>) => (
    <Tooltip placement={placement} {...props} content="The tooltip content...">
      <Button>{placement}</Button>
    </Tooltip>
  );

  return (
    <VStack spacing={3}>
      <HStack spacing={3}>
        <Pop placement="top-start" />
        <Pop placement="top" />
        <Pop placement="top-end" />
      </HStack>
      <HStack spacing={3}>
        <Pop placement="bottom-start" />
        <Pop placement="bottom" />
        <Pop placement="bottom-end" />
      </HStack>
      <HStack spacing={3}>
        <Pop placement="left-start" />
        <Pop placement="left" />
        <Pop placement="left-end" />
      </HStack>
      <HStack spacing={3}>
        <Pop placement="right-start" />
        <Pop placement="right" />
        <Pop placement="right-end" />
      </HStack>
    </VStack>
  );
};
