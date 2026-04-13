/**
 * PlatformContextView — Read Model DTO
 *
 * A read-only projection of a PlatformContext for use in queries.
 * This is not an aggregate snapshot — it is a purposely flattened view
 * optimised for rendering and downstream read consumers.
 *
 * Fields:
 *   contextId       — PlatformContextId (string representation)
 *   lifecycleState  — current PlatformLifecycleState value
 *   capabilityKeys  — list of currently active capability keys
 *   subjectScope    — string representation of subject scope
 *   updatedAt       — ISO 8601 timestamp of last state change
 *
 * Produced by: GetPlatformContextViewHandler
 * Consumed by: api/contracts.ts surface, driving adapters
 *
 * @see application/handlers/GetPlatformContextViewHandler.ts
 * @see ports/output/index.ts — PlatformContextViewRepository
 * @see docs/application-services.md — Query DTOs
 */

// TODO: implement PlatformContextView DTO interface
