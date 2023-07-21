export type { CreateTRPCSolid } from './solid-client/index.tsx';
export { createTRPCProvider, createTRPCSolid } from './solid-client/index.tsx';
export type { CreateTrpcClientOpts, TRPCClientErrorLike } from '@marbemac/client-trpc';
export {
  createTRPCClient,
  getUntypedClient,
  isTrpcClientError,
  isTrpcNotFound,
  isTrpcUnauthorized,
} from '@marbemac/client-trpc';
