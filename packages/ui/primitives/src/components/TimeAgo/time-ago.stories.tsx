import type { Meta } from '@storybook/react';

import { TimeAgo, type TimeAgoProps } from './time-ago.tsx';

const meta = {
  title: 'Components / TimeAgo',
  component: TimeAgo,
  parameters: { controls: { sort: 'requiredFirst' } },
} satisfies Meta<typeof TimeAgo>;

export default meta;

export const Basic = (props: TimeAgoProps) => <TimeAgo {...props} date={Date.now()} />;
