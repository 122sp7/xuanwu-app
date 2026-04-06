/**
 * knowledge-collaboration public API boundary
 *
 * Other modules MUST import knowledge-collaboration resources from this file only.
 */

// ── Domain types ───────────────────────────────────────────────────────────────
export type { Comment } from "../domain/entities/comment.entity";
export type { SelectionRange } from "../domain/entities/comment.entity";
export type { Permission, PermissionLevel, PrincipalType } from "../domain/entities/permission.entity";
export type { Version } from "../domain/entities/version.entity";

export type CommentId = string;
export type PermissionId = string;
export type VersionId = string;

// ── DTOs ───────────────────────────────────────────────────────────────────────
export type {
  CreateCommentDto,
  UpdateCommentDto,
  ResolveCommentDto,
  DeleteCommentDto,
  CreateVersionDto,
  DeleteVersionDto,
  GrantPermissionDto,
  RevokePermissionDto,
} from "../application/dto/knowledge-collaboration.dto";

// ── Server Actions (mutations) ─────────────────────────────────────────────────
export {
  createComment,
  updateComment,
  resolveComment,
  deleteComment,
  createVersion,
  deleteVersion,
  grantPermission,
  revokePermission,
} from "../interfaces/_actions/knowledge-collaboration.actions";

// ── Queries (reads) ────────────────────────────────────────────────────────────
export {
  getComments,
  getVersions,
  getPermissions,
} from "../interfaces/queries/knowledge-collaboration.queries";

// ── UI Components ─────────────────────────────────────────────────────────────
export { CommentPanel } from "../interfaces/components/CommentPanel";
export { VersionHistoryPanel } from "../interfaces/components/VersionHistoryPanel";
