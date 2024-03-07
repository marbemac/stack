import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { Meta } from '@storybook/react';

import { Button } from '../Button/button.tsx';
import { SelectItem } from '../Select/select-item.tsx';
import { HStack, VStack } from '../Stack/stack.tsx';
import { Form, FormContext, FormField, FormInput, type FormProps, FormSelect, useFormStore } from './form.tsx';

const meta = {
  title: 'Components / Forms',
  component: Form,
  parameters: { controls: { sort: 'requiredFirst' } },
  argTypes: {
    disabled: {
      control: 'boolean',
      defaultValue: false,
    },
    readOnly: {
      control: 'boolean',
      defaultValue: false,
    },
    size: {
      control: 'select',
      defaultValue: 'md',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Form>;

export default meta;

export const Basic = (props: FormProps) => {
  const form = useFormStore({ defaultValues: { name: 'John Doe', email: '' } });
  const $ = form.names;

  form.useSubmit(async state => {
    alert(JSON.stringify(state.values, null, 4));
  });

  return (
    <Form store={form} className="w-80" {...props}>
      <FormField name={$.name} label="Name">
        <FormInput name={$.name} required placeholder="John Doe" />
      </FormField>

      <FormField name={$.email} label="Email" hint="Please use your work email address.">
        <FormInput name={$.email} required type="email" placeholder="you@your-company.com" />
      </FormField>

      <Button type="submit">Sign Up</Button>
    </Form>
  );
};

export const Disabled = (props: FormProps) => {
  return <Basic disabled {...props} />;
};

export const Readonly = (props: FormProps) => {
  return <Basic readOnly {...props} />;
};

/**
 * For example, could disable all forms in a section of the app if the user does not have write permission, etc.
 */
export const DisabledViaContext = (props: FormProps) => {
  return (
    <FormContext.Provider value={{ disabled: true }}>
      <HStack spacing={10} divider>
        <Basic {...props} />
        <Basic {...props} />
      </HStack>
    </FormContext.Provider>
  );
};

export const WithSelect = (props: FormProps) => {
  const form = useFormStore({ defaultValues: { email: '', role: '' } });
  const $ = form.names;

  form.useSubmit(async state => {
    alert(JSON.stringify(state.values, null, 4));
  });

  return (
    <Form store={form} className="w-96" {...props}>
      <HStack spacing={4}>
        <div className="flex-1">
          <FormField name={$.email} label="Email">
            <FormInput name={$.email} required placeholder="your-teammate@acme.com" />
          </FormField>
        </div>

        <div className="w-36">
          <FormField name={$.role} label="Role">
            <FormSelect
              name={$.role}
              required
              placeholder="Pick a Role"
              render={<Button fullWidth className="justify-between" endIcon={faChevronDown} />}
            >
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </FormSelect>
          </FormField>
        </div>
      </HStack>

      <Button type="submit">Invite</Button>
    </Form>
  );
};
