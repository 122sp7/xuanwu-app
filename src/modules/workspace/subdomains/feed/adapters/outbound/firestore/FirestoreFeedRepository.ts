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
    return doc ? (doc as unknown as FeedPostSnapshot) : null;
  }

  async listByWorkspaceId(accountId: string, workspaceId: string, limit: number): Promise<FeedPostSnapshot[]> {
    const docs = await this.db.query(this.collection, [
      { field: "accountId", op: "==", value: accountId },
      { field: "workspaceId", op: "==", value: workspaceId },
    ]);
    return (docs as unknown as FeedPostSnapshot[]).slice(0, limit);
  }

  async listByAccountId(accountId: string, limit: number): Promise<FeedPostSnapshot[]> {
    const docs = await this.db.query(this.collection, [{ field: "accountId", op: "==", value: accountId }]);
    return (docs as unknown as FeedPostSnapshot[]).slice(0, limit);
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
}
