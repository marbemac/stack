import type { AvatarSlotProps, AvatarStyleProps } from '@marbemac/ui-styles';
import { avatarStaticClass, avatarStyle, splitPropsVariants } from '@marbemac/ui-styles';
import { forwardRef, useMemo } from 'react';

import { useImage } from '../../hooks/use-image.ts';
import type { ReactRef } from '../../types.ts';
import { createElement, type Options, type Props } from '../../utils/composition.tsx';
import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';
import { useDOMRef } from '../../utils/dom.ts';
import { Icon, type IconProps } from '../Icon/icon.tsx';

export interface AvatarOptions extends Options, AvatarStyleProps, AvatarSlotProps {
  /**
   * The name of the entity in the avatar.
   *
   * - if **src** has loaded, the name will be used as the **alt** attribute of the **img**
   * - If **src** is not loaded or not set, the name will be used to create the initials
   */
  name?: string;

  /**
   * Image source.
   */
  src?: string;

  /**
   * Image alt text.
   */
  alt?: string;

  /*
   * Avatar icon.
   */
  icon?: IconProps['icon'];

  /**
   * If `true`, the fallback logic will be skipped.
   * @default false
   */
  ignoreFallback?: boolean;

  /**
   * Function to get the initials to display
   */
  getInitials?: (name: string) => string;

  /**
   * Custom fallback component.
   */
  fallback?: React.ReactNode;

  /**
   * Function called when image failed to load
   */
  onError?: () => void;

  /**
   * Ref to the Image DOM node.
   */
  imgRef?: ReactRef<HTMLImageElement>;

  /**
   * The component used to render the image.
   * @default "img"
   */
  ImgComponent?: React.ElementType;

  /**
   * Props to pass to the image component.
   */
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

export type AvatarProps<T extends React.ElementType = 'span'> = Props<T, AvatarOptions>;

export const [AvatarContext, useAvatarContext] = createContext<ContextValue<AvatarProps, HTMLSpanElement>>({
  name: 'AvatarContext',
  strict: false,
});

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(props, ref) {
  [props, ref] = useContextProps(props, ref, AvatarContext);

  const [localProps, variantProps] = splitPropsVariants(props, avatarStyle.variantKeys);

  const {
    className,
    classNames,
    src,
    name,
    icon,
    fallback: fallbackComponent,
    alt = name ?? 'avatar',
    getInitials = initials,
    ignoreFallback,
    onError,
    imgRef: imgRefProp,
    ImgComponent = 'img',
    imgProps,
    ...otherProps
  } = localProps;

  const imgRef = useDOMRef(imgRefProp);
  const imageStatus = useImage({ src, onError, ignoreFallback });
  const hasImageLoaded = imageStatus === 'loaded';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const slots = useMemo(() => avatarStyle(variantProps), [...Object.values(variantProps)]);

  const baseTw = slots.base({ class: [avatarStaticClass('base'), className] });
  const imageTw = slots.image({ class: [avatarStaticClass('image'), classNames?.image, !hasImageLoaded && 'hidden'] });
  const fallbackTw = slots.fallback({ class: [avatarStaticClass('fallback'), classNames?.fallback] });

  const imgElem = src ? (
    <ImgComponent ref={imgRef} className={imageTw} src={src} data-loaded={hasImageLoaded || undefined} {...imgProps} />
  ) : null;

  /**
   * Fallback avatar applies under 2 conditions:
   *
   * - If `src` was passed and the image has not loaded or failed to load
   * - If `src` wasn't passed
   *
   * For this case the fallback will either be the name based initials, custom icon, or default icon.
   */
  const showFallback = !src || !hasImageLoaded;
  const singleLetter = variantProps.size === 'sm';

  const fallbackElem = useMemo(() => {
    if (!showFallback && src) return null;

    let elem = fallbackComponent ?? name;
    if (fallbackComponent) {
      elem = fallbackComponent;
    } else if (name) {
      elem = getInitials(name, singleLetter);
    } else if (icon) {
      elem = <Icon icon={icon} />;
    }

    if (elem) {
      return (
        <div aria-label={alt} className={fallbackTw} role="img">
          {elem}
        </div>
      );
    }

    return null;
  }, [showFallback, src, fallbackComponent, name, icon, getInitials, singleLetter, alt, fallbackTw]);

  const children = [imgElem, fallbackElem];

  return createElement('span', { ...otherProps, ref, className: baseTw, children });
});

function initials(name: string, single?: boolean) {
  const [first, second] = name.split(' ');

  // should not happen
  if (!first) return '!';

  if (single) {
    return first.charAt(0);
  }

  if (!second) {
    return first.slice(0, 2);
  }

  return `${first.charAt(0)}${second.charAt(0)}`;
}
