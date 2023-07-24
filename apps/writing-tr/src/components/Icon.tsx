/**
 * Portions of this file are based on code from solid-fa.
 * MIT Licensed
 *
 * Credits:
 * https://github.com/Cweili/solid-fa/blob/master/src/Fa/index.tsx
 */

import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { useMemo } from 'react';

import { cn } from '~/utils/cn.ts';

interface FaProps {
  icon: IconDefinition;
  className?: string;

  // Duotone Icons
  primaryColor?: string;
  secondaryColor?: string;
  primaryOpacity?: number | string;
  secondaryOpacity?: number | string;
  swapOpacity?: boolean;
}

export const Icon = ({ icon, className, primaryColor, secondaryColor, swapOpacity, ...rest }: FaProps) => {
  const primaryOpacity = rest.primaryOpacity === undefined ? 1 : rest.primaryOpacity;
  const secondaryOpacity = rest.secondaryOpacity === undefined ? 0.4 : rest.secondaryOpacity;

  const i = useMemo(() => icon.icon || ([0, 0, '', [], ''] as const), [icon]);

  return (
    <svg
      className={cn('h-[1em]', className)}
      viewBox={`0 0 ${i[0]} ${i[1]}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: '-0.125em' }}
    >
      <g transform={`translate(${i[0] / 2} ${i[1] / 2})`} transform-origin={`${i[0] / 4} 0`}>
        {typeof i[4] === 'string' ? (
          <path
            d={i[4] as string}
            fill={primaryColor || 'currentColor'}
            transform={`translate(${i[0] / -2} ${i[1] / -2})`}
          />
        ) : (
          <>
            <path
              d={i[4][0]}
              fill={secondaryColor || 'currentColor'}
              fill-opacity={swapOpacity != false ? primaryOpacity : secondaryOpacity}
              transform={`translate(${i[0] / -2} ${i[1] / -2})`}
            />
            <path
              d={i[4][1]}
              fill={primaryColor || 'currentColor'}
              fill-opacity={swapOpacity != false ? secondaryOpacity : primaryOpacity}
              transform={`translate(${i[0] / -2} ${i[1] / -2})`}
            />
          </>
        )}
      </g>
    </svg>
  );
};
