export type UnixTimestamp = number;
export type ClickHouseDateTime = `${number}-${number}-${number} ${number}:${number}:${number}`;
export type ClickHouseQueryableDateTime = ClickHouseDateTime | UnixTimestamp;
