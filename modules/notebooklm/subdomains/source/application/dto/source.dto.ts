/**
 * Application-layer DTO re-exports for the source subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export { resolveSourceOrganizationId } from "../../domain/services/resolve-source-organization-id.service";
export type { RagDocumentRecord } from "../../domain/entities/RagDocument";
