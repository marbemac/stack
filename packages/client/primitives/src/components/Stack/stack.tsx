import type { StackProps as BStackProps, StackSlots } from '@marbemac/ui-styles';
import { makeStaticClass, stackStyle } from '@marbemac/ui-styles';
import type { ParentComponent, ValidComponent } from 'solid-js';
import { children, createMemo, For, Show, splitProps } from 'solid-js';

import { createPolymorphicComponent } from '../../utils/polymorphic.ts';
import { Box } from '../Box/index.ts';
import { mergeThemeProps, useThemeClasses } from '../Themed/utils.ts';

const staticClass = makeStaticClass<StackSlots>('stack');

export type StackProps = BStackProps<ValidComponent>;

/**
 * `Stack` makes it easy to stack elements together and apply a space between them.
 */
export const Stack = createPolymorphicComponent<'div', StackProps>(props => {
  props = mergeThemeProps(
    'Stack',
    {
      ...stackStyle.defaultVariants,
      divider: false,
    },
    props,
  );

  const themeClasses = useThemeClasses<StackSlots>('Stack', props);

  const [local, styleProps, others] = splitProps(
    props,
    ['children', 'UNSAFE_class', 'slotClasses', 'divider'],
    stackStyle.variantKeys,
  );

  const styles = createMemo(() => stackStyle(styleProps));

  return (
    <Box
      UNSAFE_class={[
        styles().base({
          class: [staticClass('root'), themeClasses.root, local.slotClasses?.root],
        }),
        local.UNSAFE_class,
      ]}
      {...others}
    >
      {local.divider ? (
        <StackList divider={local.divider} dividerClass={styles().divider()}>
          {local.children}
        </StackList>
      ) : (
        local.children
      )}
    </Box>
  );
});

interface StackListProps extends Pick<StackProps, 'divider'> {
  dividerClass: string;
}

const StackList: ParentComponent<StackListProps> = props => {
  const c = children(() => props.children).toArray();

  return (
    <For each={c}>
      {(child, i) => (
        <>
          <Show when={i() > 0 && props.divider}>
            {props.divider === true ? <Box UNSAFE_class={props.dividerClass} /> : props.divider}
          </Show>

          {child}
        </>
      )}
    </For>
  );
};

export type FixedDirectionStackProps = Omit<StackProps, 'dir'>;

/**
 * `HStack` arranges its children in a horizontal line.
 */
export const HStack = createPolymorphicComponent<'div', FixedDirectionStackProps>(props => {
  return <Stack {...props} dir="horizontal" />;
});

/**
 * `VStack` arranges its children in a vertical line.
 */
export const VStack = createPolymorphicComponent<'div', FixedDirectionStackProps>(props => {
  return <Stack {...props} dir="vertical" />;
});
