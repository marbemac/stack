import { faCheck } from '@fortawesome/free-solid-svg-icons';
import * as BaseCheckbox from '@radix-ui/react-checkbox';

import { cn } from '~/utils/cn.ts';

import { Box } from './Box.tsx';
import { Icon } from './Icon.tsx';

// type CheckboxProps = Kobalte.CheckboxRootProps & {
//   label: string;
//   error?: string;
// };

// type Foo = BaseCheckbox.CheckboxProps['']

type CheckboxProps = BaseCheckbox.CheckboxProps & {
  label: string;
  error?: string;
};

export function Checkbox({ label, error, checked, ...rest }: CheckboxProps) {
  return (
    <BaseCheckbox.Root {...rest}>
      <Box tw="inline-flex h-5 w-5 items-center justify-center rounded border border-neutral-solid bg-neutral-subtle data-[checked]:border-transparent data-[checked]:bg-primary-solid data-[checked]:text-white">
        <BaseCheckbox.Indicator>{checked && <Icon icon={faCheck} />}</BaseCheckbox.Indicator>
      </Box>

      {/* <BaseCheckbox.Label class="select-none">{props.label}</Kobalte.Label> */}
    </BaseCheckbox.Root>
  );
}

// export function Checkbox({label, error, ...rest}: CheckboxProps) {
//   return (
//     <BaseCheckbox.Root {..rest}
//       // {...props}
//       // validationState={props.error ? 'invalid' : 'valid'}

//       // class={cn(props.class, 'inline-flex items-center gap-2')}
//     >

//       <Box
//         tw="inline-flex h-5 w-5 items-center justify-center rounded border border-neutral-solid bg-neutral-subtle data-[checked]:border-transparent data-[checked]:bg-primary-solid data-[checked]:text-white"
//       >
//         <Kobalte.Indicator>
//           <Icon icon={faCheck} />
//         </Kobalte.Indicator>
//       </Box>

//       <Kobalte.Label class="select-none">{props.label}</Kobalte.Label>
//     </BaseCheckbox.Root>
//   );
// }
