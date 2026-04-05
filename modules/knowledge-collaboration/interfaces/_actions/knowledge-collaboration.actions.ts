"use server";

/**
 * Module: knowledge-collaboration
 * Layer: interfaces/_actions
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { CreateCommentUseCase, UpdateCommentUseCase, ResolveCommentUseCase, DeleteCommentUseCase } from "../../application/use-cases/comment.use-cases";
import { CreateVersionUseCase, DeleteVersionUseCase } from "../../application/use-cases/version.use-cases";
import { FirebaseCommentRepository } from "../../infrastructure/firebase/FirebaseCommentRepository";
import { FirebaseVersionRepository } from "../../infrastructure/firebase/FirebaseVersionRepository";
import type { CreateCommentDto, UpdateCommentDto, ResolveCommentDto, DeleteCommentDto, CreateVersionDto, DeleteVersionDto } from "../../application/dto/knowledge-collaboration.dto";

function makeCommentRepo() { return new FirebaseCommentRepository(); }
function makeVersionRepo() { return new FirebaseVersionRepository(); }

export async function createComment(input: CreateCommentDto): Promise<CommandResult> {
  try {
    return await new CreateCommentUseCase(makeCommentRepo()).execute(input);
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

export async function createVersion(input: CreateVersionDto): Promise<CommandResult> {
  try {
    return await new CreateVersionUseCase(makeVersionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VERSION_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteVersion(input: DeleteVersionDto): Promise<CommandResult> {
  try {
    return await new DeleteVersionUseCase(makeVersionRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("VERSION_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
