/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Box } from '../Box/box.tsx';
import { SelectContent, SelectGroup, SelectItem } from '../Select/select.tsx';
import { SettingsRow } from './settings-row.tsx';
import { SettingsSection } from './settings-section.tsx';
import { SettingsSections } from './settings-sections.tsx';

const meta = {
  title: 'Components / Settings',
  component: SettingsSection,
} satisfies Meta<typeof SettingsSection>;

export default meta;
type Story = StoryObj<typeof SettingsSection>;

export const KitchenSink: Story = {
  render: args => {
    const [reminderEmails, setReminderEmails] = useState({
      mo: '8',
      tu: '8',
      we: '8',
      th: '8',
      fr: '8',
      sa: 'none',
      su: '21',
    });

    const updateReminderEmails = (day: string, time: string) => {
      setReminderEmails({ ...reminderEmails, [day]: time });
    };

    const [theme, setTheme] = useState('system');

    return (
      <SettingsSections tw="h-full w-144">
        <SettingsSection title="Settings">
          <SettingsRow type="dialog" label="Username" value="marc">
            <Box>The form....</Box>
          </SettingsRow>

          <SettingsRow type="copy" label="API Key" hint="Keep it secret!" value="123xxx" />

          <SettingsRow
            type="select"
            label="Theme"
            value={theme}
            onValueChange={setTheme}
            renderSelectContent={ThemeSelectContent}
          />

          <SettingsRow
            type="list"
            label="Reminder Emails"
            hint="Tell us when you'd like to receive your reminder emails."
            icon={['fal', 'envelopes-bulk']}
            noAction
            items={[
              {
                type: 'select',
                children: 'Monday',
                value: reminderEmails.mo,
                onValueChange: val => updateReminderEmails('mo', val),
                renderSelectContent: ReminderTimeSelectContent,
              },
              {
                type: 'select',
                children: 'Tuesday',
                value: reminderEmails.tu,
                onValueChange: val => updateReminderEmails('tu', val),
                renderSelectContent: ReminderTimeSelectContent,
              },
              {
                type: 'select',
                children: 'Wednesday',
                value: reminderEmails.we,
                onValueChange: val => updateReminderEmails('we', val),
                renderSelectContent: ReminderTimeSelectContent,
              },
              {
                type: 'select',
                children: 'Thursday',
                value: reminderEmails.th,
                onValueChange: val => updateReminderEmails('th', val),
                renderSelectContent: ReminderTimeSelectContent,
              },
              {
                type: 'select',
                children: 'Friday',
                value: reminderEmails.fr,
                onValueChange: val => updateReminderEmails('fr', val),
                renderSelectContent: ReminderTimeSelectContent,
              },
            ]}
          />
        </SettingsSection>

        <SettingsSection title="Other">
          <SettingsRow
            type="action"
            label="Export Entries"
            hint="Click to receive an email with a text file containing all of your entries."
            hasMoreIcon="download"
            onPress={() => {
              alert('Clicked');
            }}
          />

          <SettingsRow
            type="action"
            label="Docs"
            hasMoreIcon="external-link"
            onPress={() => {
              alert('Clicked');
            }}
          />
        </SettingsSection>

        <SettingsSection isDangerZone title="Danger Zone">
          <SettingsRow
            type="action"
            label="Delete Account"
            hint="This will delete your account and all of your data. This action cannot be undone."
            onPress={() => {
              alert('Clicked');
            }}
          />
        </SettingsSection>
      </SettingsSections>
    );
  },
};

const ThemeSelectContent = () => (
  <SelectContent>
    <SelectGroup>
      <SelectItem value="system">System</SelectItem>
      <SelectItem value="light">Light</SelectItem>
      <SelectItem value="dark">Dark</SelectItem>
    </SelectGroup>
  </SelectContent>
);

const ReminderTimeSelectContent = () => (
  <SelectContent>
    <SelectGroup>
      <SelectItem value="none">{`Don't remind me`}</SelectItem>
    </SelectGroup>

    <SelectGroup>
      <SelectItem value="4">4am</SelectItem>
      <SelectItem value="5">5am</SelectItem>
      <SelectItem value="6">6am</SelectItem>
      <SelectItem value="7">7am</SelectItem>
      <SelectItem value="8">8am</SelectItem>
      <SelectItem value="9">9am</SelectItem>
      <SelectItem value="10">10am</SelectItem>
      <SelectItem value="11">11am</SelectItem>
      <SelectItem value="12">12pm</SelectItem>
      <SelectItem value="13">1pm</SelectItem>
      <SelectItem value="14">2pm</SelectItem>
      <SelectItem value="15">3pm</SelectItem>
      <SelectItem value="16">4pm</SelectItem>
      <SelectItem value="17">5pm</SelectItem>
      <SelectItem value="18">6pm</SelectItem>
      <SelectItem value="19">7pm</SelectItem>
      <SelectItem value="20">8pm</SelectItem>
      <SelectItem value="21">9pm</SelectItem>
      <SelectItem value="22">10pm</SelectItem>
    </SelectGroup>
  </SelectContent>
);
