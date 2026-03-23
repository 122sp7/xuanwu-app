/**
 * Module: task
 * Layer: application/dto
 * Purpose: Zod-validated input/output DTOs for Task use cases.
 *
 * Validation lives at the application boundary (use-case input).
 * The domain layer never imports Zod — it uses plain TypeScript types.
 */

import { z } from "@lib-zod";
import { TASK_LIFECYCLE_STATUSES } from "../../domain/value-objects/task-state";

// ── Shared validators ─────────────────────────────────────────────────────────

export const TaskLifecycleStatusSchema = z.enum(TASK_LIFECYCLE_STATUSES);

/** Tenant/team scope required on every mutating operation. */
const TenantScopeSchema = z.object({
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
  workspaceId: z.string().min(1),
});

// ── Create ────────────────────────────────────────────────────────────────────

export const CreateTaskInputSchema = TenantScopeSchema.extend({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  assigneeId: z.string().min(1).optional(),
  /** Expected ISO-8601 date string (e.g. 2025-12-31). */
  dueDateISO: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

// ── Update ────────────────────────────────────────────────────────────────────

export const UpdateTaskInputSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  assigneeId: z.string().min(1).optional(),
  dueDateISO: z.string().optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;

// ── Status transition ─────────────────────────────────────────────────────────

export const TransitionTaskStatusInputSchema = z.object({
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
  workspaceId: z.string().min(1),
  taskId: z.string().min(1),
  to: TaskLifecycleStatusSchema,
});

export type TransitionTaskStatusInput = z.infer<typeof TransitionTaskStatusInputSchema>;
