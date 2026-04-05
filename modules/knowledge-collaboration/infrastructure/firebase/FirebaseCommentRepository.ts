/**
 * Module: knowledge-collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationComments/{commentId}
 */

import {
  collection, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { Comment } from "../../domain/entities/comment.entity";
import type {
  ICommentRepository,
  CreateCommentInput,
  UpdateCommentInput,
  ResolveCommentInput,
} from "../../domain/repositories/ICommentRepository";

function commentsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "collaborationComments");
}

function commentDoc(db: ReturnType<typeof getFirestore>, accountId: string, id: string) {
  return doc(db, "accounts", accountId, "collaborationComments", id);
}

function toComment(id: string, data: Record<string, unknown>): Comment {
  return {
    id,
    contentId: typeof data.contentId === "string" ? data.contentId : "",
    contentType: data.contentType === "article" ? "article" : "page",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    authorId: typeof data.authorId === "string" ? data.authorId : "",
    body: typeof data.body === "string" ? data.body : "",
    parentCommentId: typeof data.parentCommentId === "string" ? data.parentCommentId : null,
    resolvedAt: typeof data.resolvedAt === "string" ? data.resolvedAt : null,
    resolvedByUserId: typeof data.resolvedByUserId === "string" ? data.resolvedByUserId : null,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseCommentRepository implements ICommentRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async create(input: CreateCommentInput): Promise<Comment> {
    const db = this.db();
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      contentId: input.contentId,
      contentType: input.contentType,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      authorId: input.authorId,
      body: input.body,
      parentCommentId: input.parentCommentId ?? null,
      resolvedAt: null,
      resolvedByUserId: null,
      createdAtISO: now,
      updatedAtISO: now,
      _createdAt: serverTimestamp(),
    };
    await setDoc(commentDoc(db, input.accountId, id), data);
    return toComment(id, data);
  }

  async update(input: UpdateCommentInput): Promise<Comment | null> {
    const db = this.db();
    const ref = commentDoc(db, input.accountId, input.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const now = new Date().toISOString();
    await updateDoc(ref, { body: input.body, updatedAtISO: now });
    return toComment(snap.id, { ...snap.data(), body: input.body, updatedAtISO: now });
  }

  async resolve(input: ResolveCommentInput): Promise<Comment | null> {
    const db = this.db();
    const ref = commentDoc(db, input.accountId, input.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const now = new Date().toISOString();
    await updateDoc(ref, { resolvedAt: now, resolvedByUserId: input.resolvedByUserId, updatedAtISO: now });
    return toComment(snap.id, { ...snap.data(), resolvedAt: now, resolvedByUserId: input.resolvedByUserId, updatedAtISO: now });
  }

  async delete(accountId: string, commentId: string): Promise<void> {
    const db = this.db();
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(commentDoc(db, accountId, commentId));
  }

  async findById(accountId: string, commentId: string): Promise<Comment | null> {
    const db = this.db();
    const snap = await getDoc(commentDoc(db, accountId, commentId));
    if (!snap.exists()) return null;
    return toComment(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByContent(accountId: string, contentId: string): Promise<Comment[]> {
    const db = this.db();
    const q = query(commentsCol(db, accountId), where("contentId", "==", contentId), orderBy("createdAtISO", "asc"));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => toComment(d.id, d.data() as Record<string, unknown>));
  }
}
