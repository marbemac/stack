import { faSearch } from '@fortawesome/free-solid-svg-icons';
import type { Meta } from '@storybook/react';
import { useState } from 'react';

import { Avatar } from '../Avatar/avatar.tsx';
import { Button } from '../Button/button.tsx';
import { Input } from '../Input/input.tsx';
import { Keyboard } from '../Keyboard/keyboard.tsx';
import { HStack, VStack } from '../Stack/stack.tsx';
import { Menu, type MenuProps } from './menu.tsx';
import { MenuGroup } from './menu-group.tsx';
import { MenuItem } from './menu-item.tsx';
import { MenuOptionGroup } from './menu-option-group.tsx';
import { MenuOptionItem } from './menu-option-item.tsx';
import { MenuSeparator } from './menu-separator.tsx';

const meta = {
  title: 'Components / Menu',

  parameters: { controls: { sort: 'requiredFirst' } },

  argTypes: {
    size: {
      control: 'select',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
    },
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
} satisfies Meta;

export default meta;

export const Basic = (props: MenuProps) => (
  <Menu trigger={<Button startIcon="bars" />} {...props}>
    <MenuItem onClick={() => alert('good job')}>Click me for an alert</MenuItem>
    <MenuItem shortcut="⌘N">New file</MenuItem>
    <MenuItem shortcut="⌘C">Copy link</MenuItem>
    <MenuItem shortcut="⌘⇧E">Edit file</MenuItem>
    <MenuItem shortcut="⌘⇧D">Delete file</MenuItem>
    <MenuSeparator />
    <MenuItem render={<a href="https://google.com" target="_blank" rel="noreferrer" />} endIcon="external-link">
      Open Google
    </MenuItem>
  </Menu>
);

export const WithSubmenu = (props: MenuProps) => (
  <Menu trigger={<Button startIcon="bars">Wider button</Button>} {...props}>
    <MenuItem onClick={() => alert('good job')}>Click me for an alert</MenuItem>
    <MenuItem>One</MenuItem>
    <MenuItem>Two</MenuItem>

    <Menu label="Find" searchable>
      <MenuItem>Search the Web...</MenuItem>
      <MenuItem>Find...</MenuItem>
      <MenuItem>Find Next</MenuItem>
      <MenuItem>Find Previous</MenuItem>
    </Menu>

    <Menu label="Speech">
      <MenuItem>Start Speaking</MenuItem>
      <MenuItem disabled>Stop Speaking</MenuItem>
    </Menu>
  </Menu>
);

export const CheckedItem = (props: MenuProps) => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Menu trigger={<Button startIcon="bars" />} {...props}>
      <MenuItem
        checked={enabled}
        onClick={() => {
          console.log('setEnabled', !enabled);
          setEnabled(!enabled);
        }}
      >
        Enabled
      </MenuItem>

      <MenuSeparator />

      <MenuItem onClick={() => alert('Launched!')} disabled={!enabled}>
        Launch the Missile
      </MenuItem>
    </Menu>
  );
};

export const WithIcons = (props: MenuProps) => (
  <Menu trigger={<Button startIcon="bars" />} {...props}>
    <HStack className="pb-2.5 pl-2 pr-6 pt-2" center="y" spacing={2.5}>
      <Avatar src="https://bit.ly/dan-abramov" size="md" />

      <VStack>
        <div className="font-semibold">Dan</div>
        <div className="text-muted">dan@example.com</div>
      </VStack>
    </HStack>

    <MenuItem startIcon={['fal', 'cog']}>Settings</MenuItem>
    <MenuItem startIcon={['fal', 'book-open']}>Docs</MenuItem>
    <MenuItem startIcon={['fal', 'comment-smile']}>Support</MenuItem>
    <MenuItem startIcon={['fal', 'sparkles']}>Release Notes</MenuItem>
    <MenuItem startIcon={['fal', 'map-marked-alt']}>Roadmap</MenuItem>
    <MenuSeparator />
    <MenuItem startIcon={['fal', 'power-off']}>Logout</MenuItem>
  </Menu>
);

export const OptionGroups = (props: MenuProps) => {
  const [role, setRole] = useState('admin');
  const [watching, setWatching] = useState(['releases']);

  return (
    <Menu trigger={<Button startIcon="bars" />} {...props}>
      <MenuOptionGroup
        label="Multiple Selection"
        values={watching}
        onChange={v => {
          console.log('setWatching', v);
          setWatching(watching.includes(v) ? watching.filter(w => w !== v) : [...watching, v]);
        }}
      >
        <MenuOptionItem value="issues" onClick={() => alert('With additional onClick handler')}>
          Issues
        </MenuOptionItem>
        <MenuOptionItem value="releases">Releases</MenuOptionItem>
        <MenuOptionItem value="pre-releases" disabled>
          Pre-releases
        </MenuOptionItem>
        <MenuOptionItem value="discussions">Discussions</MenuOptionItem>
        <MenuOptionItem value="security">Security Alerts</MenuOptionItem>
      </MenuOptionGroup>

      <MenuSeparator />

      <MenuGroup label="Single Selection">
        <Menu label="Role">
          <MenuOptionGroup
            value={role}
            name="role"
            onChange={v => {
              console.log('setRole', v);
              setRole(v);
            }}
          >
            <MenuOptionItem value="admin">Admin</MenuOptionItem>
            <MenuOptionItem value="member">Member</MenuOptionItem>
            <MenuOptionItem value="guest">Guest</MenuOptionItem>
          </MenuOptionGroup>
        </Menu>
      </MenuGroup>
    </Menu>
  );
};

