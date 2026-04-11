/**
 * Membership Subdomain — Domain Layer
 *
 * Owns the workspace member view model and participation concepts.
 * The WorkspaceMemberView is the canonical read model for workspace participants.
 *
 * Per ubiquitous language: "Membership" represents workspace participation,
 * not "User" which belongs to platform identity.
 */

// Re-export membership-relevant domain types from root domain
export type {
  WorkspaceMemberView,
  WorkspaceMemberPresence,
  WorkspaceMemberAccessSource,
  WorkspaceMemberAccessChannel,
} from "../../../domain/entities/WorkspaceMemberView";
