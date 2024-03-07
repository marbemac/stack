import * as AK from '@ariakit/react';
import {
  type ButtonSlotProps,
  buttonStaticClass,
  buttonStyle,
  type ButtonStyleProps,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { forwardRef, useMemo } from 'react';

import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';
import { Icon, type IconProps } from '../Icon/icon.tsx';

export interface ButtonProps extends AK.ButtonProps, ButtonStyleProps, ButtonSlotProps {
  /** If added, the button will show an icon before the button's label. */
  startIcon?: IconProps['icon'];

  /** If added, the button will show an icon after the button's label. */
  endIcon?: IconProps['icon'];

  /** The icon to show when `isLoading` is true. */
  loadingIcon?: IconProps['icon'];

  /** The label to show in the button when `isLoading` is true. */
  loadingText?: string;

  /** The placement of the loader when `isLoading` is true. */
  loadingPlacement?: 'start' | 'end';
}

export const [ButtonContext, useButtonContext] = createContext<ContextValue<ButtonProps, HTMLButtonElement>>({
  name: 'ButtonContext',
  strict: false,
});

const DEFAULT_SPINNER: IconProps['icon'] = 'spinner';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, ButtonContext);

  const [
    { className, classNames, children, startIcon, endIcon, loadingIcon, loadingText, loadingPlacement, ...props },
    variantProps,
  ] = splitPropsVariants(originalProps, buttonStyle.variantKeys);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => buttonStyle(variantProps), Object.values(variantProps));
  const baseTw = slots.base({ class: [buttonStaticClass('base'), className] });
  const startIconTw = slots.startIcon({ class: [buttonStaticClass('startIcon'), classNames?.startIcon] });
  const endIconTw = slots.endIcon({ class: [buttonStaticClass('endIcon'), classNames?.endIcon] });
  const textTw = slots.text({ class: [buttonStaticClass('text'), classNames?.text] });

  const startIconElem = !variantProps.isLoading
    ? startIcon
    : loadingText && loadingPlacement === 'end'
      ? null
      : DEFAULT_SPINNER;

  const endIconElem = !variantProps.isLoading
    ? endIcon
    : loadingText && loadingPlacement === 'end'
      ? DEFAULT_SPINNER
      : null;

  const contentElem = !variantProps.isLoading ? children : loadingText;
  const hasContent = contentElem !== undefined && contentElem !== null;
  const isIconButton = !hasContent;

  return (
    <AK.Button {...props} ref={ref} className={baseTw} disabled={variantProps.disabled}>
      {startIconElem && (!isIconButton || !endIconElem) ? (
        <Icon className={startIconTw} icon={startIconElem} spin={variantProps.isLoading} />
      ) : null}

      {hasContent ? <div className={textTw}>{contentElem}</div> : null}

      {endIconElem ? <Icon className={endIconTw} icon={endIconElem} spin={variantProps.isLoading} fw /> : null}
    </AK.Button>
  );
});
