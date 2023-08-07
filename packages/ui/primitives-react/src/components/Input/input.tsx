import type { InputProps as BInputProps } from '@marbemac/ui-styles';
import { cx, inputStaticClass, inputStyle, splitPropsVariants } from '@marbemac/ui-styles';
import { useMemo } from 'react';

import type { HTMLProps } from '../../types.ts';
import { forwardRef } from '../../utils/forward-ref.ts';
import { mergeStyleProps } from '../../utils/merge-style-props.ts';
import { Box, BoxRef } from '../Box/index.ts';
import { Icon } from '../Icon/index.ts';
export type InputProps = BInputProps<React.ReactNode> & HTMLProps<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  props = mergeStyleProps(inputStyle.defaultVariants, props);

  const [local, variantProps] = splitPropsVariants(props, inputStyle.variantKeys);

  const {
    UNSAFE_class,
    slotClasses,
    tw,
    disabled,
    // invalid,
    startIcon,
    endIcon,
    startSection,
    endSection,
    startSectionWidth,
    endSectionWidth,
    ...others
  } = local;

  const hasStartIcon = !!startIcon;
  const hasEndIcon = !!endIcon;
  const hasStartSection = !!startSection;
  const hasEndSection = !!endSection;
  const hasSection = hasStartSection || hasEndSection;

  const slots = useMemo(
    () => inputStyle({ ...variantProps, isDisabled: disabled, hasStartIcon, hasEndIcon, hasSection }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(variantProps), disabled, hasStartIcon, hasEndIcon, hasSection],
  );

  const baseTw = slots.base({ class: [slotClasses?.base] });
  const inputTw = slots.input({ class: [slotClasses?.input] });

  const rootClass = cx(inputStaticClass('base'), baseTw, tw, UNSAFE_class);

  let startElem;
  if (hasStartIcon) {
    const startIconTw = slots.startIcon({ class: [slotClasses?.startIcon] });
    startElem = (
      <Box tw={startIconTw}>
        <Icon icon={startIcon} fw />
      </Box>
    );
  } else if (hasStartSection) {
    const startSectionTw = slots.startSection({ class: [slotClasses?.startSection] });
    startElem = <Box tw={startSectionTw}>{startSection}</Box>;
  }

  let endElem;
  if (hasEndIcon) {
    const endIconTw = slots.endIcon({ class: [slotClasses?.endIcon] });
    endElem = (
      <Box tw={endIconTw}>
        <Icon icon={endIcon} fw />
      </Box>
    );
  } else if (hasEndSection) {
    const endSectionTw = slots.endSection({ class: [slotClasses?.endSection] });
    endElem = <Box tw={endSectionTw}>{endSection}</Box>;
  }

  return (
    <div className={rootClass}>
      <BoxRef
        as="input"
        tw={inputTw}
        ref={ref}
        style={{
          paddingLeft: hasStartSection ? startSectionWidth : undefined,
          paddingRight: hasEndSection ? endSectionWidth : undefined,
        }}
        {...others}
      />
      {startElem}
      {endElem}
    </div>
  );
});
