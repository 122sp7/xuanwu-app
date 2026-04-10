import type { DemandPriority } from "../../domain/types";

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
