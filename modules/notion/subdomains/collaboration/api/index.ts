/**
 * Module: notion/subdomains/collaboration
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */

// Aggregate snapshot types
export type { CommentSnapshot, SelectionRange, ContentType, CommentId } from "../domain/aggregates/Comment";
export type { CommentUnsubscribe } from "../domain/repositories/ICommentRepository";
export type { VersionSnapshot, VersionId } from "../domain/aggregates/Version";
export type { PermissionSnapshot, PermissionLevel, PrincipalType, PermissionId } from "../domain/aggregates/Permission";

// DTOs
export type {
  CreateCommentDto, UpdateCommentDto, ResolveCommentDto, DeleteCommentDto,
  CreateVersionDto, DeleteVersionDto,
  GrantPermissionDto, RevokePermissionDto,
} from "../application/dto/CollaborationDto";

// Server actions
export { createComment, updateComment, resolveComment, deleteComment } from "../../../interfaces/collaboration/_actions/comment.actions";
export { createVersion, deleteVersion } from "../../../interfaces/collaboration/_actions/version.actions";
export { grantPermission, revokePermission } from "../../../interfaces/collaboration/_actions/permission.actions";

// Queries
export { getComments, getVersions, getPermissions, subscribeComments } from "../../../interfaces/collaboration/queries";

// UI components
export { CommentPanel } from "../../../interfaces/collaboration/components/CommentPanel";
export { VersionHistoryPanel } from "../../../interfaces/collaboration/components/VersionHistoryPanel";
