"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import type {
  CreateWorkspaceFeedPostDto,
  FeedInteractionDto,
  ReplyWorkspaceFeedPostDto,
  RepostWorkspaceFeedPostDto,
} from "../../application/dto/workspace-feed.dto";
import {
  makeWorkspaceFeedInteractionRepo,
  makeWorkspaceFeedPostRepo,
} from "../../api/factories";
import {
  BookmarkWorkspaceFeedPostUseCase,
  CreateWorkspaceFeedPostUseCase,
  LikeWorkspaceFeedPostUseCase,
  ReplyWorkspaceFeedPostUseCase,
  RepostWorkspaceFeedPostUseCase,
  ShareWorkspaceFeedPostUseCase,
  ViewWorkspaceFeedPostUseCase,
} from "../../application/use-cases/workspace-feed.use-cases";

function makePostRepo() {
  return makeWorkspaceFeedPostRepo();
}

function makeInteractionRepo() {
  return makeWorkspaceFeedInteractionRepo();
}

export async function createWorkspaceFeedPost(input: CreateWorkspaceFeedPostDto): Promise<CommandResult> {
  try {
    return await new CreateWorkspaceFeedPostUseCase(makePostRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_CREATE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function replyWorkspaceFeedPost(input: ReplyWorkspaceFeedPostDto): Promise<CommandResult> {
  try {
    return await new ReplyWorkspaceFeedPostUseCase(makePostRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_REPLY_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function repostWorkspaceFeedPost(input: RepostWorkspaceFeedPostDto): Promise<CommandResult> {
  try {
    return await new RepostWorkspaceFeedPostUseCase(makePostRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_REPOST_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function likeWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult> {
  try {
    return await new LikeWorkspaceFeedPostUseCase(makePostRepo(), makeInteractionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_LIKE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function viewWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult> {
  try {
    return await new ViewWorkspaceFeedPostUseCase(makePostRepo(), makeInteractionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_VIEW_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function bookmarkWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult> {
  try {
    return await new BookmarkWorkspaceFeedPostUseCase(makePostRepo(), makeInteractionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_BOOKMARK_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function shareWorkspaceFeedPost(input: FeedInteractionDto): Promise<CommandResult> {
  try {
    return await new ShareWorkspaceFeedPostUseCase(makePostRepo(), makeInteractionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom(
      "WORKSPACE_FEED_SHARE_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
