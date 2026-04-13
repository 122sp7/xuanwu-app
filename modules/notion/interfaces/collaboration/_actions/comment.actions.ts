"use server";

/**
 * Module: notion/subdomains/collaboration
 * Layer: interfaces/_actions
 * Purpose: Comment aggregate server actions — create, update, resolve, delete.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { dispatchNotification } from "@/modules/platform/api";
import { makeCommentRepo } from "../composition/repositories";
import {
  CreateCommentUseCase,
  UpdateCommentUseCase,
  ResolveCommentUseCase,
  DeleteCommentUseCase,
} from "../../../subdomains/collaboration/application/use-cases/manage-comment.use-cases";
import type {
  CreateCommentDto,
  UpdateCommentDto,
  ResolveCommentDto,
  DeleteCommentDto,
} from "../../../subdomains/collaboration/application/dto/CollaborationDto";

export async function createComment(input: CreateCommentDto): Promise<CommandResult> {
  try {
    const result = await new CreateCommentUseCase(makeCommentRepo()).execute(input);
    if (result.success && input.mentionedUserIds && input.mentionedUserIds.length > 0) {
      await Promise.allSettled(
        input.mentionedUserIds.map((recipientId) =>
          dispatchNotification({
            recipientId,
            title: "有人提及了你",
            message: input.body.slice(0, 100),
            type: "info",
            sourceEventType: "comment.mention",
            metadata: { authorId: input.authorId, contentId: input.contentId, contentType: input.contentType },
          }),
        ),
      );
    }
    return result;
  } catch (err) {
    return commandFailureFrom("COMMENT_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateComment(input: UpdateCommentDto): Promise<CommandResult> {
  try {
    return await new UpdateCommentUseCase(makeCommentRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COMMENT_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function resolveComment(input: ResolveCommentDto): Promise<CommandResult> {
  try {
    return await new ResolveCommentUseCase(makeCommentRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COMMENT_RESOLVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteComment(input: DeleteCommentDto): Promise<CommandResult> {
  try {
    return await new DeleteCommentUseCase(makeCommentRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("COMMENT_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
