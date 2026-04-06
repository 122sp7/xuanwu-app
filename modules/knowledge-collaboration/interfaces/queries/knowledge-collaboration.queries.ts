/**
 * Module: knowledge-collaboration
 * Layer: interfaces/queries
 */

import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";

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

/**
 * Subscribe to real-time comment updates for a content document.
 * Returns an unsubscribe function — call it in a useEffect cleanup.
 */
export function subscribeComments(
  accountId: string,
  contentId: string,
  onUpdate: (comments: Comment[]) => void,
): () => void {
  const db = getFirestore(firebaseClientApp);
  const col = collection(db, "accounts", accountId, "collaborationComments");
  const q = query(
    col,
    where("contentId", "==", contentId),
    orderBy("createdAtISO", "asc"),
  );
  return onSnapshot(q, (snap) => {
    const comments: Comment[] = snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        accountId: typeof data.accountId === "string" ? data.accountId : accountId,
        workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
        contentId: typeof data.contentId === "string" ? data.contentId : contentId,
        contentType: (data.contentType as Comment["contentType"]) ?? "page",
        authorId: typeof data.authorId === "string" ? data.authorId : "",
        body: typeof data.body === "string" ? data.body : "",
        parentCommentId:
          typeof data.parentCommentId === "string" ? data.parentCommentId : null,
        blockId:
          typeof data.blockId === "string" ? data.blockId : null,
        selectionRange: null,
        resolvedAt:
          typeof data.resolvedAt === "string" ? data.resolvedAt : null,
        resolvedByUserId:
          typeof data.resolvedByUserId === "string" ? data.resolvedByUserId : null,
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : new Date().toISOString(),
        updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : new Date().toISOString(),
      };
    });
    onUpdate(comments);
  });
}

