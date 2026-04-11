/**
 * Membership Subdomain — Public API Boundary
 *
 * Cross-subdomain and cross-module consumers import through this entry point.
 */

// --- Domain types (published language for membership) ---
export type {
  WorkspaceMemberView,
  WorkspaceMemberPresence,
  WorkspaceMemberAccessSource,
  WorkspaceMemberAccessChannel,
} from "../domain";

// --- Application queries ---
export { fetchWorkspaceMembers } from "../application";
