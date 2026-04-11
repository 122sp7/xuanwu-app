import type { WorkspaceFeedPost } from "../../application/dto/workspace-feed.dto";
import {
  GetWorkspaceFeedPostUseCase,
  ListAccountWorkspaceFeedUseCase,
  ListWorkspaceFeedUseCase,
} from "../../application/use-cases/workspace-feed.use-cases";
import { makeWorkspaceFeedPostRepo } from "../../api/factories";

export async function getWorkspaceFeedPost(
  accountId: string,
  postId: string,
): Promise<WorkspaceFeedPost | null> {
  return new GetWorkspaceFeedPostUseCase(makeWorkspaceFeedPostRepo()).execute(
    accountId,
    postId,
  );
}

export async function getWorkspaceFeed(
  accountId: string,
  workspaceId: string,
  limit = 50,
): Promise<WorkspaceFeedPost[]> {
  return new ListWorkspaceFeedUseCase(makeWorkspaceFeedPostRepo()).execute({
    accountId,
    workspaceId,
    limit,
  });
}

export async function getAccountWorkspaceFeed(accountId: string, limit = 50): Promise<WorkspaceFeedPost[]> {
  return new ListAccountWorkspaceFeedUseCase(makeWorkspaceFeedPostRepo()).execute({
    accountId,
    limit,
  });
}
