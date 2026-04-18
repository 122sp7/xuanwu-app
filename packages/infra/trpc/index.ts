/**
 * @module infra/trpc
 * Shared tRPC client primitives.
 */

export {
  createTRPCClient,
  createTRPCClient as createTRPCProxyClient,
  httpBatchLink,
  httpLink,
  splitLink,
  TRPCClientError,
} from "@trpc/client";

export { createTRPCReact } from "@trpc/react-query";
export type { AnyRouter } from "@trpc/server";
