/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta } from '@storybook/react';
import { useState } from 'react';

import { VStack } from '../Stack/stack.tsx';
import { Select, type SelectProps } from './select.tsx';
import { SelectGroup } from './select-group.tsx';
import { SelectItem } from './select-item.tsx';

const meta = {
  title: 'Components / Select',
  component: Select,
  parameters: { controls: { sort: 'requiredFirst' } },
  argTypes: {
    size: {
      control: 'select',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta;

export default meta;

export const Basic = (args: SelectProps) => (
  <Select {...args} label="NFL Team">
    <SelectItem value="Cardinals" />
    <SelectItem value="Ravens" />
    <SelectItem value="Cowboys" />
    <SelectItem value="Dolphins" />
    <SelectItem value="Broncos" />
  </Select>
);

export const DisabledItems = (args: SelectProps) => (
  <Select {...args} label="NFL Team">
    <SelectItem value="Cardinals" />
    <SelectItem value="Ravens" disabled />
    <SelectItem value="Cowboys" />
    <SelectItem value="Dolphins" />
    <SelectItem value="Broncos" />
  </Select>
);

export const Sections = (args: SelectProps) => (
  <Select {...args} label="NFL Team">
    <SelectItem value="all">All Teams</SelectItem>
    <SelectItem value="none">No Team</SelectItem>

    <SelectGroup title="ACF East">
      <SelectItem value="bills">Buffalo Bills</SelectItem>
      <SelectItem value="dolphins">Miami Dolphins</SelectItem>
      <SelectItem value="patriots">New England Patriots</SelectItem>
      <SelectItem value="jets">New York Jets</SelectItem>
    </SelectGroup>

    <SelectGroup title="NFC North">
      <SelectItem value="bears">Chicago Bears</SelectItem>
      <SelectItem value="lions">Detroit Lions</SelectItem>
      <SelectItem value="packers">Green Bay Packers</SelectItem>
      <SelectItem value="vikings">Minnesota Vikings</SelectItem>
    </SelectGroup>

    <SelectGroup title="NFC West">
      <SelectItem value="cardinals">Arizona Cardinals</SelectItem>
      <SelectItem value="rams">Los Angeles Rams</SelectItem>
      <SelectItem value="49ers">San Francisco 49ers</SelectItem>
      <SelectItem value="seahawks">Seattle Seahawks</SelectItem>
    </SelectGroup>
  </Select>
);

export const Controlled = (args: SelectProps) => {
  const [value, updateValue] = useState('');

  return (
    <VStack spacing={5}>
      <div>Selected: {value}</div>
      <div>
        <Select {...args} aria-label="NFL Team" value={value} onChange={updateValue}>
          <SelectItem value="cardinals" />
          <SelectItem value="ravens" />
          <SelectItem value="cowboys" />
          <SelectItem value="dolphins" />
          <SelectItem value="broncos" />
        </Select>
      </div>
    </VStack>
  );
};

export const Performance = (args: SelectProps) => {
  const ITEMS_PER_MENU = 500;

  function buildMenuItems() {
    const items: { name: string }[] = [];
    for (let i = 0; i < ITEMS_PER_MENU; i++) {
      items.push({ name: `item ${i}` });
    }
    return items;
  }

  const items = buildMenuItems();

  return (
    <Select {...args} label="A long list">
      {items.map(item => (
        <SelectItem key={item.name} value={item.name} />
      ))}
    </Select>
  );
};
