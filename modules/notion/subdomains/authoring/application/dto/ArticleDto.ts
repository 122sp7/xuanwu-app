/**
 * Module: notion/subdomains/authoring
 * Layer: application/dto
 * Purpose: Zod schemas for Article CQRS inputs.
 */

import { z } from "@lib-zod";

const AccountScopeSchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
});

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

export const DeleteArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});

export const VerifyArticleSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  verifiedByUserId: z.string().min(1),
  expiresAtISO: z.string().optional(),
});

export const RequestArticleReviewSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
