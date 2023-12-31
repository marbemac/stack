import { type JSX } from "solid-js";
import type { MatchFilters, Params, PathMatch, Route, SetParams } from "./types";
export declare function normalizePath(path: string, omitSlash?: boolean): string;
export declare function resolvePath(base: string, path: string, from?: string): string | undefined;
export declare function invariant<T>(value: T | null | undefined, message: string): T;
export declare function joinPaths(from: string, to: string): string;
export declare function extractSearchParams(url: URL): Params;
export declare function createMatcher<S extends string>(path: S, partial?: boolean, matchFilters?: MatchFilters<S>): (location: string) => PathMatch | null;
export declare function scoreRoute(route: Route): number;
export declare function createMemoObject<T extends Record<string | symbol, unknown>>(fn: () => T): T;
export declare function mergeSearchString(search: string, params: SetParams): string;
export declare function expandOptionals(pattern: string): string[];
/**
 * Creates a new event handler.
 * This new handler calls all given handlers in the order given, with the same event.
 */
export declare function composeEventHandlers<T>(handlers: Array<JSX.EventHandlerUnion<T, any> | undefined>): (event: any) => void;
