import type { Meta } from '@storybook/react';
import { useState } from 'react';
import Lorem from 'react-lorem-component';

import { Button } from '../Button/button.tsx';
import { Heading } from '../Heading/heading.tsx';
import { Input } from '../Input/input.tsx';
import { HStack, VStack } from '../Stack/stack.tsx';
import { Text } from '../Text/text.tsx';
import type { DialogProps } from './dialog.tsx';
import { Dialog, DialogSlot } from './dialog.tsx';
import { DialogBody } from './dialog-body.tsx';
import { DialogFooter } from './dialog-footer.tsx';
import { DialogHeader } from './dialog-header.tsx';

const meta = {
  title: 'Components / Dialog',

  argTypes: {
    size: {
      control: 'select',
      defaultValue: 'md',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', 'full'],
    },
    placement: {
      control: 'select',
      defaultValue: 'auto',
      options: ['auto'],
    },
    backdrop: {
      control: 'select',
      defaultValue: 'opaque',
      options: ['transparent', 'opaque', 'blur'],
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;

export const Basic = (props: DialogProps) => {
  return (
    <VStack spacing={5}>
      <Dialog {...props} triggerElem={<Button>Edit profile</Button>}>
        {({ close }) => (
          <>
            <DialogHeader>
              <Heading slot={DialogSlot.title}>Edit profile</Heading>
            </DialogHeader>

            <DialogBody render={<VStack spacing={3} />}>
              <div>
                <div className="mb-2 font-medium">Name</div>
                <Input defaultValue="Freja Johnsen" placeholder="Enter your full name" />
              </div>

              <div>
                <div className="mb-2 font-medium">Email</div>
                <Input defaultValue="freja@example.com" placeholder="Enter your email" />
              </div>
            </DialogBody>

            <DialogFooter>
              <Button onClick={close} variant="soft">
                Cancel
              </Button>

              <Button onClick={close}>Save</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>

      <Heading>Welcome Welcome Welcome</Heading>

      <div>
        <Lorem count={5} />
      </div>
    </VStack>
  );
};

export const Controlled = (props: DialogProps) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit profile</Button>

      <Dialog {...props} isOpen={isOpen} onToggle={setOpen}>
        <DialogHeader>
          <Heading slot={DialogSlot.title}>Edit profile</Heading>
        </DialogHeader>

        <DialogBody render={<VStack spacing={3} />}>
          <div>
            <div className="mb-2 font-medium">Name</div>
            <Input defaultValue="Freja Johnsen" placeholder="Enter your full name" />
          </div>

          <div>
            <div className="mb-2 font-medium">Email</div>
            <Input defaultValue="freja@example.com" placeholder="Enter your email" />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="soft">
            Cancel
          </Button>

          <Button onClick={() => setOpen(false)}>Save</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export const ScrollBehavior = (props: DialogProps) => {
  const [isOpen, setOpen] = useState(false);
  const [scrollBehavior, setScrollBehavior] = useState<'inside' | 'outside'>('outside');

  return (
    <>
      <HStack spacing={3}>
        <Button
          onClick={() => {
            setScrollBehavior('inside');
            setOpen(true);
          }}
        >
          Inside (default)
        </Button>

        <Button
          onClick={() => {
            setScrollBehavior('outside');
            setOpen(true);
          }}
        >
          Outside
        </Button>
      </HStack>

      <Dialog {...props} isOpen={isOpen} onToggle={setOpen} scrollBehavior={scrollBehavior}>
        {({ close }) => (
          <>
            <DialogHeader>
              <Heading slot={DialogSlot.title}>Scrolling: {scrollBehavior}</Heading>
            </DialogHeader>

            <DialogBody>
              <Lorem count={5} />
            </DialogBody>

            <DialogFooter>
              <Button onClick={close} variant="soft">
                Cancel
              </Button>

              <Button onClick={close}>Save</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </>
  );
};
