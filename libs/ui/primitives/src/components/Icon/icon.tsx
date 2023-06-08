import type { IconDefinition, IconLookup, IconName, IconPrefix } from '@fortawesome/fontawesome-common-types';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { IconProps as BIconProps, IconSlots } from '@marbemac/ui-styles';
import { iconStyle } from '@marbemac/ui-styles';
import { makeStaticClass } from '@marbemac/ui-styles';
import type { Component } from 'solid-js';
import { Match, Switch } from 'solid-js';
import { createMemo, splitProps } from 'solid-js';

import { Box } from '../Box/index.ts';
import { useThemeClasses } from '../Themed/utils.ts';
import { initLibrary } from './standard-library.ts';
import { FaSvg } from './svg-icon.tsx';

const staticClass = makeStaticClass<IconSlots>('icon');

export type IconProps = BIconProps<Component<any>>;

export const DEFAULT_STYLE: IconPrefix = 'fas';

const IS_ELEMENT = '__ELEMENT__' as const;

export const Icon = (props: IconProps) => {
  initLibrary();

  const themeClasses = useThemeClasses<IconSlots>('Icon', props);

  const [local, styleProps, others] = splitProps(props, ['UNSAFE_class', 'slotClasses', 'icon'], iconStyle.variantKeys);

  const styles = createMemo(() => iconStyle(styleProps));

  const iconProp = createMemo(() => normalizeIconArgs(local.icon, DEFAULT_STYLE));
  const isComponentIcon = createMemo(() => iconProp() === IS_ELEMENT);
  const iconDefinition = createMemo(() =>
    isIconDefinition(iconProp()) ? (iconProp() as IconDefinition) : findIconDefinition(iconProp() as any),
  );
  const rootClass = createMemo(() => [
    styles().base({
      class: [staticClass('root'), themeClasses.root, local.slotClasses?.root],
    }),
    local.UNSAFE_class,
  ]);

  return (
    <Switch>
      <Match when={iconDefinition()}>
        <Box as={FaSvg} icon={iconDefinition()} UNSAFE_class={rootClass()} {...others} />
      </Match>

      <Match when={isComponentIcon()}>{local.icon as any}</Match>

      <Match when={iconProp()}>
        {iconP => (
          <Box
            as="i"
            role="img"
            aria-hidden
            UNSAFE_class={[
              staticClass('root'),
              themeClasses.root,
              local.slotClasses?.root,
              ...iconFACX({ ...(iconP() as any), ...styleProps }),
            ]}
            {...others}
          />
        )}
      </Match>
    </Switch>
  );
};

type IconFACXProps = {
  prefix: IconPrefix;
  iconName: IconName;
  fw?: boolean;
  spin?: boolean;
  pulse?: boolean;
  ping?: boolean;
  bounce?: boolean;
};

const iconFACX = (props: IconFACXProps) => {
  return [
    props.prefix,
    `fa-${props.iconName}`,
    props.fw && 'fa-fw',
    props.spin && 'fa-spin',
    props.pulse && 'fa-pulse',
    props.ping && 'fa-ping',
    props.bounce && 'fa-bounce',
  ];
};

export function isIconDefinition(prop?: unknown): prop is IconDefinition {
  if (prop && typeof prop === 'object' && Object.prototype.hasOwnProperty.call(prop, 'icon')) return true;
  return false;
}

export function isIconProp(prop?: unknown): prop is IconProps['icon'] {
  if ((prop && typeof prop === 'string') || Array.isArray(prop)) return true;
  if (prop && typeof prop === 'object' && Object.prototype.hasOwnProperty.call(prop, 'iconName')) return true;
  return false;
}

// Adapted from https://github.com/FortAwesome/react-fontawesome/blob/master/src/utils/normalize-icon-args.js
// Adds defaultPrefix and adjusts to fix some typings issues
function normalizeIconArgs(
  icon: IconProps['icon'],
  defaultPrefix: IconPrefix = 'fas',
): IconLookup | IconDefinition | null | typeof IS_ELEMENT {
  // if the icon is null, there's nothing to do
  if (icon === null) {
    return null;
  }

  if (Array.isArray(icon)) {
    // use the first item as prefix, second as icon name
    return { prefix: icon[0], iconName: icon[1] };
  }

  // if the icon is an object and has a prefix and an icon name, return it
  if (typeof icon === 'object' && icon.iconName) {
    return icon;
  }

  // if it's a string, use it as the icon name
  if (typeof icon === 'string') {
    return { prefix: defaultPrefix, iconName: icon };
  }

  return IS_ELEMENT;
}
