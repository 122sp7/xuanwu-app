/**
 * Module: knowledge-base
 * Layer: application/dto
 * Zod schemas for Article and Category CQRS inputs.
 */

import { z } from "@lib-zod";

const AccountScopeSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});

// ─── Article DTOs ──────────────────────────────────────────────────────────────

export const CreateArticleSchema = AccountScopeSchema.extend({
  title: z.string().min(1).max(256),
  content: z.string().default(""),
  categoryId: z.string().nullable().default(null),
  tags: z.array(z.string()).default([]),
  createdByUserId: z.string().min(1),
});

export const UpdateArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  title: z.string().min(1).max(256).optional(),
  content: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export const PublishArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});

export const ArchiveArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});

export const VerifyArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  verifiedByUserId: z.string().min(1),
  expiresInDays: z.number().int().positive().optional(),
});

export const RequestArticleReviewSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});

export const DeleteArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});

// ─── Category DTOs ─────────────────────────────────────────────────────────────

export const CreateCategorySchema = AccountScopeSchema.extend({
  name: z.string().min(1).max(128),
  slug: z.string().min(1).max(128),
  parentCategoryId: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
  createdByUserId: z.string().min(1),
});

export const RenameCategorySchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  name: z.string().min(1).max(128),
});

export const MoveCategorySchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  parentCategoryId: z.string().nullable(),
});

export const DeleteCategorySchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
