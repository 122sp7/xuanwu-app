/**
 * Module: notion/subdomains/authoring
 * Layer: application/dto
 * Purpose: Zod schemas for Category CQRS inputs.
 */

import { z } from "@lib-zod";

export const CreateCategorySchema = z.object({
  accountId: z.string().min(1),
  workspaceId: z.string().min(1),
  name: z.string().min(1).max(128),
  parentCategoryId: z.string().nullable().default(null),
  depth: z.number().int().min(0).default(0),
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
  newParentCategoryId: z.string().nullable(),
  newDepth: z.number().int().min(0),
});

export const DeleteCategorySchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
});
