import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";

import type {
  CreateWorkspaceFeedPostInput,
  CreateWorkspaceFeedReplyInput,
  CreateWorkspaceFeedRepostInput,
  WorkspaceFeedCounterPatch,
  WorkspaceFeedPost,
} from "../../domain/entities/workspace-feed-post.entity";
import type { WorkspaceFeedPostRepository } from "../../domain/repositories/workspace-feed.repositories";

function postsPath(accountId: string): string {
  return `accounts/${accountId}/workspaceFeedPosts`;
}

function postPath(accountId: string, postId: string): string {
  return `accounts/${accountId}/workspaceFeedPosts/${postId}`;
}

function repostMapPath(accountId: string, actorAccountId: string, sourcePostId: string): string {
  return `accounts/${accountId}/workspaceFeedReposts/${actorAccountId}__${sourcePostId}`;
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
  };
}

export class FirebaseWorkspaceFeedPostRepository implements WorkspaceFeedPostRepository {
  async createPost(input: CreateWorkspaceFeedPostInput): Promise<WorkspaceFeedPost> {
    const id = generateId();
    const data = createBasePostData(
      input.accountId,
      input.workspaceId,
      input.authorAccountId,
      input.content,
      "post",
    );
    await firestoreInfrastructureApi.set(postPath(input.accountId, id), data);
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

    await firestoreInfrastructureApi.set(postPath(input.accountId, id), data);
    await this.patchCounters(input.accountId, input.parentPostId, { replyDelta: 1 });
    return toWorkspaceFeedPost(id, data);
  }

  async createRepost(input: CreateWorkspaceFeedRepostInput): Promise<WorkspaceFeedPost | null> {
    const mapPath = repostMapPath(input.accountId, input.actorAccountId, input.sourcePostId);
    const existingMap = await firestoreInfrastructureApi.get<Record<string, unknown>>(mapPath);
    if (existingMap) {
      const repostPostId = asString(existingMap.repostPostId);
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

    await firestoreInfrastructureApi.set(postPath(input.accountId, id), data);
    await firestoreInfrastructureApi.set(mapPath, {
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      sourcePostId: input.sourcePostId,
      actorAccountId: input.actorAccountId,
      repostPostId: id,
      createdAtISO: new Date().toISOString(),
    });
    await this.patchCounters(input.accountId, input.sourcePostId, { repostDelta: 1 });
    return toWorkspaceFeedPost(id, data);
  }

  async patchCounters(accountId: string, postId: string, patch: WorkspaceFeedCounterPatch): Promise<void> {
    const path = postPath(accountId, postId);
    const current = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!current) return;

    const updates: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
    };

    const applyDelta = (field: string, delta: number | undefined) => {
      if (!delta) return;
      const base = asNumber(current[field]);
      updates[field] = base + delta;
    };

    applyDelta("likeCount", patch.likeDelta);
    applyDelta("replyCount", patch.replyDelta);
    applyDelta("repostCount", patch.repostDelta);
    applyDelta("viewCount", patch.viewDelta);
    applyDelta("bookmarkCount", patch.bookmarkDelta);
    applyDelta("shareCount", patch.shareDelta);

    await firestoreInfrastructureApi.update(path, updates);
  }

  async findById(accountId: string, postId: string): Promise<WorkspaceFeedPost | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(postPath(accountId, postId));
    if (!data) return null;
    return toWorkspaceFeedPost(postId, data);
  }

  async listByWorkspaceId(accountId: string, workspaceId: string, maxRows: number): Promise<WorkspaceFeedPost[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      postsPath(accountId),
      [{ field: "workspaceId", op: "==", value: workspaceId }],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }], limit: maxRows },
    );
    return docs.map((row) => toWorkspaceFeedPost(row.id, row.data));
  }

  async listByAccountId(accountId: string, maxRows: number): Promise<WorkspaceFeedPost[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      postsPath(accountId),
      [],
      { orderBy: [{ field: "createdAtISO", direction: "desc" }], limit: maxRows },
    );
    return docs.map((row) => toWorkspaceFeedPost(row.id, row.data));
  }
}
