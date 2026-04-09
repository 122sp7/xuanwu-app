/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for KnowledgePage use cases.
 */

import { z } from "@lib-zod";

const AccountScopeSchema = z.object({ accountId: z.string().min(1) });

export const CreateKnowledgePageSchema = AccountScopeSchema.extend({
  workspaceId: z.string().min(1),
  title: z.string().min(1).max(300),
  parentPageId: z.string().min(1).nullable().optional(),
  createdByUserId: z.string().min(1),
});
export type CreateKnowledgePageDto = z.infer<typeof CreateKnowledgePageSchema>;

export const RenameKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  title: z.string().min(1).max(300),
});
export type RenameKnowledgePageDto = z.infer<typeof RenameKnowledgePageSchema>;

export const MoveKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  targetParentPageId: z.string().min(1).nullable(),
});
export type MoveKnowledgePageDto = z.infer<typeof MoveKnowledgePageSchema>;

export const ArchiveKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
});
export type ArchiveKnowledgePageDto = z.infer<typeof ArchiveKnowledgePageSchema>;

export const ReorderKnowledgePageBlocksSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  blockIds: z.array(z.string().min(1)),
});
export type ReorderKnowledgePageBlocksDto = z.infer<typeof ReorderKnowledgePageBlocksSchema>;

export const ExtractedTaskSchema = z.object({
  title: z.string().min(1).max(300),
  dueDate: z.string().optional(),
  description: z.string().optional(),
});

export const ExtractedInvoiceSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  currency: z.string().optional(),
});

export const ApproveKnowledgePageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  actorId: z.string().min(1),
  causationId: z.string().min(1).optional(),
  extractedTasks: z.array(ExtractedTaskSchema).default([]),
  extractedInvoices: z.array(ExtractedInvoiceSchema).default([]),
  correlationId: z.string().optional(),
  workspaceId: z.string().optional(),
});
export type ApproveKnowledgePageDto = z.infer<typeof ApproveKnowledgePageSchema>;

export const CreateKnowledgeVersionSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  label: z.string().max(100).optional(),
  createdByUserId: z.string().min(1),
});
export type CreateKnowledgeVersionDto = z.infer<typeof CreateKnowledgeVersionSchema>;
