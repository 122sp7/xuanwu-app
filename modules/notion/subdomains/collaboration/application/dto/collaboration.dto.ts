/**
 * Application-layer DTO re-exports for the collaboration subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { CommentSnapshot } from "../../domain/aggregates/Comment";
export type { CommentUnsubscribe } from "../../domain/repositories/CommentRepository";
export type { VersionSnapshot } from "../../domain/aggregates/Version";
export type { PermissionSnapshot } from "../../domain/aggregates/Permission";
