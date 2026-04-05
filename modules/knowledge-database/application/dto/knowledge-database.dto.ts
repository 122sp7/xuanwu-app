/**
 * Module: knowledge-database
 * Layer: application/dto
 */

import { z } from "@lib-zod";

const WorkspaceScopeSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});

const FieldTypeSchema = z.enum([
  "text", "number", "select", "multi_select", "date",
  "checkbox", "url", "email", "relation", "formula", "rollup",
]);

const ViewTypeSchema = z.enum(["table", "board", "list", "calendar", "timeline", "gallery"]);

// ── Database ──────────────────────────────────────────────────────────────────

export const CreateDatabaseSchema = WorkspaceScopeSchema.extend({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  createdByUserId: z.string().min(1),
});
export type CreateDatabaseDto = z.infer<typeof CreateDatabaseSchema>;

export const UpdateDatabaseSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  icon: z.string().max(100).nullable().optional(),
  coverImageUrl: z.string().url().nullable().optional(),
});
export type UpdateDatabaseDto = z.infer<typeof UpdateDatabaseSchema>;

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

// ── Record ────────────────────────────────────────────────────────────────────

export const CreateRecordSchema = WorkspaceScopeSchema.extend({
  databaseId: z.string().min(1),
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

// ── View ──────────────────────────────────────────────────────────────────────

export const CreateViewSchema = WorkspaceScopeSchema.extend({
  databaseId: z.string().min(1),
  name: z.string().min(1).max(100),
  type: ViewTypeSchema,
  createdByUserId: z.string().min(1),
});
export type CreateViewDto = z.infer<typeof CreateViewSchema>;

export const UpdateViewSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(100).optional(),
  filters: z.array(z.object({
    fieldId: z.string(),
    operator: z.enum(["eq","neq","contains","not_contains","is_empty","is_not_empty","gt","lt"]),
    value: z.unknown(),
  })).optional(),
  sorts: z.array(z.object({
    fieldId: z.string(),
    direction: z.enum(["asc","desc"]),
  })).optional(),
  visibleFieldIds: z.array(z.string()).optional(),
  hiddenFieldIds: z.array(z.string()).optional(),
});
export type UpdateViewDto = z.infer<typeof UpdateViewSchema>;

export const DeleteViewSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type DeleteViewDto = z.infer<typeof DeleteViewSchema>;
