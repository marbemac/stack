import {
  type SettingsRowProps as BSettingsRowProps,
  settingsRowStaticClass,
  settingsRowStyle,
  splitPropsVariants,
} from '@marbemac/ui-styles';
import { useCallback, useMemo, useState } from 'react';

import { useClipboard } from '../../hooks/use-clipboard.ts';
import { Box } from '../Box/box.tsx';
import { Button } from '../Button/button.tsx';
import { Dialog, DialogContent, DialogTitle } from '../Dialog/dialog.tsx';
import { Heading } from '../Heading/heading.tsx';
import { Icon, type IconProps } from '../Icon/icon.tsx';
import { SelectRoot, SelectTrigger } from '../Select/select.tsx';
import { HStack, VStack } from '../Stack/stack.tsx';
import { Text } from '../Text/text.tsx';
import { SettingsRowChild } from './settings-row-child.tsx';

export type SettingsRowProps = BSettingsRowProps<React.ReactNode>;

export const SettingsRow = (props: SettingsRowProps) => {
  const [open, onOpenChange] = useState(false);

  const [, variantProps] = splitPropsVariants(props, settingsRowStyle.variantKeys);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => settingsRowStyle(variantProps), [...Object.values(variantProps)]);

  switch (props.type) {
    // @TODO implement switch settings row
    case 'switch':
      return <div>@TODO</div>;
    // return (
    //   <_SettingsRow
    //     {...props}
    //     actionElem={
    //       <Switch isSelected={props.isSelected} isDisabled={props.isDisabled} aria-label={props.switchLabel} />
    //     }
    //     onClick={() => {
    //       props.onClick(!props.isSelected);
    //     }}
    //   />
    // );

    case 'dialog':
      return (
        <_SettingsRow
          {...props}
          slots={slots}
          hasMoreIcon={['far', 'chevron-right']}
          valueElem={<div>{props.value}</div>}
          onPress={() => onOpenChange(true)}
        >
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
              className={slots.dialogContent({
                class: [settingsRowStaticClass('dialogContent'), props.classNames?.dialogContent],
              })}
            >
              <VStack divider spacing={5}>
                <DialogTitle>{props.label}</DialogTitle>

                {props.children}
              </VStack>
            </DialogContent>
          </Dialog>
        </_SettingsRow>
      );

    case 'select':
      return (
        <_SettingsRow
          {...props}
          slots={slots}
          onPress={() => onOpenChange(true)}
          isActionElemTabbable
          actionElem={
            <SelectRoot
              size="sm"
              open={open}
              onOpenChange={onOpenChange}
              value={props.value}
              onValueChange={props.onValueChange}
              disabled={props.isDisabled}
            >
              <SelectTrigger variant="outline" />
              {props.renderSelectContent()}
            </SelectRoot>
          }
        />
      );

    case 'action':
      return <_SettingsRow {...props} slots={slots} />;

    case 'copy':
      return <CopySettingsRow {...props} slots={slots} />;

    case 'list':
      return (
        <_SettingsRow
          {...props}
          slots={slots}
          onPress={props.noAction ? undefined : props.onPress}
          actionElem={
            !props.noAction ? (
              <Button size="sm" isDisabled={props.isDisabled} onClick={props.onPress}>
                {props.actionText ?? 'Add'}
              </Button>
            ) : undefined
          }
        >
          {props.items?.length ? (
            <Box
              tw={slots.listContainer({
                class: [settingsRowStaticClass('listContainer'), props.classNames?.listContainer],
              })}
            >
              <Box
                tw={slots.listDivider({
                  class: [settingsRowStaticClass('listDivider'), props.classNames?.listDivider],
                })}
              />
              <VStack divider>
                {props.items.map((i, k) => (
                  <SettingsRowChild key={k} {...i} />
                ))}
              </VStack>
            </Box>
          ) : null}
        </_SettingsRow>
      );
  }
};

type InternalSettingsRowProps = Omit<SettingsRowProps, 'type' | 'onClick'> & {
  slots: ReturnType<typeof settingsRowStyle>;
  hasMoreIcon?: IconProps['icon'];
  valueElem?: React.ReactNode;
  actionElem?: React.ReactNode;
  isActionElemTabbable?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
};

const _SettingsRow = ({
  tw,
  UNSAFE_class,
  slots,
  classNames,
  label,
  hint,
  icon,
  children,
  onPress,
  isDisabled,
  hasMoreIcon,
  valueElem,
  actionElem,
  isActionElemTabbable,
}: InternalSettingsRowProps) => {
  const canInteract = !!onPress && !isDisabled;
  const isRowTabbable = canInteract && !isActionElemTabbable;

  const baseTw = slots.base({ class: [settingsRowStaticClass('base'), tw, UNSAFE_class] });
  const containerTw = slots.container({
    canInteract,
    class: [settingsRowStaticClass('container'), classNames?.container],
  });
  const startIconTw = slots.startIcon({ class: [settingsRowStaticClass('startIcon'), classNames?.startIcon] });
  const contentTw = slots.content({ class: [settingsRowStaticClass('content'), classNames?.content] });
  const endIconTw = slots.endIcon({ class: [settingsRowStaticClass('endIcon'), classNames?.endIcon] });

  const handlePress = useCallback(() => {
    !isDisabled && onPress && onPress();
  }, [isDisabled, onPress]);

  const handleKeyUp = useCallback(
    (evt: React.KeyboardEvent) => {
      if ([' ', 'Enter'].includes(evt.key)) {
        handlePress();
      }
    },
    [handlePress],
  );

  return (
    <Box tw={baseTw}>
      <Box
        tabIndex={isRowTabbable ? 0 : undefined}
        tw={containerTw}
        onClick={handlePress}
        onKeyUp={isRowTabbable ? handleKeyUp : undefined}
      >
        {icon && (
          <Box tw={startIconTw}>
            <Icon icon={icon} fw />
          </Box>
        )}

        <Box tw={contentTw}>
          <Labels slots={slots} classNames={classNames} label={label} hint={hint} />

          <HStack spacing={3} center="y">
            {valueElem}

            {actionElem}

            {hasMoreIcon && (
              <Box tw={endIconTw}>
                <Icon icon={hasMoreIcon} />
              </Box>
            )}
          </HStack>
        </Box>
      </Box>

      {children}
    </Box>
  );
};

type LabelsProps = Pick<InternalSettingsRowProps, 'slots' | 'classNames' | 'label' | 'hint'>;

function Labels({ slots, classNames, label, hint }: LabelsProps) {
  const labelTw = slots.label({ class: [settingsRowStaticClass('label'), classNames?.label] });
  const hintTw = slots.hint({ class: [settingsRowStaticClass('hint'), classNames?.hint] });

  return (
    <VStack spacing={3} tw={labelTw}>
      <Heading size={2} render="h4" trim="both">
        {label}
      </Heading>

      {hint && <div className={hintTw}>{hint}</div>}
    </VStack>
  );
}

const CopySettingsRow = ({
  value,
  ...props
}: Extract<SettingsRowProps, { type: 'copy' }> & { slots: ReturnType<typeof settingsRowStyle> }) => {
  const { copy, hasCopied } = useClipboard(value);

  return (
    <_SettingsRow
      {...props}
      hasMoreIcon={['far', hasCopied ? 'check' : 'copy']}
      valueElem={<Box>{value}</Box>}
      onPress={copy}
    />
  );
};
