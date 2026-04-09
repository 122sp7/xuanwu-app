/**
 * Module: notion/subdomains/collaboration
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 * Status: Migration-Pending — awaiting full migration from modules/knowledge-collaboration/
 *
 * Note: collaboration uses an opaque contentId reference pattern — it does NOT
 * expose types that couple consumers to knowledge/authoring/database internals.
 */

// TODO: export Comment, Permission, Version snapshot types
// TODO: export GrantPermissionDto, RevokePermissionDto
// TODO: export server actions (createComment, resolveComment, grantPermission, ...)
// TODO: export queries (getCommentsForContent, getPermissionsForContent, getVersionHistory)
// TODO: export UI components (CommentThreadView, PermissionPanelView, VersionHistoryView)

export {};
