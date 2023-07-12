import { AsyncLocalStorage } from 'node:async_hooks';

import type { Controllers } from '~/domains/controllers.js';

export type ReqCtx = {
  controllers: Controllers;
  user?: unknown;
};

export const reqCtxAls = new AsyncLocalStorage<ReqCtx>();

export const useControllers$ = () => {
  return reqCtxAls.getStore()!.controllers;
};

export const useReqUser$ = () => {
  return reqCtxAls.getStore()!.user;
};
