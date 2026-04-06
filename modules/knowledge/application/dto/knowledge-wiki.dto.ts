/**
 * Module: knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for wiki / knowledge-base use cases
 *          (verification, review, wiki spaces, page appearance).
 */

import { z } from "@lib-zod";
import { PAGE_VERIFICATION_STATES } from "../../domain/entities/knowledge-page.entity";

const AccountScopeSchema = z.object({
  accountId: z.string().min(1),
});

export const PageVerificationStateSchema = z.enum(PAGE_VERIFICATION_STATES);

export const VerifyKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  verifiedByUserId: z.string().min(1),
  /** ISO 8601 — if set, page auto-transitions to "needs_review" after this date. */
  verificationExpiresAtISO: z.string().datetime({ offset: true }).optional(),
});

export type VerifyKnowledgePageDto = z.infer<typeof VerifyKnowledgePageSchema>;

export const RequestPageReviewSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  requestedByUserId: z.string().min(1),
});

export type RequestPageReviewDto = z.infer<typeof RequestPageReviewSchema>;

export const AssignPageOwnerSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  ownerId: z.string().min(1),
  assignedByUserId: z.string().min(1),
});

export type AssignPageOwnerDto = z.infer<typeof AssignPageOwnerSchema>;

export const CreateWikiSpaceSchema = AccountScopeSchema.extend({
  workspaceId: z.string().min(1).optional(),
  name: z.string().min(1).max(300),
  description: z.string().max(1000).optional(),
  createdByUserId: z.string().min(1),
});

export type CreateWikiSpaceDto = z.infer<typeof CreateWikiSpaceSchema>;

export const UpdatePageIconSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  iconUrl: z.string().max(2000),
});

export type UpdatePageIconDto = z.infer<typeof UpdatePageIconSchema>;

export const UpdatePageCoverSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  coverUrl: z.string().max(2000),
});

export type UpdatePageCoverDto = z.infer<typeof UpdatePageCoverSchema>;
