/**
 * ResourceDescriptor — Shared Type
 *
 * A uniform descriptor for any resource that a permission rule or audit signal
 * refers to. Allows the permission system to be resource-type agnostic.
 *
 * Fields:
 *   resourceType — e.g., "workspace", "knowledge-base", "integration-contract"
 *   resourceId   — stable identifier of the resource
 *   contextId    — owning platform context
 *
 * @see domain/services/PermissionResolutionService.ts
 * @see domain/value-objects/PermissionDecision.ts
 * @see docs/ubiquitous-language.md — 資源描述符
 */

// TODO: implement ResourceDescriptor type interface
