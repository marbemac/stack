import type { Meta } from '@storybook/react';

import { VStack } from '../Stack/stack.tsx';
import { Tab } from './tab.tsx';
import { TabList } from './tab-list.tsx';
import { TabPanel } from './tab-panel.tsx';
import { TabPanels } from './tab-panels.tsx';
import { Tabs, type TabsProps } from './tabs.tsx';

const meta = {
  title: 'Components / Tabs',
  component: Tabs,
  parameters: { controls: { sort: 'requiredFirst' } },
} satisfies Meta<typeof Tabs>;

export default meta;

export const Basic = (props: TabsProps) => (
  <VStack className="w-80 rounded border">
    <Tabs defaultSelectedId="documents" {...props}>
      <TabList className="shadow-border-b">
        <Tab id="account">Account</Tab>
        <Tab id="documents">Documents</Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>

      <TabPanels className="h-60">
        <TabPanel tabId="account">
          <div>Make changes to your account.</div>
        </TabPanel>

        <TabPanel tabId="documents">
          <div>Access and update your documents.</div>
        </TabPanel>

        <TabPanel tabId="settings">
          <div>Edit your profile or update contact information.</div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </VStack>
);

export const PlainVariant = (props: TabsProps) => <Basic variant="unstyled" {...props} />;
