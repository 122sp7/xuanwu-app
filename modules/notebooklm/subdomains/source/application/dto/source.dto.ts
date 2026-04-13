/**
 * Application-layer DTO re-exports for the source subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */

/**
 * resolveSourceOrganizationId — maps an account to its organization scope.
 *
 * Delegates to the domain service. Personal accounts get a synthetic org ID
 * prefixed with "personal:" so they can participate in the same org-scoped
 * permission checks as org accounts.
 */
export { resolveSourceOrganizationId } from "../../domain/services/resolve-source-organization-id.service";

export type { RagDocumentRecord } from "../../domain/entities/RagDocument";

// ── Wiki library entity types (used by composition facades) ──────────────
export type {
  WikiLibrary,
  WikiLibraryField,
  WikiLibraryRow,
  CreateWikiLibraryInput,
  AddWikiLibraryFieldInput,
  CreateWikiLibraryRowInput,
} from "../../domain/entities/WikiLibrary";
