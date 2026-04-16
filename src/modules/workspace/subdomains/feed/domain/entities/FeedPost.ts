import { v4 as uuid } from "uuid";
import type { FeedDomainEventType } from "../events/FeedDomainEvent";

export type FeedPostType = "post" | "reply" | "repost";

export const FEED_POST_TYPES = ["post", "reply", "repost"] as const satisfies readonly FeedPostType[];

export interface FeedPostSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly authorAccountId: string;
  readonly type: FeedPostType;
  readonly content: string;
  readonly replyToPostId: string | null;
  readonly repostOfPostId: string | null;
  readonly likeCount: number;
  readonly replyCount: number;
  readonly repostCount: number;
  readonly viewCount: number;
  readonly bookmarkCount: number;
  readonly shareCount: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateFeedPostInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly authorAccountId: string;
  readonly content: string;
  readonly replyToPostId?: string;
  readonly repostOfPostId?: string;
}

export class FeedPost {
  private readonly _domainEvents: FeedDomainEventType[] = [];

  private constructor(private _props: FeedPostSnapshot) {}

  static create(id: string, input: CreateFeedPostInput): FeedPost {
    const now = new Date().toISOString();
    const type: FeedPostType = input.replyToPostId ? "reply" : input.repostOfPostId ? "repost" : "post";
    const post = new FeedPost({
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      authorAccountId: input.authorAccountId,
      type,
      content: input.content,
      replyToPostId: input.replyToPostId ?? null,
      repostOfPostId: input.repostOfPostId ?? null,
      likeCount: 0,
      replyCount: 0,
      repostCount: 0,
      viewCount: 0,
      bookmarkCount: 0,
      shareCount: 0,
      createdAtISO: now,
      updatedAtISO: now,
    });
    post._domainEvents.push({
      type: "workspace.feed.post-created",
      eventId: uuid(),
      occurredAt: now,
      payload: { postId: id, workspaceId: input.workspaceId, authorAccountId: input.authorAccountId },
    });
    return post;
  }

  static reconstitute(snapshot: FeedPostSnapshot): FeedPost {
    return new FeedPost({ ...snapshot });
  }

  get id(): string { return this._props.id; }
  get workspaceId(): string { return this._props.workspaceId; }

  getSnapshot(): Readonly<FeedPostSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): FeedDomainEventType[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
