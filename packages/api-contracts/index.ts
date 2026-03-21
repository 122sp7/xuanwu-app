/**
 * @package api-contracts
 * Global API surface definitions: REST route constants and GraphQL type definitions.
 *
 * These contracts are the canonical source of truth for all API consumers.
 * Infrastructure adapters (tRPC, REST handlers, GraphQL resolvers) must derive
 * their route strings and schema from this package — never the reverse.
 *
 * Usage:
 *   import { API_ROUTES, typeDefs } from "@api-contracts"
 */

// ── REST Route Constants ───────────────────────────────────────────────────────

export const API_ROUTES = {
  tasks: {
    list: '/api/tasks',
    detail: (id: string) => `/api/tasks/${id}`,
  },
} as const

// ── GraphQL Type Definitions ───────────────────────────────────────────────────

export const typeDefs = `
  type Query {
    hello: String
  }
`
