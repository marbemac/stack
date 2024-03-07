import * as AK from '@ariakit/react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {
  type SelectSlotProps,
  selectStaticClass,
  selectStyle,
  type SelectStyleProps,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { forwardRef, useCallback, useMemo, useRef } from 'react';

import { type ContextValue, createContext, Provider, useContextProps } from '../../utils/context.tsx';
import { Button, ButtonContext, type ButtonProps } from '../Button/button.tsx';
import { Label, LabelContext } from '../Label/label.tsx';
import { SelectInternalContext } from './internal-context.tsx';

export interface SelectProps extends Omit<AK.SelectProps, 'store' | 'onChange'>, SelectStyleProps, SelectSlotProps {
  label?: string;
  variant?: ButtonProps['variant'];
  fullWidth?: ButtonProps['fullWidth'];
  placeholder?: string;
  defaultValue?: AK.SelectStoreProps<string>['defaultValue'];
  value?: AK.SelectStoreProps<'string'>['value'];
  onChange?: AK.SelectStoreProps<'string'>['setValue'];
  onBlur?: React.FocusEventHandler<HTMLElement>;
  isOpen?: AK.SelectStoreProps<'string'>['open'];
  defaultOpen?: AK.SelectStoreProps<'string'>['defaultOpen'];
  onToggle?: AK.SelectStoreProps<'string'>['setOpen'];
  onRemove?: () => void;
}

export const [SelectContext, useSelectContext] = createContext<ContextValue<SelectProps, HTMLButtonElement>>({
  name: 'SelectContext',
  strict: false,
});

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, SelectContext, {
    // Defaults
    variant: 'outline',
    placeholder: 'Choose one',
  });

  const [
    {
      className,
      classNames,
      variant,
      fullWidth,
      children,
      placeholder,
      label,
      value,
      defaultValue = '',
      isOpen,
      defaultOpen,
      onRemove,
      onChange,
      onBlur: onBlurProp,
      onToggle,
      render,
      ...props
    },
    variantProps,
  ] = splitPropsVariants(originalProps, selectStyle.variantKeys);

  const select = AK.useSelectStore({
    defaultValue,
    value,
    setValue: onChange,
    defaultOpen,
    open: isOpen,
    focusLoop: true,
    setOpen(open) {
      onToggle?.(open);
      if (!open && !select.getState().value) {
        onRemove?.();
      }
    },
  });

  const selectValue = select.useState('value');
  const textValue = Array.isArray(selectValue) ? null : select.item(selectValue)?.element?.textContent;
  const displayValue = textValue || selectValue;
  const hasValue = !!displayValue;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => selectStyle(variantProps), Object.values(variantProps));
  const baseTw = slots.base({ class: [selectStaticClass('base'), className] });
  const popoverTw = slots.popover({ class: [selectStaticClass('popover'), classNames?.popover] });
  const listTw = slots.list({ class: [selectStaticClass('list'), classNames?.list] });

  /**
   * Only call onBlur if the focus is leaving the whole widget.
   * This is important when Select is used in the context of forms (see Form stories).
   */
  const portalRef = useRef<HTMLDivElement>(null);
  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLElement>) => {
      const portal = portalRef.current;
      const { selectElement, popoverElement } = select.getState();
      if (portal?.contains(event.relatedTarget)) return;
      if (selectElement?.contains(event.relatedTarget)) return;
      if (popoverElement?.contains(event.relatedTarget)) return;
      onBlurProp?.(event);
    },
    [onBlurProp, select],
  );

  return (
    <Provider
      values={[
        [SelectInternalContext, { slots, classNames, variant, size: variantProps.size }],
        [ButtonContext, { variant, size: variantProps.size, fullWidth, input: true }],
        [LabelContext, { size: variantProps.size }],
      ]}
    >
      <AK.SelectProvider store={select}>
        <div className={baseTw}>
          {label && <AK.SelectLabel render={<Label />}>{label}</AK.SelectLabel>}

          <AK.Select
            ref={ref}
            data-placeholder={!hasValue ? true : undefined}
            render={render ?? <Button endIcon={faChevronDown} />}
            {...props}
          >
            {displayValue || placeholder}
          </AK.Select>

          <AK.SelectPopover gutter={6} className={popoverTw} unmountOnHide onBlur={onBlur} portalRef={portalRef}>
            <div className={listTw}>{children}</div>
          </AK.SelectPopover>
        </div>
      </AK.SelectProvider>
    </Provider>
  );
});
