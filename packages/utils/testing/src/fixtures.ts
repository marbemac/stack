import fs from 'node:fs';
import path from 'node:path';

/**
 * Loads a directory of JSON fixtures.
 */
export function loadFixtures<FixtureShape>(
  root: string,
  dir: string,
  options: { allowList?: string[]; denyList?: string[] } = {},
) {
  const from = path.resolve(root, dir);
  const files = fs.readdirSync(from);

  const fixtures = {};

  for (const file of files) {
    const filePath = path.join(from, file);

    if (file.endsWith('json')) {
      if (options.allowList?.length && !options.allowList.includes(file)) {
        continue;
      }

      if (options.denyList?.includes(file)) {
        continue;
      }

      fixtures[file] = JSON.parse(fs.readFileSync(filePath).toString());

      continue;
    }

    throw new Error(`Invalid fixture type found: ${file}`);
  }

  return fixtures as unknown as Record<string, FixtureShape[]>;
}

export function flattenFixtures<FixtureShape>(fixtures: Record<string, FixtureShape[]>) {
  const flattenedFixtures = {};

  for (const moduleKey in fixtures) {
    for (const moduleExport in fixtures[moduleKey]) {
      // Check if our flattenedFixtures already contains a key with the same export.
      // If it does, we want to throw and make sure that we dont silently override the fixtures.
      if (flattenedFixtures?.[moduleKey]?.[moduleExport]) {
        throw new Error(
          `Flatten will override ${flattenedFixtures[moduleKey]} with ${fixtures[moduleKey]![moduleExport]}`,
        );
      }

      flattenedFixtures[moduleExport] = fixtures[moduleKey]![moduleExport];
    }
  }

  return flattenedFixtures as unknown as Record<string, FixtureShape>;
}
