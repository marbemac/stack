import { Button as KButton } from '@kobalte/core';
import type { ButtonProps as BButtonProps, ButtonSlots } from '@marbemac/ui-styles';
import { buttonStyle, makeStaticClass } from '@marbemac/ui-styles';
import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { createMemo, splitProps } from 'solid-js';

import { createPolymorphicComponent } from '../../utils/polymorphic.ts';
import { Box } from '../Box/index.ts';
import type { IconProps } from '../Icon/index.ts';
import { Icon } from '../Icon/index.ts';
import { mergeThemeProps, useThemeClasses } from '../Themed/utils.ts';

const staticClass = makeStaticClass<ButtonSlots>('button');

export type ButtonProps = BButtonProps<Component<any>>;

const DEFAULT_SPINNER: IconProps['icon'] = 'spinner';

export const Button = createPolymorphicComponent<'button', ButtonProps>(props => {
  props = mergeThemeProps(
    'Button',
    {
      ...buttonStyle.defaultVariants,
    },
    props,
  );

  const themeClasses = useThemeClasses<ButtonSlots>('Button', props);

  const [local, styleProps, others] = splitProps(
    props,
    [
      'children',
      'UNSAFE_class',
      'slotClasses',
      'startIcon',
      'endIcon',
      'loadingIcon',
      'loadingText',
      'loadingPlacement',
    ],
    buttonStyle.variantKeys,
  );

  const styles = createMemo(() =>
    buttonStyle({ ...styleProps, isInteractive: !styleProps.isDisabled && !styleProps.isLoading }),
  );

  const startIcon = () => {
    if (!styleProps.isLoading) return local.startIcon;
    if (local.loadingText && local.loadingPlacement === 'end') return undefined;
    return DEFAULT_SPINNER;
  };

  const endIcon = () => {
    if (!styleProps.isLoading) return local.endIcon;
    if (local.loadingText && local.loadingPlacement === 'end') return DEFAULT_SPINNER;
    return undefined;
  };

  const content = () => {
    if (!styleProps.isLoading) return local.children;
    return local.loadingText;
  };

  const isIconButton = () => !content();

  return (
    <Box
      as={KButton.Root}
      UNSAFE_class={[
        styles().base({
          class: [staticClass('root'), themeClasses.root, local.slotClasses?.root],
        }),
        local.UNSAFE_class,
      ]}
      disabled={styleProps.isDisabled}
      {...others}
    >
      <Show when={startIcon() && (!isIconButton() || !endIcon())}>
        <Icon
          UNSAFE_class={styles().icon({
            class: [staticClass('icon'), themeClasses.icon, local.slotClasses?.icon],
          })}
          icon={startIcon()!}
          spin={styleProps.isLoading}
        />
      </Show>

      <Show when={content()}>
        <Box
          UNSAFE_class={styles().text({
            class: [staticClass('text'), themeClasses.text, local.slotClasses?.text],
          })}
        >
          {content()}
        </Box>
      </Show>

      <Show when={endIcon()}>
        <Icon
          UNSAFE_class={styles().icon({
            class: [staticClass('icon'), themeClasses.icon, local.slotClasses?.icon],
          })}
          icon={endIcon()!}
          spin={styleProps.isLoading}
        />
      </Show>
    </Box>
  );
});
