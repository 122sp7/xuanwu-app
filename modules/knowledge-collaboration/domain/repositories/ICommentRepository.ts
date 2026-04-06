/**
 * Module: knowledge-collaboration
 * Layer: domain/repositories
 */

import type { Comment, SelectionRange } from "../entities/comment.entity";

export interface CreateCommentInput {
  readonly contentId: string;
  readonly contentType: "page" | "article";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly authorId: string;
  readonly body: string;
  readonly parentCommentId?: string | null;
  readonly blockId?: string | null;
  readonly selectionRange?: SelectionRange | null;
}

export interface UpdateCommentInput {
  readonly id: string;
  readonly accountId: string;
  readonly body: string;
}

export interface ResolveCommentInput {
  readonly id: string;
  readonly accountId: string;
  readonly resolvedByUserId: string;
}

export interface ICommentRepository {
  create(input: CreateCommentInput): Promise<Comment>;
  update(input: UpdateCommentInput): Promise<Comment | null>;
  resolve(input: ResolveCommentInput): Promise<Comment | null>;
  delete(accountId: string, commentId: string): Promise<void>;
  findById(accountId: string, commentId: string): Promise<Comment | null>;
  listByContent(accountId: string, contentId: string): Promise<Comment[]>;
}
