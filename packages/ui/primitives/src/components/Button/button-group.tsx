import type { ButtonGroupStyleProps } from '@marbemac/ui-styles';
import { buttonGroupStaticClass, buttonGroupStyle, splitPropsVariants } from '@marbemac/ui-styles';
import { useMemo } from 'react';

import { HStack, type StackProps } from '../Stack/stack.tsx';
import { ButtonContext, type ButtonProps } from './button.tsx';

export interface ButtonGroupProps
  extends Pick<ButtonProps, 'size' | 'variant' | 'intent' | 'disabled' | 'className'>,
    ButtonGroupStyleProps {
  children: React.ReactNode;
  spacing?: StackProps['spacing'];
}

export function ButtonGroup(props: ButtonGroupProps) {
  const [local, variantProps] = splitPropsVariants(props, buttonGroupStyle.variantKeys);

  const { className, spacing = 2, children, size, variant, intent, disabled, ...others } = local;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => buttonGroupStyle(variantProps), [...Object.values(variantProps)]);

  const baseTw = slots.base({ class: [buttonGroupStaticClass('base'), className] });

  return (
    <HStack spacing={variantProps.isAttached ? undefined : spacing} className={baseTw} {...others}>
      <ButtonContext.Provider value={{ size, variant, intent, disabled }}>{children}</ButtonContext.Provider>
    </HStack>
  );
}
