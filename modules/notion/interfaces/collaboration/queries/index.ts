/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/queries
 * Purpose: Read-side queries for comment, version, and permission data.
 */

import { makeCommentRepo, makePermissionRepo, makeVersionRepo } from "../../../subdomains/collaboration/api/factories";
import type { CommentSnapshot, CommentUnsubscribe, VersionSnapshot, PermissionSnapshot } from "../../../subdomains/collaboration/application/dto/collaboration.dto";

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
