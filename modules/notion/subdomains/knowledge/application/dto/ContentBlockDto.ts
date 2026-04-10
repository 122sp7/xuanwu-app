/**
 * Module: notion/subdomains/knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for ContentBlock use cases.
 */

import { z } from "@lib-zod";
import { BLOCK_TYPES } from "../../domain/value-objects/BlockContent";

export const BlockTypeSchema = z.enum(BLOCK_TYPES);

export const BlockContentSchema = z.object({
  type: BlockTypeSchema,
  richText: z.array(z.unknown()).readonly(),
  properties: z.record(z.string(), z.unknown()).optional(),
});
export type BlockContentDto = z.infer<typeof BlockContentSchema>;

const AccountScopeSchema = z.object({ accountId: z.string().min(1) });

export const AddKnowledgeBlockSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  content: BlockContentSchema,
  index: z.number().int().nonnegative().optional(),
  parentBlockId: z.string().min(1).nullable().optional(),
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

export const NestKnowledgeBlockSchema = z.object({
  accountId: z.string().min(1),
  blockId: z.string().min(1),
  parentBlockId: z.string().min(1),
  index: z.number().int().min(0).optional(),
});
export type NestKnowledgeBlockDto = z.infer<typeof NestKnowledgeBlockSchema>;

export const UnnestKnowledgeBlockSchema = z.object({
  accountId: z.string().min(1),
  blockId: z.string().min(1),
  index: z.number().int().min(0).optional(),
});
export type UnnestKnowledgeBlockDto = z.infer<typeof UnnestKnowledgeBlockSchema>;
