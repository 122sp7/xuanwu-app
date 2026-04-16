/**
 * shared-validators
 *
 * Generic utility validation schemas with no business semantics.
 * Only infrastructure/utility schemas belong here.
 *
 * Rules (Discussion 07):
 * - Business domain schemas (taskSchema, createWorkspaceSchema) belong in
 *   src/modules/<context>/domain/ — not in packages/
 * - Auth input schemas (signInSchema, registerSchema) belong in
 *   src/modules/iam/subdomains/authentication/application/
 * - This package must remain independent of any application module
 */

import { z } from "zod";

export const idSchema = z.string().uuid();

// Generic pagination utility — no business semantics, safe in packages/
// Note: .default() fills missing fields during .parse(). Use .optional() instead
// if you need strict validation without automatic default injection.
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// Domain schemas previously misplaced here have been removed:
//   taskSchema          → src/modules/workspace/subdomains/task/domain/
//   createWorkspaceSchema → src/modules/workspace/subdomains/lifecycle/domain/
//   signInSchema        → src/modules/iam/subdomains/authentication/application/
//   registerSchema      → src/modules/iam/subdomains/authentication/application/
