/**
 * PlatformQueryPort — Input Port Interface
 *
 * The driving port for all query-oriented interactions with the platform module.
 * Implemented by: application/handlers/index.ts (query dispatch router)
 * Called by:      adapters/web/, api/facade.ts
 *
 * Contract:
 *   executeQuery<TResult, TQuery extends PlatformQuery>(query: TQuery): Promise<TResult>
 *
 * Invariants:
 *   - Query handlers never mutate state
 *   - Return types are read-model DTOs from application/dtos/
 *   - The port has no knowledge of HTTP status codes or pagination strategies
 *
 * @see ports/input/index.ts — re-exports this interface
 * @see application/handlers/ — implementations
 * @see docs/bounded-context.md — port contract rules
 */

// TODO: implement / re-export PlatformQueryPort interface
