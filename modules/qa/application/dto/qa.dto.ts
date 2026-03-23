/**
 * Module: qa
 * Layer: application/dto
 * Purpose: Zod-validated input DTOs for QA use cases.
 */

import { z } from "@lib-zod";
import { QA_RUN_STATUSES, QA_TEST_RESULTS } from "../../domain/value-objects/qa-state";

// ── Shared ─────────────────────────────────────────────────────────────────────

export const QARunStatusSchema = z.enum(QA_RUN_STATUSES);
export const QATestResultSchema = z.enum(QA_TEST_RESULTS);

// ── TestCase DTOs ─────────────────────────────────────────────────────────────

export const CreateTestCaseInputSchema = z.object({
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
  workspaceId: z.string().min(1),
  taskId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  createdBy: z.string().min(1),
});

export type CreateTestCaseInputDto = z.infer<typeof CreateTestCaseInputSchema>;

// ── TestRun DTOs ──────────────────────────────────────────────────────────────

export const StartTestRunInputSchema = z.object({
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
  workspaceId: z.string().min(1),
  taskId: z.string().min(1),
  performedBy: z.string().min(1),
});

export type StartTestRunInputDto = z.infer<typeof StartTestRunInputSchema>;

export const RecordTestCaseResultInputSchema = z.object({
  testRunId: z.string().min(1),
  testCaseId: z.string().min(1),
  result: QATestResultSchema,
  note: z.string().max(2000).optional(),
});

export type RecordTestCaseResultInputDto = z.infer<typeof RecordTestCaseResultInputSchema>;
