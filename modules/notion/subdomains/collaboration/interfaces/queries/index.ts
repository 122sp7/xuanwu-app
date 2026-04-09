/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/queries
 * Purpose: Read-side queries for comment, version, and permission data.
 */

import { FirebaseCommentRepository } from "../../infrastructure/firebase/FirebaseCommentRepository";
import { FirebaseVersionRepository } from "../../infrastructure/firebase/FirebaseVersionRepository";
import { FirebasePermissionRepository } from "../../infrastructure/firebase/FirebasePermissionRepository";
import type { CommentSnapshot } from "../../domain/aggregates/Comment";
import type { CommentUnsubscribe } from "../../domain/repositories/ICommentRepository";
import type { VersionSnapshot } from "../../domain/aggregates/Version";
import type { PermissionSnapshot } from "../../domain/aggregates/Permission";

export async function getComments(accountId: string, contentId: string): Promise<CommentSnapshot[]> {
  return new FirebaseCommentRepository().listByContent(accountId, contentId);
}

export async function getVersions(accountId: string, contentId: string): Promise<VersionSnapshot[]> {
  return new FirebaseVersionRepository().listByContent(accountId, contentId);
}

export async function getPermissions(accountId: string, subjectId: string): Promise<PermissionSnapshot[]> {
  return new FirebasePermissionRepository().listBySubject(accountId, subjectId);
}

export function subscribeComments(
  accountId: string,
  contentId: string,
  onUpdate: (comments: CommentSnapshot[]) => void,
): CommentUnsubscribe {
  return new FirebaseCommentRepository().subscribe(accountId, contentId, onUpdate);
}
