import dayjs from 'dayjs';

import type { ClickHouseDateTime } from './types.ts';

export const formatToMonthYear = (date: string) => {
  return dayjs(date).format('MMM YY');
};

export const formatForClickHouse = (date: dayjs.ConfigType): ClickHouseDateTime => {
  return dayjs(date).utc().format('YYYY-MM-DD HH:mm:ss') as ClickHouseDateTime;
};
