/**
 * Module: content
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for Content use cases.
 */

import { z } from "@lib-zod";
import { BLOCK_TYPES } from "../../domain/value-objects/block-content";
import { CONTENT_PAGE_STATUSES } from "../../domain/entities/content-page.entity";

const AccountScopeSchema = z.object({
  accountId: z.string().min(1),
});

export const BlockTypeSchema = z.enum(BLOCK_TYPES);

export const BlockContentSchema = z.object({
  type: BlockTypeSchema,
  text: z.string(),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export type BlockContentDto = z.infer<typeof BlockContentSchema>;

export const CreateContentPageSchema = AccountScopeSchema.extend({
  workspaceId: z.string().min(1).optional(),
  title: z.string().min(1).max(300),
  parentPageId: z.string().min(1).nullable().optional(),
  createdByUserId: z.string().min(1),
});

export type CreateContentPageDto = z.infer<typeof CreateContentPageSchema>;

export const RenameContentPageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  title: z.string().min(1).max(300),
});

export type RenameContentPageDto = z.infer<typeof RenameContentPageSchema>;

export const MoveContentPageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  targetParentPageId: z.string().min(1).nullable(),
});

export type MoveContentPageDto = z.infer<typeof MoveContentPageSchema>;

export const ArchiveContentPageSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
});

export type ArchiveContentPageDto = z.infer<typeof ArchiveContentPageSchema>;

export const ReorderContentPageBlocksSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  blockIds: z.array(z.string().min(1)),
});

export type ReorderContentPageBlocksDto = z.infer<typeof ReorderContentPageBlocksSchema>;

export const AddContentBlockSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  content: BlockContentSchema,
  index: z.number().int().nonnegative().optional(),
});

export type AddContentBlockDto = z.infer<typeof AddContentBlockSchema>;

export const UpdateContentBlockSchema = AccountScopeSchema.extend({
  blockId: z.string().min(1),
  content: BlockContentSchema,
});

export type UpdateContentBlockDto = z.infer<typeof UpdateContentBlockSchema>;

export const DeleteContentBlockSchema = AccountScopeSchema.extend({
  blockId: z.string().min(1),
});

export type DeleteContentBlockDto = z.infer<typeof DeleteContentBlockSchema>;

export const CreateContentVersionSchema = AccountScopeSchema.extend({
  pageId: z.string().min(1),
  label: z.string().max(100).optional(),
  createdByUserId: z.string().min(1),
});

export type CreateContentVersionDto = z.infer<typeof CreateContentVersionSchema>;

export const ContentPageStatusSchema = z.enum(CONTENT_PAGE_STATUSES);
