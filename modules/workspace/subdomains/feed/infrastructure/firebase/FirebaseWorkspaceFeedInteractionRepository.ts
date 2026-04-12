import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";

import type { WorkspaceFeedInteractionRepository } from "../../domain/repositories/workspace-feed.repositories";

function postPath(accountId: string, postId: string): string {
  return `accounts/${accountId}/workspaceFeedPosts/${postId}`;
}

function likesPath(accountId: string, postId: string, actorAccountId: string): string {
  return `${postPath(accountId, postId)}/likes/${actorAccountId}`;
}

function bookmarksPath(accountId: string, postId: string, actorAccountId: string): string {
  return `${postPath(accountId, postId)}/bookmarks/${actorAccountId}`;
}

function viewsPath(accountId: string, postId: string): string {
  return `${postPath(accountId, postId)}/views`;
}

function sharesPath(accountId: string, postId: string): string {
  return `${postPath(accountId, postId)}/shares`;
}

export class FirebaseWorkspaceFeedInteractionRepository implements WorkspaceFeedInteractionRepository {
  async like(accountId: string, postId: string, actorAccountId: string): Promise<boolean> {
    const path = likesPath(accountId, postId, actorAccountId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (snap) return false;

    await firestoreInfrastructureApi.set(path, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
    });
    return true;
  }

  async bookmark(accountId: string, postId: string, actorAccountId: string): Promise<boolean> {
    const path = bookmarksPath(accountId, postId, actorAccountId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (snap) return false;

    await firestoreInfrastructureApi.set(path, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
    });
    return true;
  }

  async view(accountId: string, postId: string, actorAccountId: string): Promise<void> {
    await firestoreInfrastructureApi.set(`${viewsPath(accountId, postId)}/${generateId()}`, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
    });
  }

  async share(accountId: string, postId: string, actorAccountId: string): Promise<void> {
    await firestoreInfrastructureApi.set(`${sharesPath(accountId, postId)}/${generateId()}`, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
    });
  }
}
