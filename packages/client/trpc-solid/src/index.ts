export type { CreateTrpcClientOpts, TRPCClientErrorLike } from '@marbemac/client-trpc';
export {
  isTrpcClientError,
  isTrpcNotFound,
  isTrpcUnauthorized,
  getUntypedClient,
  createTRPCClient,
} from '@marbemac/client-trpc';
export { createTRPCSolid, createTRPCProvider } from './solid-client/index.tsx';
export type { CreateTRPCSolid } from './solid-client/index.tsx';
