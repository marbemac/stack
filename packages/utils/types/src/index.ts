export type { TemplatedRoutePaths } from './routing.js';

/**
 * Use this when you need a "relaxed" string union type to preserve autocomplete.
 *
 * @example
 * type KeyTraitName = 't1' | 't2' | 't3';
 * export type TraitName = StringWithAutocomplete<KeyTraitName>;
 */
export type StringWithAutocomplete<T> = T | (string & Record<never, never>);

/**
 * Anything we need from type-fest, re-export here.
 */
export type { SetOptional, SetRequired } from 'type-fest';
