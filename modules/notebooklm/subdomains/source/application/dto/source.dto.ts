/**
 * Application-layer DTO re-exports for the source subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */

/**
 * resolveSourceOrganizationId — maps an account to its organization scope.
 *
 * Wraps the domain service to provide a clean application-layer contract.
 * Personal accounts get a synthetic org ID prefixed with "personal:" so they
 * can participate in the same org-scoped permission checks as org accounts.
 */
export function resolveSourceOrganizationId(
  accountType: "user" | "organization",
  accountId: string,
): string {
  return accountType === "organization" ? accountId : `personal:${accountId}`;
}

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
