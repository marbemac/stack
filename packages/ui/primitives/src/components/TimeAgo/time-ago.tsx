import { dayjs } from '@marbemac/utils-dates';
import { forwardRef, useEffect, useState } from 'react';

import { createElement, type Options, type Props } from '../../utils/composition.tsx';
import { type ContextValue, createContext, useContextProps } from '../../utils/context.tsx';

export interface TimeAgoOptions extends Options {
  /**
   * A date in the past or the future.
   */
  date: string | number | Date;

  /**
   * Whether or not the component should update itself over time.
   *
   * @default true
   */
  live?: boolean;
}

export type TimeAgoProps<T extends React.ElementType = 'time'> = Props<T, TimeAgoOptions>;

export const [TimeAgoContext, useTimeAgoContext] = createContext<ContextValue<TimeAgoProps, HTMLTimeElement>>({
  name: 'TimeAgoContext',
  strict: false,
});

export const TimeAgo = forwardRef<HTMLTimeElement, TimeAgoProps>(function TimeAgo(originalProps, ref) {
  [originalProps, ref] = useContextProps(originalProps, ref, TimeAgoContext);

  const { date, live = true, ...props } = originalProps;

  const [d, setD] = useState(dayjs(date));
  const [time, setTime] = useState(d.fromNow());
  const [period, setPeriod] = useState(5);

  useEffect(() => {
    setD(dayjs(date));
  }, [date]);

  useEffect(() => {
    if (live) {
      const interval = setInterval(() => {
        setTime(d.fromNow());

        const diff = Math.abs(d.diff(Date.now(), 'seconds'));
        if (diff > 60 * 60) {
          setPeriod(60 * 5);
        } else if (diff > 60) {
          setPeriod(60);
        } else if (diff > 20) {
          setPeriod(10);
        }
      }, period * 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [d, live, period]);

  let dateTime: string | undefined = undefined;
  if (!props.render) {
    dateTime = d.toISOString();
  }

  return createElement('time', { ...props, ref, dateTime, children: time });
});
