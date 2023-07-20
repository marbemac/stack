export { customType, integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core';

import { customType } from 'drizzle-orm/sqlite-core';

export const boolean = customType<{ data: boolean; driverData: number; notNull: true; default: true }>({
  dataType() {
    return 'integer';
  },

  toDriver(value) {
    return value ? 1 : 0;
  },

  fromDriver(value) {
    return value === 1 ? true : false;
  },
});

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
