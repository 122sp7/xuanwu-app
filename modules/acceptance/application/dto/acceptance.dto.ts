/**
 * Module: acceptance
 * Layer: application/dto
 * Purpose: Zod-validated input DTOs for Acceptance use cases.
 */

import { z } from "@lib-zod";
import { ACCEPTANCE_STATUSES } from "../../domain/value-objects/acceptance-state";

// ── Shared ─────────────────────────────────────────────────────────────────────

export const AcceptanceStatusSchema = z.enum(ACCEPTANCE_STATUSES);

// ── Create ─────────────────────────────────────────────────────────────────────

export const AcceptanceLineItemInputSchema = z.object({
  description: z.string().min(1).max(500),
});

export const CreateAcceptanceRecordInputSchema = z.object({
  tenantId: z.string().min(1),
  teamId: z.string().min(1),
  workspaceId: z.string().min(1),
  taskId: z.string().min(1),
  items: z.array(AcceptanceLineItemInputSchema).min(1),
});

export type CreateAcceptanceRecordInputDto = z.infer<typeof CreateAcceptanceRecordInputSchema>;

// ── Sign / approve ─────────────────────────────────────────────────────────────

export const SignAcceptanceInputSchema = z.object({
  acceptanceId: z.string().min(1),
  signedBy: z.string().min(1),
  signedAtISO: z.string().min(1),
});

export type SignAcceptanceInputDto = z.infer<typeof SignAcceptanceInputSchema>;

// ── Reject ─────────────────────────────────────────────────────────────────────

export const RejectAcceptanceInputSchema = z.object({
  acceptanceId: z.string().min(1),
  rejectionReason: z.string().min(1).max(2000),
});

export type RejectAcceptanceInputDto = z.infer<typeof RejectAcceptanceInputSchema>;
