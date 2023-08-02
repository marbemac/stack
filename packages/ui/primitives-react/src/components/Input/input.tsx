import type { InputProps as BInputProps, InputSlots } from '@marbemac/ui-styles';
import { inputStaticClass, inputStyle, splitPropsVariants } from '@marbemac/ui-styles';
import { useMemo } from 'react';

import { useStyleProps } from '../../provider.tsx';
import type { HTMLProps } from '../../types.ts';
import { forwardRef } from '../../utils/forward-ref.ts';
import { Box, BoxRef } from '../Box/index.ts';
import { Icon } from '../Icon/index.ts';
import { useMergeThemeProps, useThemeClasses } from '../Themed/utils.ts';

export type InputProps = BInputProps<React.ReactNode> & HTMLProps<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  props = useMergeThemeProps('Input', inputStyle.defaultVariants, props);

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

  const themeTw = useThemeClasses<InputSlots>('Input', props);
  const baseTw = slots.base({ class: [themeTw.base, slotClasses?.base] });
  const inputTw = slots.input({ class: [themeTw.input, slotClasses?.input] });

  const rootClass = useStyleProps({ tw: [baseTw, tw], UNSAFE_class: [inputStaticClass('base'), UNSAFE_class] });

  let startElem;
  if (hasStartIcon) {
    const startIconTw = slots.startIcon({ class: [themeTw.startIcon, slotClasses?.startIcon] });
    startElem = (
      <Box tw={startIconTw}>
        <Icon icon={startIcon} fw />
      </Box>
    );
  } else if (hasStartSection) {
    const startSectionTw = slots.startSection({ class: [themeTw.startSection, slotClasses?.startSection] });
    startElem = <Box tw={startSectionTw}>{startSection}</Box>;
  }

  let endElem;
  if (hasEndIcon) {
    const endIconTw = slots.endIcon({ class: [themeTw.endIcon, slotClasses?.endIcon] });
    endElem = (
      <Box tw={endIconTw}>
        <Icon icon={endIcon} fw />
      </Box>
    );
  } else if (hasEndSection) {
    const endSectionTw = slots.endSection({ class: [themeTw.endSection, slotClasses?.endSection] });
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
