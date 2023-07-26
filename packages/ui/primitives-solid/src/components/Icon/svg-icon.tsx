/**
 * Portions of this file are based on code from solid-fa.
 * MIT Licensed
 *
 * Credits:
 * https://github.com/Cweili/solid-fa/blob/master/src/Fa/index.tsx
 */

import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { createMemo, mergeProps, Show } from 'solid-js';

interface SolidFaProps {
  icon: IconDefinition;
  class?: string;

  // Duotone Icons
  primaryColor?: string;
  secondaryColor?: string;
  primaryOpacity?: number | string;
  secondaryOpacity?: number | string;
  swapOpacity?: boolean;
}

export const FaSvg = (p: SolidFaProps) => {
  const props = mergeProps(
    {
      primaryOpacity: 1,
      secondaryOpacity: 0.4,
    },
    p,
  );

  const i = createMemo(() => props.icon?.icon || [0, 0, '', [], '']);

  return (
    <svg
      class={props.class}
      viewBox={`0 0 ${i()[0]} ${i()[1]}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      style={{ 'vertical-align': '-0.125em' }}
    >
      <g transform={`translate(${i()[0] / 2} ${i()[1] / 2})`} transform-origin={`${i()[0] / 4} 0`}>
        <Show
          when={typeof i()[4] === 'string'}
          fallback={
            <>
              <path
                d={i()[4][0]}
                fill={props.secondaryColor || 'currentColor'}
                fill-opacity={props.swapOpacity != false ? props.primaryOpacity : props.secondaryOpacity}
                transform={`translate(${i()[0] / -2} ${i()[1] / -2})`}
              />
              <path
                d={i()[4][1]}
                fill={props.primaryColor || 'currentColor'}
                fill-opacity={props.swapOpacity != false ? props.secondaryOpacity : props.primaryOpacity}
                transform={`translate(${i()[0] / -2} ${i()[1] / -2})`}
              />
            </>
          }
        >
          <path
            d={i()[4] as string}
            fill={props.primaryColor || 'currentColor'}
            transform={`translate(${i()[0] / -2} ${i()[1] / -2})`}
          />
        </Show>
      </g>
    </svg>
  );
};
