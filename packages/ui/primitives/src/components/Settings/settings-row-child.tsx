import {
  type SettingsRowChildProps as BSettingsRowChildProps,
  settingsRowChildStaticClass,
  settingsRowChildStyle,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { useMemo, useState } from 'react';

import { Box } from '../Box/box.tsx';
import { Icon } from '../Icon/icon.tsx';
import { SelectRoot, SelectTrigger } from '../Select/select.tsx';

export type SettingsRowChildProps = BSettingsRowChildProps<React.ReactNode>;

export function SettingsRowChild(props: SettingsRowChildProps) {
  const [open, setOpen] = useState(false);

  const [, variantProps] = splitPropsVariants(props, settingsRowChildStyle.variantKeys);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => settingsRowChildStyle(variantProps), [...Object.values(variantProps)]);

  const baseTw = slots.base({ class: settingsRowChildStaticClass('base') });
  const contentTw = slots.content({ class: settingsRowChildStaticClass('content') });
  const endIconTw = slots.endIcon({ class: settingsRowChildStaticClass('endIcon') });

  let onPress;
  let endElem;

  switch (props.type) {
    case 'select':
      onPress = () => setOpen(true);

      endElem = (
        <SelectRoot
          size="sm"
          open={open}
          onOpenChange={setOpen}
          value={props.value}
          onValueChange={props.onValueChange}
          disabled={variantProps.isDisabled}
        >
          <SelectTrigger variant="outline" />
          {props.renderSelectContent()}
        </SelectRoot>
      );

      break;

    case 'action':
      onPress = props.onPress;

      endElem = (
        <div className={endIconTw}>
          <Icon icon={['far', 'chevron-right']} />
        </div>
      );

      break;
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className={baseTw} onClick={!props.isDisabled ? onPress : undefined}>
      <div className={contentTw}>{props.children}</div>

      {endElem}
    </div>
  );
}
