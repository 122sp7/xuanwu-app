import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";

import type {
  CreateWorkspaceFeedPostInput,
  CreateWorkspaceFeedReplyInput,
  CreateWorkspaceFeedRepostInput,
  WorkspaceFeedCounterPatch,
  WorkspaceFeedPost,
} from "../../domain/entities/workspace-feed-post.entity";
import type { WorkspaceFeedPostRepository } from "../../domain/repositories/workspace-feed.repositories";

type FirestoreDb = ReturnType<typeof getFirestore>;

function postsCol(db: FirestoreDb, accountId: string) {
  return collection(db, "accounts", accountId, "workspaceFeedPosts");
}

function postDoc(db: FirestoreDb, accountId: string, postId: string) {
  return doc(db, "accounts", accountId, "workspaceFeedPosts", postId);
}

function repostMapDoc(db: FirestoreDb, accountId: string, actorAccountId: string, sourcePostId: string) {
  return doc(db, "accounts", accountId, "workspaceFeedReposts", `${actorAccountId}__${sourcePostId}`);
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

function toWorkspaceFeedPost(id: string, data: Record<string, unknown>): WorkspaceFeedPost {
  const type = asString(data.type, "post");
  return {
    id,
    accountId: asString(data.accountId),
    workspaceId: asString(data.workspaceId),
    authorAccountId: asString(data.authorAccountId),
    type: type === "reply" || type === "repost" ? type : "post",
    content: asString(data.content),
    replyToPostId: typeof data.replyToPostId === "string" ? data.replyToPostId : null,
    repostOfPostId: typeof data.repostOfPostId === "string" ? data.repostOfPostId : null,
    likeCount: asNumber(data.likeCount),
    replyCount: asNumber(data.replyCount),
    repostCount: asNumber(data.repostCount),
    viewCount: asNumber(data.viewCount),
    bookmarkCount: asNumber(data.bookmarkCount),
    shareCount: asNumber(data.shareCount),
    createdAtISO: asString(data.createdAtISO),
    updatedAtISO: asString(data.updatedAtISO),
  };
}

function createBasePostData(
  accountId: string,
  workspaceId: string,
  authorAccountId: string,
  content: string,
  type: "post" | "reply" | "repost",
): Record<string, unknown> {
  const nowISO = new Date().toISOString();
  return {
    accountId,
    workspaceId,
    authorAccountId,
    type,
    content,
    likeCount: 0,
    replyCount: 0,
    repostCount: 0,
    viewCount: 0,
    bookmarkCount: 0,
    shareCount: 0,
    createdAtISO: nowISO,
    updatedAtISO: nowISO,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export class FirebaseWorkspaceFeedPostRepository implements WorkspaceFeedPostRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async createPost(input: CreateWorkspaceFeedPostInput): Promise<WorkspaceFeedPost> {
    const id = generateId();
    const data = createBasePostData(
      input.accountId,
      input.workspaceId,
      input.authorAccountId,
      input.content,
      "post",
    );
    await setDoc(postDoc(this.db, input.accountId, id), data);
    return toWorkspaceFeedPost(id, data);
  }

  async createReply(input: CreateWorkspaceFeedReplyInput): Promise<WorkspaceFeedPost> {
    const id = generateId();
    const data: Record<string, unknown> = {
      ...createBasePostData(
        input.accountId,
        input.workspaceId,
        input.authorAccountId,
        input.content,
        "reply",
      ),
      replyToPostId: input.parentPostId,
      repostOfPostId: null,
    };

    await setDoc(postDoc(this.db, input.accountId, id), data);
    await this.patchCounters(input.accountId, input.parentPostId, { replyDelta: 1 });
    return toWorkspaceFeedPost(id, data);
  }

  async createRepost(input: CreateWorkspaceFeedRepostInput): Promise<WorkspaceFeedPost | null> {
    const mapRef = repostMapDoc(this.db, input.accountId, input.actorAccountId, input.sourcePostId);
    const existingMap = await getDoc(mapRef);
    if (existingMap.exists()) {
      const repostPostId = asString(existingMap.data().repostPostId);
      if (!repostPostId) return null;
      return this.findById(input.accountId, repostPostId);
    }

    const source = await this.findById(input.accountId, input.sourcePostId);
    if (!source) return null;

    const id = generateId();
    const content = input.comment?.trim() || source.content;
    const data: Record<string, unknown> = {
      ...createBasePostData(
        input.accountId,
        input.workspaceId,
        input.actorAccountId,
        content,
        "repost",
      ),
      replyToPostId: null,
      repostOfPostId: input.sourcePostId,
    };

    await setDoc(postDoc(this.db, input.accountId, id), data);
    await setDoc(mapRef, {
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      sourcePostId: input.sourcePostId,
      actorAccountId: input.actorAccountId,
      repostPostId: id,
      createdAtISO: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
    await this.patchCounters(input.accountId, input.sourcePostId, { repostDelta: 1 });
    return toWorkspaceFeedPost(id, data);
  }

  async patchCounters(accountId: string, postId: string, patch: WorkspaceFeedCounterPatch): Promise<void> {
    const updates: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };
    if (patch.likeDelta) updates.likeCount = increment(patch.likeDelta);
    if (patch.replyDelta) updates.replyCount = increment(patch.replyDelta);
    if (patch.repostDelta) updates.repostCount = increment(patch.repostDelta);
    if (patch.viewDelta) updates.viewCount = increment(patch.viewDelta);
    if (patch.bookmarkDelta) updates.bookmarkCount = increment(patch.bookmarkDelta);
    if (patch.shareDelta) updates.shareCount = increment(patch.shareDelta);
    await updateDoc(postDoc(this.db, accountId, postId), updates);
  }

  async findById(accountId: string, postId: string): Promise<WorkspaceFeedPost | null> {
    const snap = await getDoc(postDoc(this.db, accountId, postId));
    if (!snap.exists()) return null;
    return toWorkspaceFeedPost(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByWorkspaceId(accountId: string, workspaceId: string, maxRows: number): Promise<WorkspaceFeedPost[]> {
    const snaps = await getDocs(
      query(
        postsCol(this.db, accountId),
        where("workspaceId", "==", workspaceId),
        orderBy("createdAtISO", "desc"),
        limit(maxRows),
      ),
    );
    return snaps.docs.map((row) => toWorkspaceFeedPost(row.id, row.data() as Record<string, unknown>));
  }

  async listByAccountId(accountId: string, maxRows: number): Promise<WorkspaceFeedPost[]> {
    const snaps = await getDocs(
      query(postsCol(this.db, accountId), orderBy("createdAtISO", "desc"), limit(maxRows)),
    );
    return snaps.docs.map((row) => toWorkspaceFeedPost(row.id, row.data() as Record<string, unknown>));
  }
}
