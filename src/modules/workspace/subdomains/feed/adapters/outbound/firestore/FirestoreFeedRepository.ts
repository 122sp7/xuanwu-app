import type { FeedPostRepository } from "../../../domain/repositories/FeedPostRepository";
import type { FeedPostSnapshot } from "../../../domain/entities/FeedPost";

export interface FirestoreLike {
  get(collection: string, id: string): Promise<Record<string, unknown> | null>;
  set(collection: string, id: string, data: Record<string, unknown>): Promise<void>;
  query(collection: string, filters: Array<{ field: string; op: string; value: unknown }>): Promise<Record<string, unknown>[]>;
  increment(collection: string, id: string, field: string, delta: number): Promise<void>;
}

export class FirestoreFeedRepository implements FeedPostRepository {
  private readonly collection = "feed_posts";

  constructor(private readonly db: FirestoreLike) {}

  async findById(accountId: string, postId: string): Promise<FeedPostSnapshot | null> {
    const doc = await this.db.get(this.collection, postId);
    return doc ? this.toSnapshot(doc) : null;
  }

  async listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "accountId", op: "==", value: accountId },
      { field: "workspaceId", op: "==", value: workspaceId },
    ]);
    return docs.slice(0, limit).map((d) => this.toSnapshot(d));
  }

  async listByWorkspaceIdAndDate(
    accountId: string,
    workspaceId: string,
    dateKey: string,
    limit: number,
  ): Promise<FeedPostSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "accountId", op: "==", value: accountId },
      { field: "workspaceId", op: "==", value: workspaceId },
      { field: "dateKey", op: "==", value: dateKey },
    ]);
    return docs.slice(0, limit).map((d) => this.toSnapshot(d));
  }

  async listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "accountId", op: "==", value: accountId }]);
    return docs.slice(0, limit).map((d) => this.toSnapshot(d));
  }

  async save(post: FeedPostSnapshot): Promise<void> {
    await this.db.set(this.collection, post.id, post as unknown as Record<string, unknown>);
  }

  async incrementCounter(
    accountId: string,
    postId: string,
    field: "likeCount" | "replyCount" | "repostCount" | "viewCount" | "bookmarkCount" | "shareCount",
    delta: number,
  ): Promise<void> {
    await this.db.increment(this.collection, postId, field, delta);
  }

  private toSnapshot(doc: Record<string, unknown>): FeedPostSnapshot {
    const raw = doc as Record<string, unknown>;
    return {
      id: raw["id"] as string,
      accountId: raw["accountId"] as string,
      workspaceId: raw["workspaceId"] as string,
      authorAccountId: raw["authorAccountId"] as string,
      type: raw["type"] as FeedPostSnapshot["type"],
      content: raw["content"] as string,
      dateKey: (raw["dateKey"] as string | undefined) ?? ((raw["createdAtISO"] as string | undefined)?.slice(0, 10) ?? ""),
      photoUrls: Array.isArray(raw["photoUrls"]) ? (raw["photoUrls"] as string[]) : [],
      replyToPostId: (raw["replyToPostId"] as string | null) ?? null,
      repostOfPostId: (raw["repostOfPostId"] as string | null) ?? null,
      likeCount: (raw["likeCount"] as number | undefined) ?? 0,
      replyCount: (raw["replyCount"] as number | undefined) ?? 0,
      repostCount: (raw["repostCount"] as number | undefined) ?? 0,
      viewCount: (raw["viewCount"] as number | undefined) ?? 0,
      bookmarkCount: (raw["bookmarkCount"] as number | undefined) ?? 0,
      shareCount: (raw["shareCount"] as number | undefined) ?? 0,
      createdAtISO: raw["createdAtISO"] as string,
      updatedAtISO: raw["updatedAtISO"] as string,
    };
  }
}
