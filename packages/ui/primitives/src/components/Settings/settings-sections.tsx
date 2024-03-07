import {
  settingSectionsStaticClass,
  settingSectionsStyle,
  type SettingsSectionsProps as BSettingsSectionsProps,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { useMemo } from 'react';

import { Heading } from '../Heading/heading.tsx';
import { VStack } from '../Stack/stack.tsx';

export type SettingsSectionsProps = BSettingsSectionsProps<React.ReactNode>;

export const SettingsSections = (props: SettingsSectionsProps) => {
  const [local, variantProps] = splitPropsVariants(props, settingSectionsStyle.variantKeys);

  const { UNSAFE_class, tw, title, children, ...others } = local;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => settingSectionsStyle(variantProps), [...Object.values(variantProps)]);

  const baseTw = slots.base({ class: [settingSectionsStaticClass('base'), tw, UNSAFE_class] });

  return (
    <VStack spacing={10} {...others} tw={baseTw}>
      {title && (
        <Heading size={7} as="h1">
          {title}
        </Heading>
      )}

      {children}
    </VStack>
  );
};
