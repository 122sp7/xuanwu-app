/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/repositories
 * Contract: CommentRepository
 *
 * Owned by the domain layer. Implemented in infrastructure/firebase/.
 */

import type { CommentSnapshot, SelectionRange } from "../aggregates/Comment";

export type CommentUnsubscribe = () => void;

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

export interface CommentRepository {
  create(input: CreateCommentInput): Promise<CommentSnapshot>;
  update(input: UpdateCommentInput): Promise<CommentSnapshot | null>;
  resolve(input: ResolveCommentInput): Promise<CommentSnapshot | null>;
  delete(accountId: string, commentId: string): Promise<void>;
  findById(accountId: string, commentId: string): Promise<CommentSnapshot | null>;
  listByContent(accountId: string, contentId: string): Promise<CommentSnapshot[]>;
  subscribe(
    accountId: string,
    contentId: string,
    onUpdate: (comments: CommentSnapshot[]) => void,
  ): CommentUnsubscribe;
}
