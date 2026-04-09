"use server";

/**
 * Module: knowledge-collaboration
 * Layer: interfaces/_actions
 * Purpose: Comment Aggregate Server Actions — create, update, resolve, delete.
 * Version actions: see version.actions.ts
 * Permission actions: see permission.actions.ts
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { dispatchNotification } from "@/modules/platform/subdomains/notification";
import {
  CreateCommentUseCase,
  UpdateCommentUseCase,
  ResolveCommentUseCase,
  DeleteCommentUseCase,
} from "../../application/use-cases/comment.use-cases";
import { FirebaseCommentRepository } from "../../infrastructure/firebase/FirebaseCommentRepository";
import type {
  CreateCommentDto,
  UpdateCommentDto,
  ResolveCommentDto,
  DeleteCommentDto,
} from "../../application/dto/knowledge-collaboration.dto";

function makeCommentRepo() { return new FirebaseCommentRepository(); }

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
