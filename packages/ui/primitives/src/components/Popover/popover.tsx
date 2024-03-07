import * as AK from '@ariakit/react';
import { usePopoverDescription } from '@ariakit/react-core/popover/popover-description';
import { usePopoverHeading } from '@ariakit/react-core/popover/popover-heading';
import type { PopoverSlotProps, PopoverStyleProps } from '@marbemac/ui-styles';
import { popoverStaticClass, popoverStyle, splitPropsVariants } from '@marbemac/ui-styles';
import { forwardRef, useCallback, useMemo } from 'react';

import {
  type ContextValue,
  createContext,
  defaultSlot,
  GenericSlotContext,
  Provider,
  useContextProps,
} from '../../utils/context.tsx';
import { type ChildrenWithRenderProps, runIfFn } from '../../utils/function.ts';
import { DialogSlot } from '../Dialog/dialog.tsx';

export interface PopoverProps
  extends Omit<AK.PopoverProps, 'store' | 'onChange' | 'children'>,
    PopoverStyleProps,
    PopoverSlotProps {
  isOpen?: AK.PopoverStoreProps['open'];
  onToggle?: AK.PopoverStoreProps['setOpen'];
  children?: ChildrenWithRenderProps<PopoverRenderProps>;
  placement?: AK.PopoverStoreProps['placement'];

  /**
   * The pressable element that will trigger the Popover.
   * Should be a button in most cases.
   */
  triggerElem?: React.ReactElement;
  hideArrow?: boolean;
}

export interface PopoverRenderProps {
  close: () => void;
}

export const [PopoverContext, usePopoverContext] = createContext<ContextValue<PopoverProps, HTMLDivElement>>({
  name: 'PopoverContext',
  strict: false,
});

export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, PopoverContext, {
    // Defaults
    placement: 'bottom-start',
    unmountOnHide: true,
    modal: false,
  });

  const { triggerElem, isOpen, onToggle, placement, ...props } = originalProps;

  const popover = AK.usePopoverStore({
    open: isOpen,
    placement,
    setOpen: onToggle,
  });

  const renderPopover = popover.useState(state => state.open || state.animating);

  return (
    <AK.PopoverProvider store={popover}>
      {triggerElem ? <AK.PopoverDisclosure render={triggerElem} /> : null}
      {renderPopover && <PopoverContent {...props} placement={placement} />}
    </AK.PopoverProvider>
  );
});

const PopoverContent = forwardRef<HTMLDivElement, PopoverProps>(function PopoverContent(originalProps, ref) {
  const popover = AK.usePopoverContext()!;

  const [{ className, classNames, children, placement, hideArrow, ...props }, variantProps] = splitPropsVariants(
    originalProps,
    popoverStyle.variantKeys,
  );

  const close = useCallback(() => popover.setOpen(false), [popover]);
  const side = placement?.split('-')[0];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => popoverStyle(variantProps), Object.values(variantProps));
  const baseTw = slots.base({ class: [popoverStaticClass('base'), className] });
  const arrowTw = slots.arrow({ class: [popoverStaticClass('arrow'), classNames?.arrow] });

  return (
    <AK.Popover {...props} ref={ref} className={baseTw} data-side={side} gutter={hideArrow ? 8 : 4}>
      <PopoverInner close={close}>{children}</PopoverInner>

      {!hideArrow && (
        <AK.PopoverArrow
          className={arrowTw}
          size={20}
          style={{ fill: undefined, stroke: undefined, strokeWidth: undefined }}
        />
      )}
    </AK.Popover>
  );
});

function PopoverInner({ children, close }: Pick<PopoverProps, 'children'> & PopoverRenderProps) {
  const {
    // @ts-expect-error pull render prop out, not needed
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: _render1,
    ...headingProps
  } = usePopoverHeading();

  const {
    // @ts-expect-error pull render prop out, not needed
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: _render2,
    ...descriptionProps
  } = usePopoverDescription();

  return (
    <Provider
      values={[
        [
          GenericSlotContext,
          {
            slots: {
              [defaultSlot]: {},
              [DialogSlot.title]: headingProps,
              [DialogSlot.description]: descriptionProps,
            },
          },
        ],
      ]}
    >
      {runIfFn(children, { close })}
    </Provider>
  );
}
