/**
 * Module: knowledge-collaboration
 * Layer: application/use-cases
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { Comment } from "../../domain/entities/comment.entity";
import type { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import {
  CreateCommentSchema, type CreateCommentDto,
  UpdateCommentSchema, type UpdateCommentDto,
  ResolveCommentSchema, type ResolveCommentDto,
  DeleteCommentSchema, type DeleteCommentDto,
} from "../dto/knowledge-collaboration.dto";

export class CreateCommentUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(input: CreateCommentDto): Promise<CommandResult> {
    const parsed = CreateCommentSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("COMMENT_INVALID_INPUT", parsed.error.message);
    }
    const { accountId, workspaceId, contentId, contentType, authorId, body, parentCommentId } = parsed.data;
    const comment = await this.repo.create({ accountId, workspaceId, contentId, contentType, authorId, body, parentCommentId });
    return commandSuccess(comment.id, Date.now());
  }
}

export class UpdateCommentUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(input: UpdateCommentDto): Promise<CommandResult> {
    const parsed = UpdateCommentSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COMMENT_INVALID_INPUT", parsed.error.message);
    const result = await this.repo.update(parsed.data);
    if (!result) return commandFailureFrom("COMMENT_NOT_FOUND", "Comment not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class ResolveCommentUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(input: ResolveCommentDto): Promise<CommandResult> {
    const parsed = ResolveCommentSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COMMENT_INVALID_INPUT", parsed.error.message);
    const result = await this.repo.resolve(parsed.data);
    if (!result) return commandFailureFrom("COMMENT_NOT_FOUND", "Comment not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class DeleteCommentUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(input: DeleteCommentDto): Promise<CommandResult> {
    const parsed = DeleteCommentSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("COMMENT_INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, Date.now());
  }
}

export class ListCommentsUseCase {
  constructor(private readonly repo: ICommentRepository) {}

  async execute(accountId: string, contentId: string): Promise<Comment[]> {
    if (!accountId.trim() || !contentId.trim()) return [];
    return this.repo.listByContent(accountId, contentId);
  }
}
