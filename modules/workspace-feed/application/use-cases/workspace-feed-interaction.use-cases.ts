/**
 * Module: workspace-feed
 * Layer: application/use-cases
 * Purpose: Feed interaction use cases — like, bookmark, view, share.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type {
  WorkspaceFeedInteractionRepository,
  WorkspaceFeedPostRepository,
} from "../../domain/repositories/workspace-feed.repositories";
import { FeedInteractionSchema } from "../dto/workspace-feed.dto";

export class LikeWorkspaceFeedPostUseCase {
  constructor(
    private readonly postRepo: WorkspaceFeedPostRepository,
    private readonly interactionRepo: WorkspaceFeedInteractionRepository,
  ) {}

  async execute(input: { accountId: string; postId: string; actorAccountId: string }): Promise<CommandResult> {
    const parsed = FeedInteractionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
    if (!post) {
      return commandFailureFrom("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
    }

    const liked = await this.interactionRepo.like(
      parsed.data.accountId,
      parsed.data.postId,
      parsed.data.actorAccountId,
    );
    if (liked) {
      await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, { likeDelta: 1 });
    }

    return commandSuccess(parsed.data.postId, Date.now());
  }
}

export class BookmarkWorkspaceFeedPostUseCase {
  constructor(
    private readonly postRepo: WorkspaceFeedPostRepository,
    private readonly interactionRepo: WorkspaceFeedInteractionRepository,
  ) {}

  async execute(input: { accountId: string; postId: string; actorAccountId: string }): Promise<CommandResult> {
    const parsed = FeedInteractionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
    if (!post) {
      return commandFailureFrom("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
    }

    const bookmarked = await this.interactionRepo.bookmark(
      parsed.data.accountId,
      parsed.data.postId,
      parsed.data.actorAccountId,
    );
    if (bookmarked) {
      await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, { bookmarkDelta: 1 });
    }

    return commandSuccess(parsed.data.postId, Date.now());
  }
}

export class ViewWorkspaceFeedPostUseCase {
  constructor(
    private readonly postRepo: WorkspaceFeedPostRepository,
    private readonly interactionRepo: WorkspaceFeedInteractionRepository,
  ) {}

  async execute(input: { accountId: string; postId: string; actorAccountId: string }): Promise<CommandResult> {
    const parsed = FeedInteractionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
    if (!post) {
      return commandFailureFrom("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
    }

    await this.interactionRepo.view(parsed.data.accountId, parsed.data.postId, parsed.data.actorAccountId);
    await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, { viewDelta: 1 });
    return commandSuccess(parsed.data.postId, Date.now());
  }
}

export class ShareWorkspaceFeedPostUseCase {
  constructor(
    private readonly postRepo: WorkspaceFeedPostRepository,
    private readonly interactionRepo: WorkspaceFeedInteractionRepository,
  ) {}

  async execute(input: { accountId: string; postId: string; actorAccountId: string }): Promise<CommandResult> {
    const parsed = FeedInteractionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
    if (!post) {
      return commandFailureFrom("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
    }

    await this.interactionRepo.share(parsed.data.accountId, parsed.data.postId, parsed.data.actorAccountId);
    await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, { shareDelta: 1 });
    return commandSuccess(parsed.data.postId, Date.now());
  }
}
