import { describe, expect, it } from "vitest";
import {
  ListAccountFeedPostsUseCase,
} from "./FeedUseCases";
import type { FeedPostSnapshot } from "../../domain/entities/FeedPost";
import type { FeedPostRepository } from "../../domain/repositories/FeedPostRepository";

class InMemoryFeedPostRepository implements FeedPostRepository {
  constructor(private readonly posts: FeedPostSnapshot[]) {}

  async findById(_accountId: string, postId: string): Promise<FeedPostSnapshot | null> {
    return this.posts.find((post) => post.id === postId) ?? null;
  }

  async listByWorkspaceId(_accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]> {
    return this.posts.filter((post) => post.workspaceId === workspaceId).slice(0, limit);
  }

  async listByWorkspaceIdAndDate(
    _accountId: string,
    workspaceId: string,
    dateKey: string,
    limit: number,
  ): Promise<FeedPostSnapshot[]> {
    return this.posts.filter((post) => post.workspaceId === workspaceId && post.dateKey === dateKey).slice(0, limit);
  }

  async listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]> {
    return this.posts.filter((post) => post.accountId === accountId).slice(0, limit);
  }

  async save(post: FeedPostSnapshot): Promise<void> {
    this.posts.push(post);
  }

  async incrementCounter(
    _accountId: string,
    _postId: string,
    _field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount",
    _delta: number,
  ): Promise<void> {
    return;
  }
}

function buildPost(input: Partial<FeedPostSnapshot>): FeedPostSnapshot {
  return {
    id: input.id ?? "post-1",
    accountId: input.accountId ?? "org-1",
    workspaceId: input.workspaceId ?? "ws-1",
    authorAccountId: input.authorAccountId ?? "user-1",
    type: "post",
    content: input.content ?? "content",
    dateKey: input.dateKey ?? "2026-04-20",
    photoUrls: [],
    replyToPostId: null,
    repostOfPostId: null,
    likeCount: 0,
    replyCount: 0,
    repostCount: 0,
    viewCount: 0,
    bookmarkCount: 0,
    shareCount: 0,
    createdAtISO: input.createdAtISO ?? "2026-04-20T01:00:00.000Z",
    updatedAtISO: input.updatedAtISO ?? "2026-04-20T01:00:00.000Z",
  };
}

describe("ListAccountFeedPostsUseCase", () => {
  it("aggregates posts across workspaces for same account and filters by dateKey", async () => {
    const repo = new InMemoryFeedPostRepository([
      buildPost({ id: "p-1", workspaceId: "ws-a", dateKey: "2026-04-20" }),
      buildPost({ id: "p-2", workspaceId: "ws-b", dateKey: "2026-04-20" }),
      buildPost({ id: "p-3", workspaceId: "ws-b", dateKey: "2026-04-19" }),
      buildPost({ id: "p-4", accountId: "org-2", workspaceId: "ws-c", dateKey: "2026-04-20" }),
    ]);
    const useCase = new ListAccountFeedPostsUseCase(repo);

    const result = await useCase.execute({
      accountId: "org-1",
      dateKey: "2026-04-20",
      limit: 100,
    });

    expect(result.map((post) => post.id)).toEqual(["p-1", "p-2"]);
  });
});
