/**
 * Adapted from this example: https://ariakit.org/examples/menu-nested-combobox
 */

import * as AK from '@ariakit/react';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {
  type MenuSlotProps,
  menuStaticClass,
  menuStyle,
  type MenuStyleProps,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { forwardRef, startTransition, useCallback, useMemo, useState } from 'react';

import { type ContextValue, createContext, Provider, useContextProps } from '../../utils/context.tsx';
import { Input, InputContext } from '../Input/input.tsx';
import { MenuInternalContext, MenuSearchContext, useMenuSearchContext } from './internal-context.tsx';
import { MenuGroup } from './menu-group.tsx';
import { BaseMenuItem } from './menu-item.tsx';

export interface MenuProps extends AK.MenuButtonProps<'div'>, MenuStyleProps, MenuSlotProps {
  label?: string;
  searchable?: boolean;
  comboboxPlaceholder?: string;
  combobox?: AK.ComboboxProps['render'];
  trigger?: AK.MenuButtonProps['render'];
  placement?: AK.MenuStoreProps['placement'];
  hideArrow?: boolean;
  overlap?: AK.MenuProps['overlap'];
}

export const [MenuContext, useMenuContext] = createContext<ContextValue<MenuProps, HTMLDivElement>>({
  name: 'MenuContext',
  strict: false,
});

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(originalProps, ref) {
  const parent = AK.useMenuContext();
  const isSubmenu = !!parent;

  [originalProps, ref] = useContextProps(originalProps, ref, MenuContext, {
    // Defaults
    placement: isSubmenu ? 'right' : 'bottom',
    overlap: false,
    hideArrow: isSubmenu,
  });

  const [
    {
      className,
      classNames,
      children,
      placement,
      label,
      searchable: searchableProp,
      comboboxPlaceholder,
      combobox,
      trigger,
      hideArrow,
      overlap,
      ...props
    },
    variantProps,
  ] = splitPropsVariants(originalProps, menuStyle.variantKeys);

  const { value: parentSearchValue } = useMenuSearchContext() || {};

  const [searchValue, setSearchValue] = useState('');
  const onSearch = useCallback((value: string) => startTransition(() => setSearchValue(value)), []);

  const searchable = searchableProp || combobox;

  const menu = AK.useMenuStore({
    placement,
    focusLoop: true,
    showTimeout: 100,
  });

  const side = placement?.split('-')[0];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => menuStyle(variantProps), Object.values(variantProps));
  const popoverTw = slots.popover({ class: [menuStaticClass('base'), className, classNames?.popover] });
  const listTw = slots.list({ class: [menuStaticClass('list'), classNames?.list] });
  const arrowTw = slots.arrow({ class: [menuStaticClass('arrow'), classNames?.arrow] });
  const comboboxWrapperTw = slots.comboboxWrapper({
    class: [menuStaticClass('comboboxWrapper'), classNames?.comboboxWrapper],
  });

  /**
   * If we're trying to render a submenu, and we're currently searching, flatten things out and
   * render a MenuGroup instead of the submenu.
   */
  if (isSubmenu && parentSearchValue) {
    return <MenuGroup label={label}>{children}</MenuGroup>;
  }

  const triggerElem = isSubmenu ? (
    <AK.MenuButton ref={ref} {...props} render={<BaseMenuItem render={trigger} endIcon={faChevronRight} />}>
      {label}
    </AK.MenuButton>
  ) : (
    <AK.MenuButton ref={ref} {...props} render={trigger} />
  );

  const element = (
    <AK.MenuProvider store={menu}>
      {triggerElem}

      <AK.Menu
        portal
        overlap={overlap}
        unmountOnHide
        gutter={isSubmenu ? -2 : hideArrow ? 8 : 4}
        className={popoverTw}
        data-side={side}
      >
        <div className={listTw}>
          <Provider
            values={[
              // Pass props that should remain consistent on submenus (like size, etc) through
              [MenuContext, variantProps],
              [MenuSearchContext, { value: searchValue || '' }],
              [MenuInternalContext, { slots, classNames }],
              [InputContext, { size: 'sm', placeholder: comboboxPlaceholder ?? 'Search...' }],
            ]}
          >
            {searchable ? (
              <>
                <div className={comboboxWrapperTw}>
                  <AK.Combobox autoSelect render={combobox ?? <Input />} />
                </div>
                <AK.ComboboxList>{children}</AK.ComboboxList>
              </>
            ) : (
              children
            )}

            {!hideArrow && (
              <AK.MenuArrow
                className={arrowTw}
                size={variantProps.size === 'sm' ? 16 : 20}
                style={{ fill: undefined, stroke: undefined, strokeWidth: undefined }}
              />
            )}
          </Provider>
        </div>
      </AK.Menu>
    </AK.MenuProvider>
  );

  if (!searchable) {
    return element;
  }

  return (
    <AK.ComboboxProvider resetValueOnHide includesBaseElement={false} value={searchValue} setValue={onSearch}>
      {element}
    </AK.ComboboxProvider>
  );
});
