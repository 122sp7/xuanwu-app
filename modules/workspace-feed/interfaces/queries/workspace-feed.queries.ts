import type { WorkspaceFeedPost } from "../../domain/entities/workspace-feed-post.entity";
import {
  GetWorkspaceFeedPostUseCase,
  ListAccountWorkspaceFeedUseCase,
  ListWorkspaceFeedUseCase,
} from "../../application/use-cases/workspace-feed.use-cases";
import { FirebaseWorkspaceFeedPostRepository } from "../../infrastructure";

export async function getWorkspaceFeedPost(
  accountId: string,
  postId: string,
): Promise<WorkspaceFeedPost | null> {
  return new GetWorkspaceFeedPostUseCase(new FirebaseWorkspaceFeedPostRepository()).execute(
    accountId,
    postId,
  );
}

export async function getWorkspaceFeed(
  accountId: string,
  workspaceId: string,
  limit = 50,
): Promise<WorkspaceFeedPost[]> {
  return new ListWorkspaceFeedUseCase(new FirebaseWorkspaceFeedPostRepository()).execute({
    accountId,
    workspaceId,
    limit,
  });
}

export async function getAccountWorkspaceFeed(accountId: string, limit = 50): Promise<WorkspaceFeedPost[]> {
  return new ListAccountWorkspaceFeedUseCase(new FirebaseWorkspaceFeedPostRepository()).execute({
    accountId,
    limit,
  });
}
