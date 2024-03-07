import type { SetOptional } from '@marbemac/utils-types';

import type { QualifierOp, QualifierToken, SimpleParseResult } from './parse.ts';
import type { LexerT } from './parse.ts';
import { isRawToken } from './parse.ts';
import { isQualifier, isQualifierMulti } from './parse.ts';

export interface QualifierInput {
  key: string;
  val: unknown;

  /**
   * @default =
   */
  op?: QualifierOp;
}

export const addQualifier = <T extends SimpleParseResult['tokens']>(
  tokens: T,
  qualifier: QualifierInput,
  { or, toggle, replace }: { or?: boolean; toggle?: boolean; replace?: boolean } = {},
) => {
  const value = String(qualifier.val);

  const existing = findQualifiersByKey(tokens, qualifier.key);
  if (existing.length) {
    const existingWithValue = findQualifierWithValue(existing, qualifier.val);
    if (existingWithValue) {
      if (toggle) {
        if (or) {
          // removeQualifierValByPos(existingWithValue.parent, existingWithValue.index, qualifier.val);
          removeQualifierValByRef(tokens, existingWithValue, qualifier.val);
        } else {
          removeQualifierByRef(tokens, existingWithValue);
        }
      }

      return;
    } else if (or) {
      const firstExisting = existing[0] as QualifierToken<'simple'>;
      if (isQualifierMulti(firstExisting)) {
        firstExisting.val.push({ value });
      } else {
        // @ts-expect-error ignore
        firstExisting.val = [firstExisting.val, { value }];
      }

      return;
    }
  }

  const item = {
    op: qualifier.op || '=',
    key: {
      value: qualifier.key,
    },
    val: {
      value,
    },
  };

  const lastExisting = existing ? existing[existing.length - 1] : null;
  const targetPos = lastExisting ? tokens.indexOf(lastExisting) + (replace ? 0 : 1) : -1;
  const del = replace ? 1 : 0;

  if (targetPos >= 0) {
    tokens.splice(targetPos, del, item);
  } else {
    tokens.push(item);
  }
};

export const removeQualifier = <T extends SimpleParseResult['tokens']>(
  tokens: T,
  qualifier: SetOptional<QualifierInput, 'val'>,
) => {
  const existing = findQualifiersByKey(tokens, qualifier.key);
  if (!existing.length) return;

  if (qualifier.val !== undefined) {
    const existingWithValue = findQualifierWithValue(existing, qualifier.val);
    if (!existingWithValue) return;

    removeQualifierValByRef(tokens, existingWithValue, qualifier.val);
  } else {
    for (const item of existing) {
      removeQualifierByRef(tokens, item);
    }
  }
};

export const findQualifierWithValue = (qualifiers?: QualifierToken<LexerT>[], target?: unknown, op?: QualifierOp) => {
  if (!qualifiers || !qualifiers.length) return;

  for (const q of qualifiers) {
    if (op && q.op !== op) continue;

    if (isQualifierMulti(q)) {
      const found = q.val.find(v => v.value === String(target));
      if (found) return q;
    } else if (q.val.value === String(target)) {
      return q;
    }
  }

  return;
};

/**
 * INTERNAL BELOW
 */

const removeQualifierByPos = <T extends SimpleParseResult['tokens']>(tokens: T, pos: number) => {
  tokens.splice(pos, 1);
};

const removeQualifierByRef = <T extends SimpleParseResult['tokens']>(tokens: T, item: QualifierToken<LexerT>) => {
  const index = tokens.indexOf(item);
  if (index !== -1) {
    removeQualifierByPos(tokens, index);
  }
};

const findQualifiersByKey = <T extends SimpleParseResult['tokens']>(tokens: T, key: string) => {
  return tokens.filter(t => isQualifier(t) && t.key.value === key) as unknown as QualifierToken<LexerT>[];
};

const removeQualifierValByRef = <T extends SimpleParseResult['tokens']>(
  tokens: T,
  item: QualifierToken<LexerT>,
  val: unknown,
) => {
  const index = tokens.indexOf(item);
  if (index === -1) return;

  const token = tokens[index]!;

  if (isRawToken(token)) {
    if (token.value === String(val)) {
      removeQualifierByPos(tokens, index);
    }

    return;
  }

  if (isQualifier(token)) {
    if (isQualifierMulti(token)) {
      const target = token.val.findIndex(v => v.value === String(val));
      if (target >= 0) {
        token.val.splice(target, 1);
      }

      return;
    }

    if (token.val.value === String(val)) {
      removeQualifierByPos(tokens, index);
    }
  }
};
