"use server";

/**
 * feed-actions — workspace/feed inbound server actions.
 *
 * Thin boundary layer: parse → use-case → return CommandResult / snapshot[].
 * All Firebase setup goes through the workspace firebase-composition root.
 */

import type { CommandResult } from "../../../../../../shared";
import type { FeedPostSnapshot } from "../../../domain/entities/FeedPost";
import { CreateFeedPostSchema, ListFeedPostsSchema } from "../../../application";
import { createClientFeedUseCases } from "../../../../../adapters/outbound/firebase-composition";

/** Create a new feed post (text + optional photos). */
export async function createFeedPostAction(rawInput: unknown): Promise<CommandResult> {
  const input = CreateFeedPostSchema.parse(rawInput);
  const { createFeedPost } = createClientFeedUseCases();
  return createFeedPost.execute(input);
}

/** List feed posts for a workspace, optionally filtered by date (YYYY-MM-DD). */
export async function listFeedPostsAction(rawInput: unknown): Promise<FeedPostSnapshot[]> {
  const input = ListFeedPostsSchema.parse(rawInput);
  const { listFeedPosts } = createClientFeedUseCases();
  return listFeedPosts.execute(input);
}
