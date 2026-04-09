import type { WorkspaceFeedPost } from "../domain/entities/workspace-feed-post.entity";
import type {
  WorkspaceFeedInteractionRepository,
  WorkspaceFeedPostRepository,
} from "../domain/repositories/workspace-feed.repositories";
import {
  BookmarkWorkspaceFeedPostUseCase,
  CreateWorkspaceFeedPostUseCase,
  GetWorkspaceFeedPostUseCase,
  LikeWorkspaceFeedPostUseCase,
  ListAccountWorkspaceFeedUseCase,
  ListWorkspaceFeedUseCase,
  ReplyWorkspaceFeedPostUseCase,
  RepostWorkspaceFeedPostUseCase,
  ShareWorkspaceFeedPostUseCase,
  ViewWorkspaceFeedPostUseCase,
} from "../application/use-cases/workspace-feed.use-cases";
import {
  FirebaseWorkspaceFeedInteractionRepository,
  FirebaseWorkspaceFeedPostRepository,
} from "../infrastructure";

export interface CreateWorkspaceFeedPostParams {
  accountId: string;
  workspaceId: string;
  authorAccountId: string;
  content: string;
}

export interface ReplyWorkspaceFeedPostParams {
  accountId: string;
  workspaceId: string;
  parentPostId: string;
  authorAccountId: string;
  content: string;
}

export interface RepostWorkspaceFeedPostParams {
  accountId: string;
  workspaceId: string;
  sourcePostId: string;
  actorAccountId: string;
  comment?: string;
}

export interface WorkspaceFeedInteractionParams {
  accountId: string;
  postId: string;
  actorAccountId: string;
}

export class WorkspaceFeedFacade {
  private readonly postRepo: WorkspaceFeedPostRepository;
  private readonly interactionRepo: WorkspaceFeedInteractionRepository;

  constructor(
    postRepo: WorkspaceFeedPostRepository = new FirebaseWorkspaceFeedPostRepository(),
    interactionRepo: WorkspaceFeedInteractionRepository = new FirebaseWorkspaceFeedInteractionRepository(),
  ) {
    this.postRepo = postRepo;
    this.interactionRepo = interactionRepo;
  }

  async createPost(params: CreateWorkspaceFeedPostParams): Promise<string | null> {
    const result = await new CreateWorkspaceFeedPostUseCase(this.postRepo).execute(params);
    return result.success ? result.aggregateId : null;
  }

  async reply(params: ReplyWorkspaceFeedPostParams): Promise<string | null> {
    const result = await new ReplyWorkspaceFeedPostUseCase(this.postRepo).execute(params);
    return result.success ? result.aggregateId : null;
  }

  async repost(params: RepostWorkspaceFeedPostParams): Promise<string | null> {
    const result = await new RepostWorkspaceFeedPostUseCase(this.postRepo).execute(params);
    return result.success ? result.aggregateId : null;
  }

  async like(params: WorkspaceFeedInteractionParams): Promise<boolean> {
    const result = await new LikeWorkspaceFeedPostUseCase(this.postRepo, this.interactionRepo).execute(params);
    return result.success;
  }

  async view(params: WorkspaceFeedInteractionParams): Promise<boolean> {
    const result = await new ViewWorkspaceFeedPostUseCase(this.postRepo, this.interactionRepo).execute(params);
    return result.success;
  }

  async bookmark(params: WorkspaceFeedInteractionParams): Promise<boolean> {
    const result = await new BookmarkWorkspaceFeedPostUseCase(this.postRepo, this.interactionRepo).execute(params);
    return result.success;
  }

  async share(params: WorkspaceFeedInteractionParams): Promise<boolean> {
    const result = await new ShareWorkspaceFeedPostUseCase(this.postRepo, this.interactionRepo).execute(params);
    return result.success;
  }

  async getPost(accountId: string, postId: string): Promise<WorkspaceFeedPost | null> {
    return new GetWorkspaceFeedPostUseCase(this.postRepo).execute(accountId, postId);
  }

  async getWorkspaceFeed(
    accountId: string,
    workspaceId: string,
    maxRows = 50,
  ): Promise<WorkspaceFeedPost[]> {
    return new ListWorkspaceFeedUseCase(this.postRepo).execute({
      accountId,
      workspaceId,
      limit: maxRows,
    });
  }

  async getAccountFeed(accountId: string, maxRows = 50): Promise<WorkspaceFeedPost[]> {
    return new ListAccountWorkspaceFeedUseCase(this.postRepo).execute({
      accountId,
      limit: maxRows,
    });
  }
}

export const workspaceFeedFacade = new WorkspaceFeedFacade();
