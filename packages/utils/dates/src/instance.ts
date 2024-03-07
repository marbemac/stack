import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import isToday from 'dayjs/plugin/isToday.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import timezone from 'dayjs/plugin/timezone.js';
import toObject from 'dayjs/plugin/toObject.js';
import utc from 'dayjs/plugin/utc.js';
import weekday from 'dayjs/plugin/weekday.js';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(weekday);
dayjs.extend(toObject);
dayjs.extend(isToday);
dayjs.extend(timezone);

export { dayjs };
