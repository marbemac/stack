export const parseDatabaseUrl = (databaseUrl: string) => {
  const originalProtocol = databaseUrl.split('//')[0]!;

  let targetUrl = databaseUrl;

  // new URL does not handle exotic protocls (like postgres://) well...
  // it will mess up all of the parsing if the protocol is not standard
  if (!['http:', 'https:'].includes(originalProtocol)) {
    targetUrl = targetUrl.replace(originalProtocol, 'http:');
  }

  const { origin, host, username, password, pathname } = new URL(targetUrl);

  return {
    origin,
    host,
    username,
    password,
    database: pathname.slice(1),
  };
};
