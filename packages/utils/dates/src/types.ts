export type UnixTimestampSeconds = number;
export type UnixTimestampMilliseconds = number;
export type ClickHouseDateTime = `${number}-${number}-${number} ${number}:${number}:${number}`;
export type ClickHouseDateTime64 = `${number}-${number}-${number} ${number}:${number}:${number}.${number}`;
export type ClickHouseQueryableDateTime = ClickHouseDateTime | UnixTimestampSeconds;
export type ClickHouseQueryableDateTime64 = ClickHouseDateTime64 | UnixTimestampMilliseconds;
