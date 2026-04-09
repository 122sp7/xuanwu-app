import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";
import type { WorkspaceFeedPostRepository } from "../../domain/repositories/workspace-feed.repositories";
import {
  CreateWorkspaceFeedPostSchema,
  type CreateWorkspaceFeedPostDto,
  ListAccountFeedSchema,
  type ListAccountFeedDto,
  ListWorkspaceFeedSchema,
  type ListWorkspaceFeedDto,
  ReplyWorkspaceFeedPostSchema,
  type ReplyWorkspaceFeedPostDto,
  RepostWorkspaceFeedPostSchema,
  type RepostWorkspaceFeedPostDto,
} from "../dto/workspace-feed.dto";

export class CreateWorkspaceFeedPostUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: CreateWorkspaceFeedPostDto): Promise<CommandResult> {
    const parsed = CreateWorkspaceFeedPostSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const post = await this.repo.createPost(parsed.data);
    return commandSuccess(post.id, Date.now());
  }
}

export class ReplyWorkspaceFeedPostUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: ReplyWorkspaceFeedPostDto): Promise<CommandResult> {
    const parsed = ReplyWorkspaceFeedPostSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const parent = await this.repo.findById(parsed.data.accountId, parsed.data.parentPostId);
    if (!parent) {
      return commandFailureFrom("WORKSPACE_FEED_PARENT_NOT_FOUND", "Parent post not found.");
    }
    if (parent.workspaceId !== parsed.data.workspaceId) {
      return commandFailureFrom("WORKSPACE_FEED_WORKSPACE_MISMATCH", "Parent post is in another workspace.");
    }

    const reply = await this.repo.createReply(parsed.data);
    return commandSuccess(reply.id, Date.now());
  }
}

export class RepostWorkspaceFeedPostUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: RepostWorkspaceFeedPostDto): Promise<CommandResult> {
    const parsed = RepostWorkspaceFeedPostSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
    }

    const source = await this.repo.findById(parsed.data.accountId, parsed.data.sourcePostId);
    if (!source) {
      return commandFailureFrom("WORKSPACE_FEED_SOURCE_NOT_FOUND", "Source post not found.");
    }
    if (source.workspaceId !== parsed.data.workspaceId) {
      return commandFailureFrom("WORKSPACE_FEED_WORKSPACE_MISMATCH", "Source post is in another workspace.");
    }

    const repost = await this.repo.createRepost(parsed.data);
    if (!repost) {
      return commandFailureFrom("WORKSPACE_FEED_REPOST_FAILED", "Failed to create repost.");
    }

    return commandSuccess(repost.id, Date.now());
  }
}

export class GetWorkspaceFeedPostUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(accountId: string, postId: string): Promise<WorkspaceFeedPost | null> {
    if (!accountId.trim() || !postId.trim()) return null;
    return this.repo.findById(accountId, postId);
  }
}

export class ListWorkspaceFeedUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: ListWorkspaceFeedDto): Promise<WorkspaceFeedPost[]> {
    const parsed = ListWorkspaceFeedSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByWorkspaceId(parsed.data.accountId, parsed.data.workspaceId, parsed.data.limit ?? 50);
  }
}

export class ListAccountWorkspaceFeedUseCase {
  constructor(private readonly repo: WorkspaceFeedPostRepository) {}

  async execute(input: ListAccountFeedDto): Promise<WorkspaceFeedPost[]> {
    const parsed = ListAccountFeedSchema.safeParse(input);
    if (!parsed.success) return [];
    return this.repo.listByAccountId(parsed.data.accountId, parsed.data.limit ?? 50);
  }
}
