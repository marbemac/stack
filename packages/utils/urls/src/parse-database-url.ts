export const parseDatabaseUrl = (databaseUrl: string) => {
  const originalProtocol = databaseUrl.split('//')[0]!;

  let targetUrl = databaseUrl;

  // new URL does not handle exotic protocls (like postgres://) well...
  // it will mess up all of the parsing if the protocol is not standard
  if (!['http:', 'https:'].includes(originalProtocol)) {
    targetUrl = targetUrl.replace(originalProtocol, 'http:');
  }

  const { origin, host, hostname, username, password, pathname, port } = new URL(targetUrl);

  return {
    origin: origin.replace('http:', originalProtocol),
    host,
    hostname,
    port: port ? Number(port) : undefined,
    username: username ? decodeURIComponent(username) : undefined,
    password: password ? decodeURIComponent(password) : undefined,
    database: pathname.slice(1) || undefined,
  };
};

export const parseRedisUrl = (redisUrl: string) => {
  const { hostname, port, username, password, database } = parseDatabaseUrl(redisUrl);

  return {
    host: hostname, // popular libs like ioredis expects a host property, without the port :/
    port,
    username,
    password,
    db: Number(database || '0'),
  };
};
