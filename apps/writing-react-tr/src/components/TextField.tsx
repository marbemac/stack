import * as Form from '@radix-ui/react-form';
import type { ChangeEventHandler, FocusEventHandler } from 'react';

type TextFieldProps = {
  name: string;
  className?: string;
  inputClass?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date' | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  value: string | undefined;
  error: string;
  multiline?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export function TextField({ name, label, error, multiline, inputClass, type, ...inputProps }: TextFieldProps) {
  return (
    <Form.Field name={name}>
      {label ? <Form.Label>{label}</Form.Label> : null}

      {multiline ? (
        <Form.Control asChild>
          <textarea {...inputProps} className={inputClass} />
        </Form.Control>
      ) : (
        <Form.Control asChild>
          <input {...inputProps} className={inputClass} type={type} />
        </Form.Control>
      )}

      {error ? <Form.Message forceMatch>{error}</Form.Message> : null}
    </Form.Field>
  );
}
