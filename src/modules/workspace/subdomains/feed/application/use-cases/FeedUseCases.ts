import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { FeedPostRepository } from "../../domain/repositories/FeedPostRepository";
import { FeedPost } from "../../domain/entities/FeedPost";
import type { CreateFeedPostInput, FeedPostSnapshot } from "../../domain/entities/FeedPost";

export class CreateFeedPostUseCase {
  constructor(private readonly feedRepo: FeedPostRepository) {}

  async execute(input: CreateFeedPostInput): Promise<CommandResult> {
    try {
      const post = FeedPost.create(uuid(), input);
      await this.feedRepo.save(post.getSnapshot());
      return commandSuccess(post.id, Date.now());
    } catch (err) {
      return commandFailureFrom("FEED_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create feed post.");
    }
  }
}

export class ListFeedPostsUseCase {
  constructor(private readonly feedRepo: FeedPostRepository) {}

  async execute(input: {
    accountId: string;
    workspaceId: string;
    dateKey?: string;
    limit?: number;
  }): Promise<FeedPostSnapshot[]> {
    const limit = input.limit ?? 50;
    if (input.dateKey) {
      return this.feedRepo.listByWorkspaceIdAndDate(input.accountId, input.workspaceId, input.dateKey, limit);
    }
    return this.feedRepo.listByWorkspaceId(input.accountId, input.workspaceId, limit);
  }
}

export class ListAccountFeedPostsUseCase {
  constructor(private readonly feedRepo: FeedPostRepository) {}

  async execute(input: {
    accountId: string;
    dateKey?: string;
    limit?: number;
  }): Promise<FeedPostSnapshot[]> {
    const limit = input.limit ?? 100;
    const posts = await this.feedRepo.listByAccountId(input.accountId, limit);
    if (!input.dateKey) return posts;
    return posts.filter((post) => post.dateKey === input.dateKey);
  }
}
