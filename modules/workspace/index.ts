/**
 * workspace module root entry.
 *
 * Keep this file as a thin aggregate export only.
 * Cross-module consumers should prefer `@/modules/workspace/api` directly.
 * It represents the outer module boundary of one bounded context within the
 * Xuanwu domain's generic-subdomain landscape, not the inner hexagonal layers.
 * It is also not an event endpoint, process manager, or repository facade.
 * It is not where Ports, Adapters, Drivers, or Read Models are implemented.
 * This file is not where Aggregates, Entities, Value Objects, Repositories,
 * Factories, Domain Services, or Domain Events are implemented.
 * It only re-exports the workspace public surface from `api/`.
 */

export * from "./api";
