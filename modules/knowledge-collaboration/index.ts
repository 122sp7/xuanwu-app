/**
 * knowledge-collaboration module — public barrel export
 */

export type { Comment } from "./domain/entities/comment.entity";
export type { Permission, PermissionLevel } from "./domain/entities/permission.entity";
export type { Version } from "./domain/entities/version.entity";

export * from "./api";

// TODO: Server Actions
// export { createComment } from "./interfaces/_actions/comment.actions";
// export { grantPermission } from "./interfaces/_actions/permission.actions";
// export { createVersion } from "./interfaces/_actions/version.actions";

// TODO: Queries
// export { useComments } from "./interfaces/queries/useComments";
// export { usePermission } from "./interfaces/queries/usePermission";
// export { useVersions } from "./interfaces/queries/useVersions";
