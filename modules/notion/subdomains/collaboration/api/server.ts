/**
 * collaboration subdomain — server-only API.
 *
 * Exports infrastructure implementations and composition helpers that must only
 * run in Server Actions, route handlers, or other server-side entry points.
 */

export { FirebaseCommentRepository } from "../../../infrastructure/collaboration/firebase/FirebaseCommentRepository";
export { FirebasePermissionRepository } from "../../../infrastructure/collaboration/firebase/FirebasePermissionRepository";
export { FirebaseVersionRepository } from "../../../infrastructure/collaboration/firebase/FirebaseVersionRepository";
export { makeCommentRepo, makeVersionRepo, makePermissionRepo } from "../../../interfaces/collaboration/composition/repositories";
export type { CollaborationUseCases } from "../../../interfaces/collaboration/composition/use-cases";
export { makeCollaborationUseCases } from "../../../interfaces/collaboration/composition/use-cases";
