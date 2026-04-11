import type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";
import type { WorkspaceFeedPostRepository } from "../../domain/repositories/workspace-feed.repositories";
import {
  ListWorkspaceFeedSchema,
  type ListWorkspaceFeedDto,
  ListAccountFeedSchema,
  type ListAccountFeedDto,
} from "../dto/workspace-feed.dto";

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
