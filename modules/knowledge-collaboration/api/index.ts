/**
 * knowledge-collaboration public API boundary
 */

export type { Comment } from "../domain/entities/comment.entity";
export type { Permission, PermissionLevel } from "../domain/entities/permission.entity";
export type { Version } from "../domain/entities/version.entity";

export type CommentId = string;
export type PermissionId = string;
export type VersionId = string;
