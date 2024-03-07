import * as AK from '@ariakit/react';
import { menuStaticClass } from '@marbemac/ui-styles';
import { forwardRef, useLayoutEffect, useState } from 'react';

import {
  MenuSearchGroupingContext,
  useMenuInternalContext,
  useMenuSearchContext,
  useMenuSearchGroupingContext,
} from './internal-context.tsx';

export interface MenuGroupProps extends Omit<AK.MenuGroupProps, 'onChange' | 'defaultValue' | 'defaultChecked'> {
  label?: string;

  /**
   * A unique name for the group within the menu.
   *
   * Must provide this or the label prop (label is displayed, name is used for state management)
   */
  name?: string;
}

export const MenuGroup = forwardRef<HTMLDivElement, MenuGroupProps>(function MenuGroup(
  { label, name, className, ...props },
  ref,
) {
  const { setList: parentSetList, groupIsMatched: parentGroupIsMatched } = useMenuSearchGroupingContext() || {};

  const { value: searchValue } = useMenuSearchContext() || {};
  const searchable = !!searchValue;

  const [list, setList] = useState<string[]>([]);

  const groupIsMatched =
    parentGroupIsMatched || Boolean(searchValue && label && label.toLowerCase().includes(searchValue.toLowerCase()));
  const noChildMatches = searchValue && !list.length;

  // // Add group to parent list when it mounts, remove it when it unmounts.
  const itemId = name || label;
  useLayoutEffect(() => {
    if (!searchable || !parentSetList || !itemId || noChildMatches) return;

    parentSetList(list => [...list, itemId]);

    return () => {
      parentSetList(list => list.filter(v => v !== itemId));
    };
  }, [parentSetList, itemId, searchable, noChildMatches]);

  const { slots, classNames } = useMenuInternalContext();
  const baseTw = slots.group({
    class: [menuStaticClass('group'), className, classNames?.group, noChildMatches && 'hidden'],
  });
  const labelTw = slots.groupTitle({ class: [menuStaticClass('groupTitle'), classNames?.groupTitle] });

  return (
    <MenuSearchGroupingContext.Provider value={{ groupLabel: label, groupIsMatched, setList }}>
      <AK.MenuGroup ref={ref} {...props} className={baseTw}>
        {label && <AK.MenuGroupLabel className={labelTw}>{label}</AK.MenuGroupLabel>}
        {props.children}
      </AK.MenuGroup>
    </MenuSearchGroupingContext.Provider>
  );
});
