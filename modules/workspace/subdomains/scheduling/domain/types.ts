/**
 * Module: workspace/subdomains/scheduling
 * Layer: domain
 * Purpose: Core WorkDemand entity and value types.
 */

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

export interface WorkDemand {
  readonly id: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly requesterId: string;
  readonly title: string;
  readonly description: string;
  readonly status: DemandStatus;
  readonly priority: DemandPriority;
  readonly scheduledAt: string;
  readonly assignedUserId?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

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

