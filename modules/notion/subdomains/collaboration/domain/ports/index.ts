/**
 * notion/collaboration domain/ports — driven port interfaces for the collaboration subdomain.
 *
 * Re-exports repository contracts from domain/repositories/, making the Ports layer
 * explicitly visible in the directory structure.
 */
export type { ICommentRepository as ICommentPort } from "../repositories/ICommentRepository";
export type { IPermissionRepository as IPermissionPort } from "../repositories/IPermissionRepository";
export type { IVersionRepository as IVersionPort } from "../repositories/IVersionRepository";
