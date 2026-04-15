import { v4 as uuid } from "@lib-uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { FeedPostRepository } from "../../domain/repositories/FeedPostRepository";
import { FeedPost } from "../../domain/entities/FeedPost";
import type { CreateFeedPostInput } from "../../domain/entities/FeedPost";

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
