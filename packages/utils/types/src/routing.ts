/**
 * Use it like so:
 *
 * type AppRoutes = TemplatedRoutePaths<ReturnType<typeof createRoutes>>
 */
export type TemplatedRoutePaths<T extends RoutePart[]> = ChopSuffix<
  '/',
  ExtractPathParams<ChopSuffix<'/', PathsUnion<T>>>
>;

type RoutePart = {
  readonly path?: string;
  children?: RoutePart[];
};

// prefixes a "/" to T["path"] if "nested" is true
type PathsUnionHelper<T extends RoutePart> = T['path'] extends string ? `/${T['path']}` : '';

// extracts all route full-paths in the application
type PathsUnion<T extends RoutePart[]> = T extends Array<infer U>
  ? U extends RoutePart
    ? // routes that don't have "path" are ignored, including routes that are {index: true}
      'path' extends keyof U
      ? // if "path" exists in Route then add it to the path list
        | PathsUnionHelper<U>
          // if "children" exists in Route then go through the children recursively prefixing
          // U["path"] to the childrens "path" and add them to the list as well
          | `${PathsUnionHelper<U>}${U extends { children: any }
              ? `${PathsUnion<U['children']>}`
              : // if Route doesn't have children just add the same value again:
                ''}`
      : never
    : never
  : never;

type Split<T extends string, Separator extends string> = T extends `${infer Head}${Separator}${infer Tail}`
  ? [Head, ...Split<Tail, Separator>]
  : [T];

type ChopSuffix<Suffix extends string, S> = S extends Suffix ? S : S extends `${infer Rest}${Suffix}` ? Rest : S;

type ExtractPathParams<Path extends string, Items = Split<Path, '/'>> = Items extends [infer Head, ...infer Tail]
  ? Head extends `:${string}`
    ? `${string}/${ExtractPathParams<Path, Tail>}`
    : Head extends string
    ? `${Head}/${ExtractPathParams<Path, Tail>}`
    : never
  : '';
