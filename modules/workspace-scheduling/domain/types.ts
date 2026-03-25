/**
 * Module: workspace-scheduling
 * Layer: domain
 * Purpose: Core WorkDemand entity and value types.
 *
 * Occam's Razor: minimal essential entities only.
 * No external dependencies — pure TypeScript.
 */

// ── Status ────────────────────────────────────────────────────────────────────

export type DemandStatus = "draft" | "open" | "in_progress" | "completed";

export const DEMAND_STATUSES: readonly DemandStatus[] = [
  "draft",
  "open",
  "in_progress",
  "completed",
] as const;

export const DEMAND_STATUS_LABELS: Record<DemandStatus, string> = {
  draft: "草稿",
  open: "待處理",
  in_progress: "進行中",
  completed: "已完成",
};

// ── Priority ──────────────────────────────────────────────────────────────────

export type DemandPriority = "low" | "medium" | "high";

export const DEMAND_PRIORITIES: readonly DemandPriority[] = [
  "low",
  "medium",
  "high",
] as const;

export const DEMAND_PRIORITY_LABELS: Record<DemandPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

// ── Aggregate root: WorkDemand ────────────────────────────────────────────────

/**
 * WorkDemand aggregate root.
 * Represents a scheduled work request from a Workspace to the Account.
 *
 * Inspired by Postiz "Launch" concept — a demand is a unit of work
 * scheduled for a target date, with status progression.
 */
export interface WorkDemand {
  readonly id: string;
  /** Tenant scoping: which workspace raised this demand. */
  readonly workspaceId: string;
  /** Account (organisation) this demand belongs to. */
  readonly accountId: string;
  /** User ID of whoever created this demand. */
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly status: DemandStatus;
  readonly priority: DemandPriority;
  /**
   * Target date for the demand (ISO date string, e.g. "2026-04-15").
   * Rendered on the calendar widget.
   */
  readonly scheduledAt: string;
  /** Account-level member assigned to handle this demand. */
  readonly assignedUserId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Commands ──────────────────────────────────────────────────────────────────

export interface CreateWorkDemandCommand {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
}

export interface AssignWorkDemandCommand {
  readonly demandId: string;
  readonly assignedUserId: string;
  readonly assignedBy: string;
}

// ── Domain Events ─────────────────────────────────────────────────────────────

export type WorkDemandCreatedEvent = {
  readonly type: "WORK_DEMAND_CREATED";
  readonly payload: { readonly demandId: string; readonly workspaceId: string };
};

export type WorkDemandAssignedEvent = {
  readonly type: "WORK_DEMAND_ASSIGNED";
  readonly payload: {
    readonly demandId: string;
    readonly assignedUserId: string;
    readonly assignedBy: string;
  };
};

export type WorkDemandDomainEvent =
  | WorkDemandCreatedEvent
  | WorkDemandAssignedEvent;
