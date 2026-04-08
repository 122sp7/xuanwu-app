/**
 * Module: knowledge-collaboration
 * Layer: interfaces/_actions
 * Purpose: Barrel re-export for all knowledge-collaboration server actions.
 *          Split by aggregate for IDDD single-responsibility:
 *  - comment.actions.ts    (Comment aggregate)
 *  - version.actions.ts    (Version aggregate)
 *  - permission.actions.ts (Permission aggregate)
 */

export { createComment, updateComment, resolveComment, deleteComment } from "./comment.actions";
export { createVersion, deleteVersion } from "./version.actions";
export { grantPermission, revokePermission } from "./permission.actions";
