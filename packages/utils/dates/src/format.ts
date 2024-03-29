import dayjs from 'dayjs';

import type { ClickHouseDateTime, ClickHouseDateTime64 } from './types.ts';
import { isUnixTimestampSeconds } from './validation.ts';

export const formatToMonthYear = (date: string) => {
  return dayjs(date).format('MMM YY');
};

export const formatForClickHouse = (date: dayjs.ConfigType) => {
  return parseDate(date).utc().format('YYYY-MM-DD HH:mm:ss') as ClickHouseDateTime;
};

export const formatForClickHouse64 = (date: dayjs.ConfigType) => {
  return parseDate(date).utc().format('YYYY-MM-DD HH:mm:ss.SSS') as ClickHouseDateTime64;
};

export const parseDate = (date: dayjs.ConfigType) => {
  return isUnixTimestampSeconds(date) ? dayjs.unix(date) : dayjs(date);
};
