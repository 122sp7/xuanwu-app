import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";

import type { WorkDemand } from "../../domain/types";
import type { DemandRepository } from "../../domain/repository";

const DEMANDS_COLLECTION = "workspacePlannerDemands";

function toWorkDemand(id: string, data: Record<string, unknown>): WorkDemand {
  const status = data.status;
  const priority = data.priority;

  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    requesterId: typeof data.requesterId === "string" ? data.requesterId : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status:
      status === "draft" || status === "open" || status === "in_progress" || status === "completed"
        ? status
        : "draft",
    priority: priority === "low" || priority === "medium" || priority === "high" ? priority : "medium",
    scheduledAt: typeof data.scheduledAt === "string" ? data.scheduledAt : "",
    assignedUserId: typeof data.assignedUserId === "string" ? data.assignedUserId : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseDemandRepository implements DemandRepository {
  private demandPath(id: string): string {
    return `${DEMANDS_COLLECTION}/${id}`;
  }

  async listByWorkspace(workspaceId: string): Promise<WorkDemand[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      DEMANDS_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    return docs
      .map((item) => toWorkDemand(item.id, item.data))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async listByAccount(accountId: string): Promise<WorkDemand[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      DEMANDS_COLLECTION,
      [{ field: "accountId", op: "==", value: accountId }],
    );
    return docs
      .map((item) => toWorkDemand(item.id, item.data))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async save(demand: WorkDemand): Promise<void> {
    const path = this.demandPath(demand.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (existing) {
      await this.update(demand);
      return;
    }

    await firestoreInfrastructureApi.set(path, {
      workspaceId: demand.workspaceId,
      accountId: demand.accountId,
      requesterId: demand.requesterId,
      title: demand.title,
      description: demand.description,
      status: demand.status,
      priority: demand.priority,
      scheduledAt: demand.scheduledAt,
      assignedUserId: demand.assignedUserId ?? null,
      createdAtISO: demand.createdAtISO,
      updatedAtISO: demand.updatedAtISO,
    });
  }

  async update(demand: WorkDemand): Promise<void> {
    await firestoreInfrastructureApi.update(this.demandPath(demand.id), {
      workspaceId: demand.workspaceId,
      accountId: demand.accountId,
      requesterId: demand.requesterId,
      title: demand.title,
      description: demand.description,
      status: demand.status,
      priority: demand.priority,
      scheduledAt: demand.scheduledAt,
      assignedUserId: demand.assignedUserId ?? null,
      updatedAtISO: demand.updatedAtISO,
    });
  }

  async findById(id: string): Promise<WorkDemand | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.demandPath(id));
    if (!data) return null;
    return toWorkDemand(id, data);
  }
}

