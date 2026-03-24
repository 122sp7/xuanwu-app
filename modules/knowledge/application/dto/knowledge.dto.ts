/**
 * Module: knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for Knowledge use cases.
 *
 * Validation lives at the application boundary (use-case inputs).
 * The domain layer never imports Zod — it uses plain TypeScript types.
 *
 * Block content is also validated here via BlockContentSchema so that
 * invalid payloads are rejected before reaching domain logic.
 */

import { z } from "@lib-zod";
import { BLOCK_TYPES } from "../../domain/value-objects/block-content";
import { KNOWLEDGE_PAGE_STATUSES } from "../../domain/entities/knowledge-page.entity";

// ── Shared ────────────────────────────────────────────────────────────────────

/** Common account scope required on every mutating operation. */
const AccountScopeSchema = z.object({
  accountId: z.string().min(1),
});

// ── BlockContent schema ───────────────────────────────────────────────────────

export const BlockTypeSchema = z.enum(BLOCK_TYPES);

export const BlockContentSchema = z.object({
  type: BlockTypeSchema,
  text: z.string(),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export type BlockContentDto = z.infer<typeof BlockContentSchema>;

// ── Page schemas ──────────────────────────────────────────────────────────────

export const CreateKnowledgePageSchema = AccountScopeSchema.extend({
  workspaceId: z.string().min(1).optional(),
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

// ── Block schemas ─────────────────────────────────────────────────────────────

export const AddKnowledgeBlockSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  content: BlockContentSchema,
  index: z.number().int().nonnegative().optional(),
});

export type AddKnowledgeBlockDto = z.infer<typeof AddKnowledgeBlockSchema>;

export const UpdateKnowledgeBlockSchema = AccountScopeSchema.extend({
  blockId: z.string().min(1),
  content: BlockContentSchema,
});

export type UpdateKnowledgeBlockDto = z.infer<typeof UpdateKnowledgeBlockSchema>;

export const DeleteKnowledgeBlockSchema = AccountScopeSchema.extend({
  blockId: z.string().min(1),
});

export type DeleteKnowledgeBlockDto = z.infer<typeof DeleteKnowledgeBlockSchema>;

// ── Version schemas ───────────────────────────────────────────────────────────

export const CreateKnowledgeVersionSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  label: z.string().max(100).optional(),
  createdByUserId: z.string().min(1),
});

export type CreateKnowledgeVersionDto = z.infer<typeof CreateKnowledgeVersionSchema>;

// ── Status schema (for query filters) ────────────────────────────────────────

export const KnowledgePageStatusSchema = z.enum(KNOWLEDGE_PAGE_STATUSES);
