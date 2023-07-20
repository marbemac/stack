import type { AsChildProp as KAsChildProp } from '@kobalte/core';
import type { OverrideComponentProps as KOverrideComponentProps } from '@kobalte/utils';
import type { ValidComponent } from 'solid-js';

export type AsChildProp = KAsChildProp;
export type OverrideComponentProps<T extends ValidComponent, P> = KOverrideComponentProps<T, P>;
