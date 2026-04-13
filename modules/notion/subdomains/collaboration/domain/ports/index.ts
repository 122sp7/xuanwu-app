/**
 * notion/collaboration domain/ports — driven port interfaces for the collaboration subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { CommentRepository as ICommentPort } from "../repositories/CommentRepository";
export type { PermissionRepository as IPermissionPort } from "../repositories/PermissionRepository";
export type { VersionRepository as IVersionPort } from "../repositories/VersionRepository";
