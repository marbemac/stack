import {
  type InputSlotProps,
  inputStaticClass,
  inputStyle,
  type InputStyleProps,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { forwardRef, useMemo } from 'react';

import type { HTMLProps } from '../../types.ts';
import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';
import { Icon, type IconProps } from '../Icon/icon.tsx';

export interface InputOptions extends InputStyleProps, InputSlotProps {
  /** The icon to show before the input value. */
  startIcon?: IconProps['icon'];

  /** The icon to show after the input value. */
  endIcon?: IconProps['icon'];

  /** The element to show before the input value, in place of the `startIcon`. */
  startSection?: React.ReactNode;

  /** The element to show after the input value, in place of the `endIcon`. */
  endSection?: React.ReactNode;

  /** Width of start section (in pixel). */
  startSectionWidth?: number;

  /** Width of end section (in pixel). */
  endSectionWidth?: number;
}

export interface InputProps extends HTMLProps<'input'>, InputOptions {}

export const [InputContext, useInputContext] = createContext<ContextValue<InputProps, HTMLInputElement>>({
  name: 'InputContext',
  strict: false,
});

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, InputContext);

  const [
    {
      className,
      classNames,
      disabled,
      startIcon,
      endIcon,
      startSection,
      endSection,
      startSectionWidth,
      endSectionWidth,
      ...props
    },
    variantProps,
  ] = splitPropsVariants(originalProps, inputStyle.variantKeys);

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

  const baseTw = slots.base({ class: [inputStaticClass('base'), className] });
  const inputTw = slots.input({ class: [inputStaticClass('input'), classNames?.input] });

  let startElem;
  if (hasStartIcon) {
    const startIconTw = slots.startIcon({ class: [inputStaticClass('startIcon'), classNames?.startIcon] });
    startElem = (
      <div className={startIconTw}>
        <Icon icon={startIcon} fw />
      </div>
    );
  } else if (hasStartSection) {
    const startSectionTw = slots.startSection({ class: [inputStaticClass('startSection'), classNames?.startSection] });
    startElem = <div className={startSectionTw}>{startSection}</div>;
  }

  let endElem;
  if (hasEndIcon) {
    const endIconTw = slots.endIcon({ class: [inputStaticClass('endIcon'), classNames?.endIcon] });
    endElem = (
      <div className={endIconTw}>
        <Icon icon={endIcon} fw />
      </div>
    );
  } else if (hasEndSection) {
    const endSectionTw = slots.endSection({ class: [inputStaticClass('endSection'), classNames?.endSection] });
    endElem = <div className={endSectionTw}>{endSection}</div>;
  }

  return (
    <div className={baseTw}>
      <input
        {...props}
        ref={ref}
        className={inputTw}
        disabled={disabled}
        style={{
          paddingLeft: hasStartSection ? startSectionWidth : undefined,
          paddingRight: hasEndSection ? endSectionWidth : undefined,
        }}
      />
      {startElem}
      {endElem}
    </div>
  );
});
