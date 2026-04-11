/**
 * Sharing Subdomain — Domain Layer
 *
 * Owns workspace access grants and sharing scope.
 *
 * Per ubiquitous language: "ShareScope" represents the sharing boundary,
 * not generic "Permission" which belongs to platform access control.
 */

// Re-export sharing-relevant domain types from root domain
export type {
  WorkspaceGrant,
  WorkspaceAccessPolicy,
} from "../../../domain/entities/WorkspaceAccess";
