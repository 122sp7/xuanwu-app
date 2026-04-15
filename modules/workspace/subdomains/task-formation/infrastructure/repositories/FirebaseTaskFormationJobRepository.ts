/**
 * @module task-formation/infrastructure/repositories
 * @file FirebaseTaskFormationJobRepository.ts
 * @description Firestore implementation of TaskFormationJobRepository.
 */

import { v7 as generateId } from "@lib-uuid";
import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import type {
  CompleteTaskFormationJobInput,
  CreateTaskFormationJobInput,
  TaskFormationJob,
} from "../../domain/entities/TaskFormationJob";
import type { TaskFormationJobRepository } from "../../domain/repositories/TaskFormationJobRepository";
import { toTaskFormationJob } from "../firebase/task-formation-job.converter";
import { TF_JOBS_COLLECTION } from "../firebase/collections";

export class FirebaseTaskFormationJobRepository
  implements TaskFormationJobRepository
{
  private path(jobId: string): string {
    return `${TF_JOBS_COLLECTION}/${jobId}`;
  }

  async create(input: CreateTaskFormationJobInput): Promise<TaskFormationJob> {
    const nowISO = new Date().toISOString();
    const jobId = generateId();
    const docData: Record<string, unknown> = {
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      correlationId: input.correlationId,
      knowledgePageIds: [...input.knowledgePageIds],
      totalItems: input.knowledgePageIds.length,
      processedItems: 0,
      succeededItems: 0,
      failedItems: 0,
      status: "queued",
      startedAtISO: null,
      completedAtISO: null,
      errorCode: null,
      errorMessage: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
    await firestoreInfrastructureApi.set(this.path(jobId), docData);
    return toTaskFormationJob(jobId, docData);
  }

  async findById(jobId: string): Promise<TaskFormationJob | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(
      this.path(jobId),
    );
    if (!data) return null;
    return toTaskFormationJob(jobId, data);
  }

  async findByWorkspaceId(workspaceId: string): Promise<TaskFormationJob[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<
      Record<string, unknown>
    >(
      TF_JOBS_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
      { orderBy: [{ field: "updatedAtISO", direction: "desc" }], limit: 50 },
    );
    return docs.map((doc) => toTaskFormationJob(doc.id, doc.data));
  }

  async markRunning(jobId: string): Promise<TaskFormationJob | null> {
    const nowISO = new Date().toISOString();
    await firestoreInfrastructureApi.update(this.path(jobId), {
      status: "running",
      startedAtISO: nowISO,
      updatedAtISO: nowISO,
      errorCode: null,
      errorMessage: null,
    });
    return this.findById(jobId);
  }

  async markCompleted(
    jobId: string,
    input: CompleteTaskFormationJobInput,
  ): Promise<TaskFormationJob | null> {
    const nowISO = new Date().toISOString();
    const status = input.failedItems > 0 ? "partially_succeeded" : "succeeded";
    await firestoreInfrastructureApi.update(this.path(jobId), {
      processedItems: input.processedItems,
      succeededItems: input.succeededItems,
      failedItems: input.failedItems,
      status,
      completedAtISO: nowISO,
      updatedAtISO: nowISO,
      errorCode: null,
      errorMessage: null,
    });
    return this.findById(jobId);
  }

  async markFailed(
    jobId: string,
    errorCode: string,
    errorMessage: string,
  ): Promise<TaskFormationJob | null> {
    const nowISO = new Date().toISOString();
    await firestoreInfrastructureApi.update(this.path(jobId), {
      status: "failed",
      completedAtISO: nowISO,
      updatedAtISO: nowISO,
      errorCode,
      errorMessage,
    });
    return this.findById(jobId);
  }
}
