/**
 * Module: workspace-planner
 * Layer: api/schema
 * Purpose: Zod validation schemas for WorkDemand commands.
 *
 * This is the boundary guard — all input from UI must be validated here
 * before reaching the application layer.
 */

import { z } from "@lib-zod";

// ── CreateDemand ──────────────────────────────────────────────────────────────

export const CreateDemandSchema = z.object({
  workspaceId: z.string().min(1, "workspaceId is required"),
  accountId: z.string().min(1, "accountId is required"),
  requesterId: z.string().min(1, "requesterId is required"),
  title: z.string().min(2, "標題至少需要 2 個字"),
  description: z.string().optional().default(""),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  scheduledAt: z.string().min(1, "請選擇排程日期"),
});

export type CreateDemandInput = z.infer<typeof CreateDemandSchema>;

// ── AssignMember ──────────────────────────────────────────────────────────────

export const AssignMemberSchema = z.object({
  demandId: z.string().min(1, "demandId is required"),
  userId: z.string().min(1, "userId is required"),
  assignedBy: z.string().min(1, "assignedBy is required"),
});

export type AssignMemberInput = z.infer<typeof AssignMemberSchema>;
