'use client';

import type { LabelProps as BLabelProps } from '@marbemac/ui-styles';
import { cx, labelStaticClass, labelStyle, splitPropsVariants } from '@marbemac/ui-styles';
import * as BaseLabel from '@radix-ui/react-label';
import { useMemo } from 'react';

import type { HTMLProps } from '../../types.ts';
import { forwardRef } from '../../utils/forward-ref.ts';
import { mergeStyleProps } from '../../utils/merge-style-props.ts';

export type LabelRef = React.ElementRef<typeof BaseLabel.Root>;
export type LabelProps = BLabelProps & HTMLProps<'label'>;

export const Label = forwardRef<LabelRef, LabelProps>((props, ref) => {
  props = mergeStyleProps(labelStyle.defaultVariants, props);

  const [local, variantProps] = splitPropsVariants(props, labelStyle.variantKeys);

  const { UNSAFE_class, slotClasses, tw, ...others } = local;

  const slots = useMemo(
    () => labelStyle(variantProps),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(variantProps)],
  );

  const baseTw = slots.base({ class: [slotClasses?.base] });

  const rootClass = cx(labelStaticClass('base'), baseTw, tw, UNSAFE_class);

  return <BaseLabel.Root className={rootClass} ref={ref} {...others} />;
});
