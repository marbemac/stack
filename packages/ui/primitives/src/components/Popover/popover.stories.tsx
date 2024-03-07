import type { Meta } from '@storybook/react';

import { Button } from '../Button/button.tsx';
import { DialogSlot } from '../Dialog/dialog.tsx';
import { Heading } from '../Heading/heading.tsx';
import { Slot } from '../Slot/slot.tsx';
import { HStack, VStack } from '../Stack/stack.tsx';
import type { PopoverProps } from './popover.tsx';
import { Popover } from './popover.tsx';

const meta = {
  title: 'Components / Popover',
  component: Popover,
  parameters: { controls: { sort: 'requiredFirst' } },
  argTypes: {
    hideArrow: {
      control: 'boolean',
      defaultValue: false,
    },
    placement: {
      control: 'select',
      defaultValue: 'bottom',
      options: [
        'top-start',
        'top',
        'top-end',
        'bottom-start',
        'bottom',
        'bottom-end',
        'left-start',
        'left',
        'left-end',
        'right-start',
        'right',
        'right-end',
      ],
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

export const Basic = (props: PopoverProps) => (
  <Popover {...props} triggerElem={<Button>Open</Button>}>
    <div>the popover content</div>
  </Popover>
);

export const WithRenderProps = (props: PopoverProps) => (
  <Popover {...props} triggerElem={<Button>Open</Button>}>
    {({ close }) => (
      <VStack spacing={3}>
        <Heading slot={DialogSlot.title}>Sign up</Heading>

        <Slot slot={DialogSlot.description} render="p">
          Click the submit button to close the popover.
        </Slot>

        <Button onClick={close}>Submit</Button>
      </VStack>
    )}
  </Popover>
);

export const Placement = (props: PopoverProps) => {
  const Pop = ({ placement }: PopoverProps) => (
    <Popover {...props} placement={placement} triggerElem={<Button>{placement}</Button>}>
      <div>the popover content</div>
    </Popover>
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

export const OnScrollingPage = (props: PopoverProps) => {
  return (
    <div className="h-[9999px] pt-40">
      <Basic {...props} />
    </div>
  );
};
OnScrollingPage.args = {
  modal: false,
};
