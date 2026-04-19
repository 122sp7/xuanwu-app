/**
 * @module infra/query
 * Server-state management via TanStack Query v5.
 *
 * QueryClient / QueryClientProvider — set up once at app root.
 * useQuery / useMutation / useInfiniteQuery — use in interface layer only
 *   (consuming components need "use client").
 * queryOptions / infiniteQueryOptions — v5 type-safe factory pattern
 *   (recommended over inline options objects).
 *
 * Alias: @infra/query
 */

// ─── Client & Provider ────────────────────────────────────────────────────────

export { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

export { QueryClientProvider } from "@tanstack/react-query";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";

// ─── Query Factory Helpers (v5 recommended pattern) ───────────────────────────

export { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
  QueryKey,
  QueryFunction,
  MutationFunction,
  DefaultError,
  InfiniteData,
  QueryObserverResult,
  MutationObserverResult,
} from "@tanstack/react-query";
