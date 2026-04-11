/**
 * Sharing Subdomain — Public API Boundary
 *
 * Cross-subdomain and cross-module consumers import through this entry point.
 */

// --- Application service ---
export {
  WorkspaceSharingApplicationService,
} from "../application";
export type { SharingServiceDependencies } from "../application";

// --- Domain types (published language for sharing) ---
export type {
  WorkspaceGrant,
  WorkspaceAccessPolicy,
} from "../domain";
