import * as AK from '@ariakit/react';
import type { TooltipSlotProps, TooltipStyleProps } from '@marbemac/ui-styles';
import { splitPropsVariants, tooltipStaticClass, tooltipStyle } from '@marbemac/ui-styles';
import { forwardRef, useMemo } from 'react';

import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';

export interface TooltipProps
  extends Omit<AK.TooltipProps, 'store' | 'onChange' | 'children' | 'content' | 'onToggle'>,
    TooltipStyleProps,
    TooltipSlotProps {
  content: React.ReactNode;
  children?: React.ReactElement;
  multiline?: boolean;

  defaultOpen?: AK.TooltipStoreProps['defaultOpen'];
  isOpen?: AK.TooltipStoreProps['open'];
  onToggle?: AK.TooltipStoreProps['setOpen'];
  placement?: AK.TooltipStoreProps['placement'];
  hideArrow?: boolean;
}

export const [TooltipContext, useTooltipContext] = createContext<ContextValue<TooltipProps, HTMLDivElement>>({
  name: 'TooltipContext',
  strict: false,
});

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, TooltipContext, {
    // Defaults
    gutter: 2,
    placement: 'bottom',
    unmountOnHide: true,
    modal: false,
  });

  const { isOpen, onToggle, placement, children, content, defaultOpen, ...props } = originalProps;

  const tooltip = AK.useTooltipStore({
    defaultOpen,
    open: isOpen,
    placement,
    setOpen: onToggle,
  });

  const renderTooltip = tooltip.useState(state => state.open || state.animating);

  return (
    <AK.TooltipProvider store={tooltip}>
      <AK.TooltipAnchor render={children} />

      {renderTooltip && (
        <TooltipContent {...props} placement={placement}>
          {content}
        </TooltipContent>
      )}
    </AK.TooltipProvider>
  );
});

const TooltipContent = forwardRef<
  HTMLDivElement,
  Omit<TooltipProps, 'children' | 'content'> & { children: React.ReactNode }
>(function TooltipContent(originalProps, ref) {
  const [{ className, classNames, children, placement, hideArrow, onToggle, ...props }, variantProps] =
    splitPropsVariants(originalProps, tooltipStyle.variantKeys);

  const side = placement?.split('-')[0];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => tooltipStyle(variantProps), Object.values(variantProps));
  const baseTw = slots.base({ class: [tooltipStaticClass('base'), className] });
  const textTw = slots.text({ class: [tooltipStaticClass('text'), classNames?.text] });
  const arrowTw = slots.arrow({ class: [tooltipStaticClass('arrow'), classNames?.arrow] });

  return (
    <AK.Tooltip
      {...props}
      // @ts-expect-error ignore
      onToggle={onToggle}
      ref={ref}
      className={baseTw}
      data-side={side}
    >
      <div className={textTw}>{children}</div>
      {!hideArrow && <AK.TooltipArrow className={arrowTw} />}
    </AK.Tooltip>
  );
});
