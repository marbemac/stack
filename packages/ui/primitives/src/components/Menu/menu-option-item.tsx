import { forwardRef, type MouseEvent, useCallback, useMemo } from 'react';

import { useMenuOptionGroupContext } from './internal-context.tsx';
import { BaseMenuItem, type MenuItemProps } from './menu-item.tsx';

export interface MenuOptionItemProps extends Omit<MenuItemProps, 'startIcon' | 'checked'> {
  value: string;
}

export const MenuOptionItem = forwardRef<HTMLDivElement, MenuOptionItemProps>(function MenuOptionItem(
  { value, onClick: onClickProp, ...props },
  ref,
) {
  const { value: currentValue, onChange, values: currentValues, hideOnClick } = useMenuOptionGroupContext();

  const isChecked = useMemo(
    () => (currentValues ? currentValues.includes(value) : currentValue === value),
    [currentValues, currentValue, value],
  );

  const onClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      // Allow the consumer to add additional onClick behavior
      onClickProp?.(event);

      // Allow the consumer to prevent the default behavior
      if (event.defaultPrevented) return;

      if (value === currentValue) return;
      onChange(value);
    },
    [currentValue, onChange, onClickProp, value],
  );

  return (
    <BaseMenuItem
      hideOnClick={hideOnClick}
      {...props}
      value={value}
      ref={ref}
      onClick={onClick}
      checked={isChecked}
      optionType={currentValues ? 'checkbox' : 'radio'}
    />
  );
});
