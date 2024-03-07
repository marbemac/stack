import * as AK from '@ariakit/react';
import {
  type FormSlotProps,
  formStaticClass,
  formStyle,
  type FormStyleProps,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { forwardRef, useMemo } from 'react';

import { type ContextValue, createContext, Provider, useContextProps } from '../../utils/context.tsx';
import { ButtonContext } from '../Button/button.tsx';
import { Input, InputContext, type InputOptions } from '../Input/input.tsx';
import { Label, LabelContext } from '../Label/label.tsx';
import { Select, SelectContext, type SelectProps } from '../Select/select.tsx';
import { FormInternalContext, useFormInternalContext } from './internal-context.tsx';

export const useFormStore = AK.useFormStore;
export const useFormContext = AK.useFormContext;

export interface FormProps extends AK.FormProps, FormStyleProps, FormSlotProps {
  /** Disables the entire form and all child elements, including buttons. */
  disabled?: boolean;

  /** Marks the entire form and all child elements as read-only, including buttons. */
  readOnly?: boolean;
}

export const [FormContext] = createContext<ContextValue<FormProps, HTMLFormElement>>({
  name: 'FormContext',
  strict: false,
});

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, FormContext, {
    // Defaults
    validateOnChange: false,
  });

  const [{ className, classNames, disabled, readOnly, ...props }, variantProps] = splitPropsVariants(
    originalProps,
    formStyle.variantKeys,
  );

  const slots = useMemo(
    () => formStyle({ ...variantProps }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(variantProps),
  );

  const baseTw = slots.base({ class: [formStaticClass('base'), className] });

  return (
    <Provider
      values={[
        [FormInternalContext, { disabled, readOnly, slots, classNames }],
        [LabelContext, { disabled: disabled, size: variantProps.size }],
        [InputContext, { disabled, readOnly, size: variantProps.size }],
        [ButtonContext, { disabled: disabled || readOnly, size: variantProps.size }],
        [SelectContext, { disabled: disabled || readOnly, size: variantProps.size }],
      ]}
    >
      <AK.Form ref={ref} className={baseTw} {...props} />
    </Provider>
  );
});

export interface FormFieldProps extends React.ComponentPropsWithoutRef<'div'> {
  label: React.ReactNode;
  name: AK.FormControlProps['name'];
  hint?: React.ReactNode;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  { className, name, label, children, hint, ...props },
  ref,
) {
  const { slots, classNames } = useFormInternalContext();

  const fieldTw = slots.field({ class: [formStaticClass('field'), className, classNames?.field] });
  const fieldHeaderTw = slots.fieldHeader({ class: [formStaticClass('fieldHeader'), classNames?.fieldHeader] });
  const fieldLabelTw = slots.fieldLabel({ class: [formStaticClass('fieldLabel'), classNames?.fieldLabel] });
  const fieldErrorTw = slots.fieldError({ class: [formStaticClass('fieldError'), classNames?.fieldError] });
  const fieldHintTw = slots.fieldHint({ class: [formStaticClass('fieldHint'), classNames?.fieldHint] });

  return (
    <div ref={ref} {...props} className={fieldTw}>
      <div className={fieldHeaderTw}>
        <AK.FormLabel name={name} render={<Label className={fieldLabelTw} />}>
          {label}
        </AK.FormLabel>

        <AK.FormError name={name} className={fieldErrorTw} />
      </div>

      {children}

      {hint ? <div className={fieldHintTw}>{hint}</div> : null}
    </div>
  );
});

export interface FormInputProps extends Omit<AK.FormInputProps, 'size'>, Omit<InputOptions, keyof AK.FormInputProps> {}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(props, ref) {
  return <AK.FormInput ref={ref} render={<Input />} {...props} />;
});

export interface FormSelectProps
  extends AK.FormControlProps<'button'>,
    Omit<SelectProps, keyof AK.FormControlProps<'button'>> {}

export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(function FormSelect({ name, ...props }, ref) {
  const form = AK.useFormContext();
  if (!form) throw new Error('FormSelect must be used within a Form');

  const value = form.useValue(name);

  const select = (
    <Select ref={ref} value={value} onChange={value => form.setValue(name, value)} render={props.render} />
  );

  const field = <AK.FormControl name={name} render={select} />;

  return <AK.Role.button {...props} render={field} />;
});
