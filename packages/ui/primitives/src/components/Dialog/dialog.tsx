import * as AK from '@ariakit/react';
import { useDialogDescription } from '@ariakit/react-core/dialog/dialog-description';
import { useDialogHeading } from '@ariakit/react-core/dialog/dialog-heading';
import type { DialogSlotProps, DialogStyleProps } from '@marbemac/ui-styles';
import { dialogStaticClass, dialogStyle, splitPropsVariants } from '@marbemac/ui-styles';
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
import { DialogInternalContext } from './internal-context.tsx';

export interface DialogProps
  extends Omit<AK.DialogProps, 'store' | 'onChange' | 'children' | 'backdrop' | 'onToggle'>,
    DialogStyleProps,
    DialogSlotProps {
  isOpen?: AK.DialogStoreProps['open'];
  onToggle?: AK.DialogStoreProps['setOpen'];
  children?: ChildrenWithRenderProps<DialogRenderProps>;

  /**
   * The pressable element that will trigger the Dialog.
   * Should be a button in most cases.
   */
  triggerElem?: React.ReactElement;
}

export interface DialogRenderProps {
  close: () => void;
}

export const [DialogContext, useDialogContext] = createContext<ContextValue<DialogProps, HTMLDivElement>>({
  name: 'DialogContext',
  strict: false,
});

export const DialogSlot = {
  title: 'title',
  description: 'description',
} as const;

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, DialogContext, {
    // Defaults
    unmountOnHide: true,
    modal: true,
  });

  const { triggerElem, isOpen, onToggle, ...props } = originalProps;

  const dialog = AK.useDialogStore({
    open: isOpen,
    setOpen: onToggle,
  });

  const renderDialog = dialog.useState(state => state.open || state.animating);

  return (
    <AK.DialogProvider store={dialog}>
      {triggerElem ? <AK.DialogDisclosure render={triggerElem} /> : null}
      {renderDialog && <DialogContent {...props} />}
    </AK.DialogProvider>
  );
});

const DialogContent = forwardRef<HTMLDivElement, DialogProps>(function DialogContent(originalProps, ref) {
  const dialog = AK.useDialogContext()!;

  const [{ className, classNames, children, onToggle, ...props }, variantProps] = splitPropsVariants(
    originalProps,
    dialogStyle.variantKeys,
  );

  const close = useCallback(() => dialog.setOpen(false), [dialog]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => dialogStyle(variantProps), Object.values(variantProps));
  const baseTw = slots.base({ class: [dialogStaticClass('base'), className] });
  const wrapperTw = slots.wrapper({ class: [dialogStaticClass('wrapper'), classNames?.wrapper] });
  const backdropTw = slots.backdrop({ class: [dialogStaticClass('backdrop'), classNames?.backdrop] });

  return (
    <DialogInternalContext.Provider value={{ slots, classNames }}>
      <AK.Dialog
        {...props}
        // @ts-expect-error ignore
        onToggle={onToggle}
        ref={ref}
        className={baseTw}
        backdrop={<div className={backdropTw} />}
        render={props => (
          <div className={wrapperTw}>
            <div {...props} />
          </div>
        )}
      >
        <DialogInner close={close}>{children}</DialogInner>
      </AK.Dialog>
    </DialogInternalContext.Provider>
  );
});

function DialogInner({ children, close }: Pick<DialogProps, 'children'> & DialogRenderProps) {
  const {
    // @ts-expect-error pull render prop out, not needed
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: _render1,
    ...headingProps
  } = useDialogHeading();

  const {
    // @ts-expect-error pull render prop out, not needed
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: _render2,
    ...descriptionProps
  } = useDialogDescription();

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
