/**
 * Application-layer DTO re-exports for the scheduling subdomain.
 * Interfaces must import from here, not from domain/ directly.
 */
export type { WorkDemand, DemandPriority, DemandStatus } from "../../domain/types";

import type { DemandStatus, DemandPriority } from "../../domain/types";

/**
 * UI presentation label mappings.
 * Defined at the application layer (not domain) because they are
 * locale-specific display concerns, not business invariants.
 */
export const DEMAND_STATUS_LABELS: Record<DemandStatus, string> = {
  draft: "草稿",
  open: "待處理",
  in_progress: "進行中",
  completed: "已完成",
};

export const DEMAND_PRIORITY_LABELS: Record<DemandPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

export interface CreateDemandInput {
  workspaceId: string;
  accountId: string;
  requesterId: string;
  title: string;
  description?: string;
  priority: DemandPriority;
  scheduledAt: string;
}

export interface AssignMemberInput {
  demandId: string;
  userId: string;
  assignedBy: string;
}
