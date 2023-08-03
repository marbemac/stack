'use client';

import type { LabelProps as BLabelProps, LabelSlots } from '@marbemac/ui-styles';
import { labelStaticClass, labelStyle, splitPropsVariants } from '@marbemac/ui-styles';
import * as BaseLabel from '@radix-ui/react-label';
import { useMemo } from 'react';

import { useStyleProps } from '../../provider.tsx';
import type { HTMLProps } from '../../types.ts';
import { forwardRef } from '../../utils/forward-ref.ts';
import { useMergeThemeProps, useThemeClasses } from '../Themed/utils.ts';

export type LabelRef = React.ElementRef<typeof BaseLabel.Root>;
export type LabelProps = BLabelProps & HTMLProps<'label'>;

export const Label = forwardRef<LabelRef, LabelProps>((props, ref) => {
  props = useMergeThemeProps('Label', labelStyle.defaultVariants, props);

  const [local, variantProps] = splitPropsVariants(props, labelStyle.variantKeys);

  const { UNSAFE_class, slotClasses, tw, ...others } = local;

  const slots = useMemo(
    () => labelStyle(variantProps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(variantProps)],
  );

  const themeTw = useThemeClasses<LabelSlots>('Label', props);
  const baseTw = slots.base({ class: [themeTw.base, slotClasses?.base] });

  const rootClass = useStyleProps({ tw: [baseTw, tw], UNSAFE_class: [labelStaticClass('base'), UNSAFE_class] });

  return <BaseLabel.Root className={rootClass} ref={ref} {...others} />;
});
