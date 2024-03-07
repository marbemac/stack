import {
  settingSectionStaticClass,
  settingSectionStyle,
  type SettingsSectionProps as BSettingsSectionProps,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { useMemo } from 'react';

import { Heading } from '../Heading/heading.tsx';
import { VStack } from '../Stack/stack.tsx';

export type SettingsSectionProps = BSettingsSectionProps<React.ReactNode>;

export const SettingsSection = (props: SettingsSectionProps) => {
  const [local, variantProps] = splitPropsVariants(props, settingSectionStyle.variantKeys);

  const { UNSAFE_class, tw, slotClasses, title, children, ...others } = local;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => settingSectionStyle(variantProps), [...Object.values(variantProps)]);

  const baseTw = slots.base({ class: [settingSectionStaticClass('base'), tw, UNSAFE_class] });
  const titleTw = slots.title({ class: [settingSectionStaticClass('title'), slotClasses?.title] });
  const contentTw = slots.content({ class: [settingSectionStaticClass('content'), slotClasses?.content] });

  return (
    <VStack spacing={3} className={baseTw} {...others}>
      {title && (
        <Heading size={6} as="h2" tw={titleTw}>
          {title}
        </Heading>
      )}

      <VStack divider tw={contentTw}>
        {children}
      </VStack>
    </VStack>
  );
};
