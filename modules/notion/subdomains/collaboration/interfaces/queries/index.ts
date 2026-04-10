/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/queries
 * Purpose: Read-side queries for comment, version, and permission data.
 */

import { makeCommentRepo, makePermissionRepo, makeVersionRepo } from "../../api/factories";
import type { CommentSnapshot } from "../../domain/aggregates/Comment";
import type { CommentUnsubscribe } from "../../domain/repositories/ICommentRepository";
import type { VersionSnapshot } from "../../domain/aggregates/Version";
import type { PermissionSnapshot } from "../../domain/aggregates/Permission";

export async function getComments(accountId: string, contentId: string): Promise<CommentSnapshot[]> {
  return makeCommentRepo().listByContent(accountId, contentId);
}

export async function getVersions(accountId: string, contentId: string): Promise<VersionSnapshot[]> {
  return makeVersionRepo().listByContent(accountId, contentId);
}

export async function getPermissions(accountId: string, subjectId: string): Promise<PermissionSnapshot[]> {
  return makePermissionRepo().listBySubject(accountId, subjectId);
}

export function subscribeComments(
  accountId: string,
  contentId: string,
  onUpdate: (comments: CommentSnapshot[]) => void,
): CommentUnsubscribe {
  return makeCommentRepo().subscribe(accountId, contentId, onUpdate);
}
