export { boolean, customType, integer, pgTable as table, text, timestamp } from 'drizzle-orm/pg-core';

import { customType } from 'drizzle-orm/pg-core';

export const id = <Type>() => {
  return customType<{ data: Type; driverData: string; notNull: true }>({
    dataType() {
      return 'text';
    },

    // toDriver(value) {
    //   return value ? 1 : 0;
    // },

    // fromDriver(value) {
    //   return value === 1 ? true : false;
    // },
  });
};
