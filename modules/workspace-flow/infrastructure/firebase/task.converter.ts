/**
 * @module workspace-flow/infrastructure/firebase
 * @file task.converter.ts
 * @description Firestore document-to-entity converter for Task.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Harden unknown field handling with stricter runtime validation
 */

import type { Task } from "../../domain/entities/Task";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import type { SourceReference } from "../../domain/value-objects/SourceReference";

const VALID_STATUSES = new Set<TaskStatus>(TASK_STATUSES);
const DEFAULT_STATUS: TaskStatus = "draft";

function toSourceReference(raw: unknown): SourceReference | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  if (r.type !== "ContentPage") return undefined;
  if (typeof r.id !== "string" || typeof r.causationId !== "string" || typeof r.correlationId !== "string") return undefined;
  return { type: "ContentPage", id: r.id, causationId: r.causationId, correlationId: r.correlationId };
}

/**
 * Converts a raw Firestore document data map into a typed Task entity.
 *
 * @param id   - Firestore document ID
 * @param data - Raw document fields from Firestore
 */
export function toTask(id: string, data: Record<string, unknown>): Task {
  const rawStatus = data.status as TaskStatus;
  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    assigneeId: typeof data.assigneeId === "string" ? data.assigneeId : undefined,
    dueDateISO: typeof data.dueDateISO === "string" ? data.dueDateISO : undefined,
    acceptedAtISO: typeof data.acceptedAtISO === "string" ? data.acceptedAtISO : undefined,
    archivedAtISO: typeof data.archivedAtISO === "string" ? data.archivedAtISO : undefined,
    sourceReference: toSourceReference(data.sourceReference),
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}
