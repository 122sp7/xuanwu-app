/**
 * Module: notion/subdomains/collaboration
 * Layer: application/dto
 * Purpose: Zod schemas and DTO types for comment, version, and permission operations.
 */

import { z } from "@lib-zod";

const ContentScopeSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});

const SelectionRangeSchema = z.object({
  from: z.number().int().min(0),
  to: z.number().int().min(0),
});

// ── Comment ───────────────────────────────────────────────────────────────────

export const CreateCommentSchema = ContentScopeSchema.extend({
  contentId: z.string().min(1),
  contentType: z.enum(["page", "article"]),
  authorId: z.string().min(1),
  body: z.string().min(1).max(10000),
  parentCommentId: z.string().min(1).nullable().optional(),
  blockId: z.string().min(1).nullable().optional(),
  mentionedUserIds: z.array(z.string().min(1)).optional(),
  selectionRange: SelectionRangeSchema.nullable().optional(),
});
export type CreateCommentDto = z.infer<typeof CreateCommentSchema>;

export const UpdateCommentSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  body: z.string().min(1).max(10000),
});
export type UpdateCommentDto = z.infer<typeof UpdateCommentSchema>;

export const ResolveCommentSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  resolvedByUserId: z.string().min(1),
});
export type ResolveCommentDto = z.infer<typeof ResolveCommentSchema>;

export const DeleteCommentSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type DeleteCommentDto = z.infer<typeof DeleteCommentSchema>;

// ── Version ───────────────────────────────────────────────────────────────────

export const CreateVersionSchema = ContentScopeSchema.extend({
  contentId: z.string().min(1),
  contentType: z.enum(["page", "article"]),
  snapshotBlocks: z.array(z.unknown()),
  label: z.string().min(1).max(200).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  createdByUserId: z.string().min(1),
});
export type CreateVersionDto = z.infer<typeof CreateVersionSchema>;

export const DeleteVersionSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type DeleteVersionDto = z.infer<typeof DeleteVersionSchema>;

// ── Permission ────────────────────────────────────────────────────────────────

export const GrantPermissionSchema = ContentScopeSchema.extend({
  subjectId: z.string().min(1),
  subjectType: z.enum(["page", "article", "database"]),
  principalId: z.string().min(1),
  principalType: z.enum(["user", "team", "public", "link"]),
  level: z.enum(["view", "comment", "edit", "full"]),
  grantedByUserId: z.string().min(1),
  expiresAtISO: z.string().datetime().nullable().optional(),
  linkToken: z.string().min(1).nullable().optional(),
});
export type GrantPermissionDto = z.infer<typeof GrantPermissionSchema>;

export const RevokePermissionSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
export type RevokePermissionDto = z.infer<typeof RevokePermissionSchema>;
