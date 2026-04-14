/**
 * Module: notion/subdomains/knowledge-database
 * Layer: application/dto
 * Purpose: Zod validation schemas for all database, record, and view commands.
 */

import { z } from "@lib-zod";

// ----- Shared scope -----

const WorkspaceScopeSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});

// ----- Database -----

export const CreateDatabaseSchema = WorkspaceScopeSchema.extend({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  createdByUserId: z.string().min(1),
});
export type CreateDatabaseDto = z.infer<typeof CreateDatabaseSchema>;

export const UpdateDatabaseSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  icon: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
});
export type UpdateDatabaseDto = z.infer<typeof UpdateDatabaseSchema>;

const FieldTypeSchema = z.enum([
  "text", "number", "select", "multi_select", "date",
  "checkbox", "url", "email", "relation", "formula", "rollup",
]);

export const AddFieldSchema = z.object({
  databaseId: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(100),
  type: FieldTypeSchema,
  config: z.record(z.string(), z.unknown()).optional(),
  required: z.boolean().optional(),
});
export type AddFieldDto = z.infer<typeof AddFieldSchema>;

export const ArchiveDatabaseSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type ArchiveDatabaseDto = z.infer<typeof ArchiveDatabaseSchema>;

export const GetDatabaseSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type GetDatabaseDto = z.infer<typeof GetDatabaseSchema>;

export const ListDatabasesSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});
export type ListDatabasesDto = z.infer<typeof ListDatabasesSchema>;

// ----- Record -----

export const CreateRecordSchema = WorkspaceScopeSchema.extend({
  databaseId: z.string().min(1),
  pageId: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  createdByUserId: z.string().min(1),
});
export type CreateRecordDto = z.infer<typeof CreateRecordSchema>;

export const UpdateRecordSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  properties: z.record(z.string(), z.unknown()),
});
export type UpdateRecordDto = z.infer<typeof UpdateRecordSchema>;

export const DeleteRecordSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type DeleteRecordDto = z.infer<typeof DeleteRecordSchema>;

export const ListRecordsSchema = z.object({
  accountId: z.string().min(1),
  databaseId: z.string().min(1),
});
export type ListRecordsDto = z.infer<typeof ListRecordsSchema>;

// ----- View -----

const ViewTypeSchema = z.enum(["table", "board", "list", "calendar", "timeline", "gallery"]);

export const CreateViewSchema = WorkspaceScopeSchema.extend({
  databaseId: z.string().min(1),
  name: z.string().min(1).max(200),
  type: ViewTypeSchema,
  createdByUserId: z.string().min(1),
});
export type CreateViewDto = z.infer<typeof CreateViewSchema>;

export const UpdateViewSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  filters: z.array(z.any()).optional(),
  sorts: z.array(z.any()).optional(),
  visibleFieldIds: z.array(z.string()).optional(),
  hiddenFieldIds: z.array(z.string()).optional(),
});
export type UpdateViewDto = z.infer<typeof UpdateViewSchema>;

export const DeleteViewSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type DeleteViewDto = z.infer<typeof DeleteViewSchema>;

export const ListViewsSchema = z.object({
  accountId: z.string().min(1),
  databaseId: z.string().min(1),
});
export type ListViewsDto = z.infer<typeof ListViewsSchema>;
