/**
 * Module: knowledge
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for KnowledgeCollection use cases.
 */

import { z } from "@lib-zod";

const AccountScopeSchema = z.object({
  accountId: z.string().min(1),
});

export const CollectionColumnTypeSchema = z.enum([
  "text",
  "number",
  "select",
  "multi-select",
  "date",
  "checkbox",
  "url",
  "relation",
]);

export type CollectionColumnTypeDto = z.infer<typeof CollectionColumnTypeSchema>;

export const CollectionColumnInputSchema = z.object({
  name: z.string().min(1).max(100),
  type: CollectionColumnTypeSchema,
  options: z.array(z.string()).optional(),
});

export type CollectionColumnInputDto = z.infer<typeof CollectionColumnInputSchema>;

export const CreateKnowledgeCollectionSchema = AccountScopeSchema.extend({
  workspaceId: z.string().min(1).optional(),
  name: z.string().min(1).max(300),
  description: z.string().max(1000).optional(),
  columns: z.array(CollectionColumnInputSchema).optional(),
  createdByUserId: z.string().min(1),
});

export type CreateKnowledgeCollectionDto = z.infer<typeof CreateKnowledgeCollectionSchema>;

export const RenameKnowledgeCollectionSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
  name: z.string().min(1).max(300),
});

export type RenameKnowledgeCollectionDto = z.infer<typeof RenameKnowledgeCollectionSchema>;

export const AddPageToCollectionSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
  pageId: z.string().min(1),
});

export type AddPageToCollectionDto = z.infer<typeof AddPageToCollectionSchema>;

export const RemovePageFromCollectionSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
  pageId: z.string().min(1),
});

export type RemovePageFromCollectionDto = z.infer<typeof RemovePageFromCollectionSchema>;

export const AddCollectionColumnSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
  column: CollectionColumnInputSchema,
});

export type AddCollectionColumnDto = z.infer<typeof AddCollectionColumnSchema>;

export const ArchiveKnowledgeCollectionSchema = AccountScopeSchema.extend({
  collectionId: z.string().min(1),
});

export type ArchiveKnowledgeCollectionDto = z.infer<typeof ArchiveKnowledgeCollectionSchema>;
