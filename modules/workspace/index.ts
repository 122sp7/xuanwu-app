/**
 * workspace module root entry.
 *
 * Keep this file as a thin aggregate export only.
 * Cross-module consumers should prefer `@/modules/workspace/api` directly.
 * This file is not where Aggregates, Entities, Value Objects, Repositories,
 * Factories, Domain Services, or Domain Events are implemented.
 * It only re-exports the workspace public surface from `api/`.
 */

export * from "./api";
