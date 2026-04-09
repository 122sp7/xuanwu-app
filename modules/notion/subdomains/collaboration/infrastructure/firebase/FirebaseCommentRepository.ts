/**
 * Module: notion/subdomains/collaboration
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/collaborationComments/{commentId}
 */

import {
  collection, doc, getDoc, getDocs, getFirestore,
  onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { CommentSnapshot, SelectionRange } from "../../domain/aggregates/Comment";
import type {
  ICommentRepository,
  CommentUnsubscribe,
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

function toComment(id: string, data: Record<string, unknown>): CommentSnapshot {
  return {
    id,
    contentId: typeof data.contentId === "string" ? data.contentId : "",
    contentType: data.contentType === "article" ? "article" : "page",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    authorId: typeof data.authorId === "string" ? data.authorId : "",
    body: typeof data.body === "string" ? data.body : "",
    parentCommentId: typeof data.parentCommentId === "string" ? data.parentCommentId : null,
    blockId: typeof data.blockId === "string" ? data.blockId : null,
    selectionRange: (
      data.selectionRange !== null &&
      typeof data.selectionRange === "object" &&
      typeof (data.selectionRange as Record<string, unknown>).from === "number" &&
      typeof (data.selectionRange as Record<string, unknown>).to === "number"
    )
      ? {
          from: (data.selectionRange as Record<string, unknown>).from as number,
          to: (data.selectionRange as Record<string, unknown>).to as number,
        } as SelectionRange
      : null,
    resolvedAt: typeof data.resolvedAt === "string" ? data.resolvedAt : null,
    resolvedByUserId: typeof data.resolvedByUserId === "string" ? data.resolvedByUserId : null,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseCommentRepository implements ICommentRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async create(input: CreateCommentInput): Promise<CommentSnapshot> {
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
      blockId: input.blockId ?? null,
      selectionRange: input.selectionRange ?? null,
      resolvedAt: null,
      resolvedByUserId: null,
      createdAtISO: now,
      updatedAtISO: now,
      _createdAt: serverTimestamp(),
    };
    await setDoc(commentDoc(db, input.accountId, id), data);
    return toComment(id, data);
  }

  async update(input: UpdateCommentInput): Promise<CommentSnapshot | null> {
    const db = this.db();
    const ref = commentDoc(db, input.accountId, input.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const now = new Date().toISOString();
    await updateDoc(ref, { body: input.body, updatedAtISO: now });
    return toComment(snap.id, { ...snap.data(), body: input.body, updatedAtISO: now });
  }

  async resolve(input: ResolveCommentInput): Promise<CommentSnapshot | null> {
    const db = this.db();
    const ref = commentDoc(db, input.accountId, input.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const now = new Date().toISOString();
    await updateDoc(ref, { resolvedAt: now, resolvedByUserId: input.resolvedByUserId });
    return toComment(snap.id, { ...snap.data(), resolvedAt: now, resolvedByUserId: input.resolvedByUserId });
  }

  async delete(accountId: string, commentId: string): Promise<void> {
    const { deleteDoc } = await import("firebase/firestore");
    await deleteDoc(commentDoc(this.db(), accountId, commentId));
  }

  async findById(accountId: string, commentId: string): Promise<CommentSnapshot | null> {
    const snap = await getDoc(commentDoc(this.db(), accountId, commentId));
    if (!snap.exists()) return null;
    return toComment(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByContent(accountId: string, contentId: string): Promise<CommentSnapshot[]> {
    const db = this.db();
    const q = query(
      commentsCol(db, accountId),
      where("contentId", "==", contentId),
      orderBy("_createdAt", "asc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => toComment(d.id, d.data() as Record<string, unknown>));
  }

  subscribe(accountId: string, contentId: string, onUpdate: (comments: CommentSnapshot[]) => void): CommentUnsubscribe {
    const db = this.db();
    const q = query(
      commentsCol(db, accountId),
      where("contentId", "==", contentId),
      orderBy("_createdAt", "asc"),
    );
    return onSnapshot(q, (snap) => {
      onUpdate(snap.docs.map((d) => toComment(d.id, d.data() as Record<string, unknown>)));
    });
  }
}
