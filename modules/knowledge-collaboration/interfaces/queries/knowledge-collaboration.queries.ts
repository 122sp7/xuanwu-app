/**
 * Module: knowledge-collaboration
 * Layer: interfaces/queries
 */

import type { Comment } from "../../domain/entities/comment.entity";
import type { Version } from "../../domain/entities/version.entity";
import type { Permission } from "../../domain/entities/permission.entity";
import { ListCommentsUseCase } from "../../application/use-cases/comment.use-cases";
import { ListVersionsUseCase } from "../../application/use-cases/version.use-cases";
import { ListPermissionsBySubjectUseCase } from "../../application/use-cases/permission.use-cases";
import { FirebaseCommentRepository } from "../../infrastructure/firebase/FirebaseCommentRepository";
import { FirebaseVersionRepository } from "../../infrastructure/firebase/FirebaseVersionRepository";
import { FirebasePermissionRepository } from "../../infrastructure/firebase/FirebasePermissionRepository";

export async function getComments(accountId: string, contentId: string): Promise<Comment[]> {
  return new ListCommentsUseCase(new FirebaseCommentRepository()).execute(accountId, contentId);
}

export async function getVersions(accountId: string, contentId: string): Promise<Version[]> {
  return new ListVersionsUseCase(new FirebaseVersionRepository()).execute(accountId, contentId);
}

export async function getPermissions(accountId: string, subjectId: string): Promise<Permission[]> {
  return new ListPermissionsBySubjectUseCase(new FirebasePermissionRepository()).execute(accountId, subjectId);
}
