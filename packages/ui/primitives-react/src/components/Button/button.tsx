import type { ButtonProps as BButtonProps, ButtonSlots } from '@marbemac/ui-styles';
import { buttonStaticClass, buttonStyle, splitPropsVariants } from '@marbemac/ui-styles';
import { useMemo } from 'react';

import { useStyleProps } from '../../provider.tsx';
import { polyRef } from '../../utils/forward-ref.ts';
import { Box } from '../Box/index.ts';
import type { IconProps } from '../Icon/index.ts';
import { Icon } from '../Icon/index.ts';
import { useMergeThemeProps, useThemeClasses } from '../Themed/utils.ts';

export type ButtonProps = BButtonProps<React.ReactNode> & {
  children?: React.ReactNode;
};

const DEFAULT_SPINNER: IconProps['icon'] = 'spinner';

export const Button = polyRef<'button', ButtonProps>((props, ref) => {
  props = useMergeThemeProps('Button', buttonStyle.defaultVariants, props);

  const [local, variantProps] = splitPropsVariants(props, buttonStyle.variantKeys);

  const {
    as: As = 'button',
    children,
    UNSAFE_class,
    slotClasses,
    startIcon,
    endIcon,
    loadingIcon,
    loadingText,
    loadingPlacement,
    tw,
    ...others
  } = local;

  const isInteractive = !variantProps.isDisabled && !variantProps.isLoading;

  const slots = useMemo(
    () => buttonStyle({ ...variantProps, isInteractive }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(variantProps), isInteractive],
  );

  const themeClasses = useThemeClasses<ButtonSlots>('Button', props);
  const baseClass = slots.base({ class: [themeClasses.base, slotClasses?.base] });
  const iconClass = slots.icon({ class: [themeClasses.icon, slotClasses?.icon] });
  const textClass = slots.text({ class: [themeClasses.text, slotClasses?.text] });

  const rootClass = useStyleProps({ tw: [baseClass, tw], UNSAFE_class: [buttonStaticClass('base'), UNSAFE_class] });

  const startIconElem = !variantProps.isLoading
    ? startIcon
    : loadingText && loadingPlacement === 'end'
    ? null
    : DEFAULT_SPINNER;

  const endIconElem = !variantProps.isLoading
    ? endIcon
    : loadingText && loadingPlacement === 'end'
    ? DEFAULT_SPINNER
    : null;

  const contentElem = !variantProps.isLoading ? children : loadingText;
  const hasContent = contentElem !== undefined && contentElem !== null;
  const isIconButton = !hasContent;

  return (
    <As {...others} ref={ref} className={rootClass} disabled={variantProps.isDisabled}>
      {startIconElem && (!isIconButton || !endIconElem) ? (
        <Icon
          tw={iconClass}
          UNSAFE_class={buttonStaticClass('icon')}
          icon={startIconElem}
          spin={variantProps.isLoading}
        />
      ) : null}

      {hasContent ? (
        <Box tw={textClass} UNSAFE_class={buttonStaticClass('text')}>
          {contentElem}
        </Box>
      ) : null}

      {endIconElem ? (
        <Icon
          tw={iconClass}
          UNSAFE_class={buttonStaticClass('icon')}
          icon={endIconElem}
          spin={variantProps.isLoading}
        />
      ) : null}
    </As>
  );
});
