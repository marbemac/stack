import * as AK from '@ariakit/react';
import { faCheck, faCircle } from '@fortawesome/free-solid-svg-icons';
import { menuStaticClass, tx } from '@marbemac/ui-styles';
import { type ChangeEvent, forwardRef, useLayoutEffect } from 'react';

import { Icon, type IconProps } from '../Icon/icon.tsx';
import { useMenuInternalContext, useMenuSearchContext, useMenuSearchGroupingContext } from './internal-context.tsx';

export interface MenuItemProps
  extends Omit<AK.ComboboxItemProps, 'store' | 'defaultChecked' | 'defaultValue' | 'value'> {
  checked?: boolean;
  startIcon?: IconProps['icon'];
  endIcon?: IconProps['icon'];
  shortcut?: string;
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(props, ref) {
  return <BaseMenuItem {...props} ref={ref} optionType={typeof props.checked === 'boolean' ? 'checkbox' : undefined} />;
});

/**
 * Internal
 */

interface BaseMenuItemProps extends MenuItemProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  optionType?: 'radio' | 'checkbox';
}

export const BaseMenuItem = forwardRef<HTMLDivElement, BaseMenuItemProps>(function BaseMenuItem(props, ref) {
  const { value: searchValue } = useMenuSearchContext();
  const { groupIsMatched } = useMenuSearchGroupingContext() || {};

  if (!groupIsMatched && searchValue) {
    const valueToSearch = typeof props.children === 'string' ? props.children : '';
    const match = valueToSearch.toLowerCase().includes(searchValue.toLowerCase());
    if (!match) return null;
  }

  return <BaseMenuItemContent ref={ref} {...props} />;
});

const BaseMenuItemContent = forwardRef<HTMLDivElement, BaseMenuItemProps>(function BaseMenuItemContent(
  { className, value, optionType, checked, hideOnClick, startIcon, endIcon, shortcut, ...props },
  ref,
) {
  const menu = AK.useMenuContext();
  if (!menu) throw new Error('MenuItem must be used inside a Menu');

  const { value: searchValue } = useMenuSearchContext();
  const searchable = !!searchValue;

  // Add item to list when it mounts, remove it when it unmounts.
  const { setList } = useMenuSearchGroupingContext() || {};
  const itemId = value || typeof props.children === 'string' ? String(props.children) : '';
  useLayoutEffect(() => {
    if (!searchable || !setList || !itemId) return;

    setList(list => [...list, itemId]);

    return () => {
      setList(list => list.filter(v => v !== itemId));
    };
  }, [setList, itemId, searchable]);

  const { slots, classNames } = useMenuInternalContext();
  const baseTw = slots.item({ class: [menuStaticClass('item'), className, classNames?.item] });
  const contentTw = slots.itemContent({ class: [menuStaticClass('itemContent'), classNames?.itemContent] });
  const indicatorTw = slots.itemIndicator({
    class: [menuStaticClass('itemIndicator'), classNames?.itemIndicator, optionType === 'radio' && 'text-[0.4em]'],
  });
  const startIconTw = slots.itemStartIcon({
    class: [menuStaticClass('itemStartIcon'), classNames?.itemStartIcon],
  });
  const endIconTw = slots.itemEndIcon({
    class: [menuStaticClass('itemEndIcon'), classNames?.itemEndIcon],
  });
  const shortcutTw = slots.itemShortcut({
    class: [menuStaticClass('itemShortcut'), classNames?.itemShortcut],
  });

  let defaultProps: MenuItemProps = {
    ref,
    focusOnHover: true,
    blurOnHoverEnd: false,
    ...props,
    className: baseTw,
  };

  const checkable = !!optionType;

  defaultProps.children = (
    <>
      {checkable ? (
        <div className={indicatorTw}>
          <Icon
            icon={optionType === 'checkbox' ? faCheck : faCircle}
            className={tx(['mx-auto', !checked && 'invisible'])}
            fw
          />
        </div>
      ) : null}

      {startIcon && (
        <div className={startIconTw}>
          <Icon icon={startIcon} fw />
        </div>
      )}

      {defaultProps.children}

      {shortcut && <div className={shortcutTw}>{shortcut}</div>}

      {endIcon && (
        <div className={endIconTw}>
          <Icon icon={endIcon} />
        </div>
      )}

      {checkable && searchable && (
        // When an item is displayed in a search menu as a role=option
        // element instead of a role=menuitemradio, we can't depend on the
        // aria-checked attribute. Although NVDA and JAWS announce it
        // accurately, VoiceOver doesn't. TalkBack does announce the checked
        // state, but misleadingly implies that a double tap will change the
        // state, which isn't the case. Therefore, we use a visually hidden
        // element to indicate whether the item is checked or not, ensuring
        // cross-browser/AT compatibility.
        <AK.VisuallyHidden>{checked ? 'checked' : 'not checked'}</AK.VisuallyHidden>
      )}
    </>
  );

  const shouldHideOnClick = optionType ? hideOnClick ?? false : true;
  if (optionType) {
    defaultProps = {
      ...defaultProps,
      hideOnClick: shouldHideOnClick,
      checked,
      role: optionType === 'checkbox' ? 'menuitemcheckbox' : 'menuitemradio',
      'aria-checked': checked,
    };
  }

  // If the item is not rendered in a search menu (listbox), we can render it as a MenuItem
  if (!searchable) {
    return <AK.MenuItem {...defaultProps} />;
  }

  return (
    <AK.ComboboxItem
      {...defaultProps}
      setValueOnClick={false}
      value={checkable ? value : undefined}
      selectValueOnClick={() => {
        if (name == null || value == null) return false;
        // By default, clicking on a ComboboxItem will update the
        // selectedValue state of the combobox. However, since we're sharing
        // state between combobox and menu, we also need to update the menu's
        // values state.
        menu.setValue(name, value);
        return true;
      }}
      hideOnClick={event => {
        // Make sure that clicking on a combobox item that opens a nested
        // menu/dialog does not close the menu.
        const expandable = event.currentTarget.hasAttribute('aria-expanded');
        if (expandable) return false;

        if (!shouldHideOnClick) return false;

        // By default, clicking on a ComboboxItem only closes its own popover.
        // However, since we're in a menu context, we also close all parent
        // menus.
        menu.hideAll();

        return true;
      }}
    />
  );
});
