/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for knowledge page lifecycle use cases.
 */

import { z } from "@lib-zod";

const AccountScopeSchema = z.object({ accountId: z.string().min(1) });

export const VerifyKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  verifiedByUserId: z.string().min(1),
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
