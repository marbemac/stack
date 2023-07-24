import * as BaseForm from '@radix-ui/react-form';

type FormProps = BaseForm.FormProps;

export function Form(props: FormProps) {
  return <BaseForm.Root {...props} />;
}