export const ScrollBehavior = (props: MenuProps) => (
  <Menu trigger={<Button startIcon="bars" />} {...props}>
    <MenuGroup label="Group 1">
      {Array.from({ length: 20 }, (_, index) => (
        <MenuItem key={index}>Item {index}</MenuItem>
      ))}
    </MenuGroup>

    <MenuGroup label="Group 2">
      {Array.from({ length: 20 }, (_, index) => (
        <MenuItem key={index}>Item {index}</MenuItem>
      ))}
    </MenuGroup>
  </Menu>
);

export const KitchenSinkSearchable = (props: MenuProps) => {
  const [blockType, setBlockType] = useState('text');
  const [color, setColor] = useState('inherit');
  const [background, setBackground] = useState('inherit');

  const colors = [
    { label: 'Default', value: 'inherit' },
    { label: 'Gray', value: 'gray' },
    { label: 'Brown', value: 'brown' },
    { label: 'Orange', value: 'orange' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
    { label: 'Purple', value: 'purple' },
    { label: 'Pink', value: 'pink' },
    { label: 'Red', value: 'red' },
  ];

  return (
    <Menu
      trigger={<Button startIcon="bars" />}
      searchable
      combobox={<Input placeholder="Search actions..." startIcon={faSearch} />}
      {...props}
    >
      <MenuItem shortcut="⌘A">Ask AI</MenuItem>
      <MenuItem shortcut="⌘⇧D" onClick={() => confirm('Are you sure?')}>
        Delete
      </MenuItem>

      <Menu label="Duplicate">
        <MenuItem>Duplicate with content</MenuItem>
        <MenuItem>Duplicate without content</MenuItem>
      </Menu>

      <Menu label="Turn into block">
        <MenuOptionGroup name="blockType" value={blockType} onChange={setBlockType}>
          <MenuOptionItem value="text">Text</MenuOptionItem>
          <MenuOptionItem value="h1">Heading 1</MenuOptionItem>
          <MenuOptionItem value="h2">Heading 2</MenuOptionItem>
          <MenuOptionItem value="h3">Heading 3</MenuOptionItem>
          <MenuOptionItem value="page">Page</MenuOptionItem>
          <MenuOptionItem value="todos">To-do list</MenuOptionItem>
          <MenuOptionItem value="ul">Bulleted list</MenuOptionItem>
          <MenuOptionItem value="ol">Numbered list</MenuOptionItem>
          <MenuOptionItem value="code">Code</MenuOptionItem>
          <MenuOptionItem value="quote">Quote</MenuOptionItem>
          <MenuOptionItem value="callout">Callout</MenuOptionItem>
          <MenuOptionItem value="equation">Block equation</MenuOptionItem>
          <MenuOptionItem value="col2">2 columns</MenuOptionItem>
          <MenuOptionItem value="col3">3 columns</MenuOptionItem>
          <MenuOptionItem value="col4">4 columns</MenuOptionItem>
          <MenuOptionItem value="col5">5 columns</MenuOptionItem>
        </MenuOptionGroup>
      </Menu>

      <Menu label="Turn into page" searchable comboboxPlaceholder="Search pages...">
        <MenuGroup label="Suggested">
          <MenuItem>Private pages</MenuItem>
          <MenuItem>Personal Home</MenuItem>
          <MenuItem>Daily reflection</MenuItem>
          <MenuItem>Getting Started</MenuItem>
          <MenuItem>Journal</MenuItem>
          <MenuItem>Movie List</MenuItem>
          <MenuItem>Quick Note</MenuItem>
          <MenuItem>Reading List</MenuItem>
          <MenuItem>Recipes</MenuItem>
          <MenuItem>Take Fig on a walk</MenuItem>
          <MenuItem>Task List</MenuItem>
          <MenuItem>Travel Plans</MenuItem>
          <MenuItem>Yearly Goals</MenuItem>
        </MenuGroup>
      </Menu>

      <MenuSeparator />

      <MenuItem>Copy link to block</MenuItem>

      <MenuSeparator />

      <MenuItem>Move to</MenuItem>

      <MenuSeparator />

      <MenuItem>Comment</MenuItem>

      <MenuSeparator />

      <Menu label="Colors">
        <MenuOptionGroup label="Color" value={color} onChange={setColor}>
          {colors.map(color => (
            <MenuOptionItem key={color.value} value={color.value}>
              {color.label}
            </MenuOptionItem>
          ))}
        </MenuOptionGroup>

        <MenuSeparator />

        <MenuOptionGroup label="Background" value={background} onChange={setBackground}>
          {colors.map(color => (
            <MenuOptionItem key={color.value} value={color.value}>
              {color.label}
            </MenuOptionItem>
          ))}
        </MenuOptionGroup>
      </Menu>

      <MenuSeparator />

      <MenuItem render={<a href="https://google.com" target="_blank" rel="noreferrer" />} endIcon="external-link">
        Help Docs
      </MenuItem>
    </Menu>
  );
};

export const Performance = (props: MenuProps) => {
  // this is 1000 menu items (10 * 10 * 10)
  const ITEMS_PER_MENU = 10;
  const MAX_SUBMENU_DEPTH = 3;

  function renderMenuItems(depth = 1, parentId?: string) {
    const items: any[] = [];

    for (let i = 0; i < ITEMS_PER_MENU; i++) {
      const id = parentId ? `${parentId}-${i}` : `${i}`;
      const name = `Item ${id}`;

      items.push(
        depth < MAX_SUBMENU_DEPTH ? (
          <Menu label={name} searchable key={id}>
            {renderMenuItems(depth + 1, id)}
          </Menu>
        ) : (
          <MenuItem key={id}>{name}</MenuItem>
        ),
      );
    }

    return items;
  }

  return (
    <Menu trigger={<Button startIcon="bars" />} searchable {...props}>
      {renderMenuItems()}
    </Menu>
  );
};
