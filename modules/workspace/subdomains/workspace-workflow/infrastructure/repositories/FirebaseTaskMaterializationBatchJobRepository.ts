/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseTaskMaterializationBatchJobRepository.ts
 * @description Firestore implementation for TaskMaterializationBatchJobRepository.
 */

import { v7 as generateId } from "@lib-uuid";
import { firestoreInfrastructureApi } from "@/modules/platform/api";
import type {
  CompleteTaskMaterializationBatchJobInput,
  CreateTaskMaterializationBatchJobInput,
  TaskMaterializationBatchJob,
} from "../../domain/entities/TaskMaterializationBatchJob";
import type { TaskMaterializationBatchJobRepository } from "../../domain/repositories/TaskMaterializationBatchJobRepository";
import { toTaskMaterializationBatchJob } from "../firebase/task-materialization-batch-job.converter";
import { WF_TASK_MATERIALIZATION_BATCH_JOBS_COLLECTION } from "../firebase/workspace-flow.collections";

export class FirebaseTaskMaterializationBatchJobRepository implements TaskMaterializationBatchJobRepository {
  private path(jobId: string): string {
    return `${WF_TASK_MATERIALIZATION_BATCH_JOBS_COLLECTION}/${jobId}`;
  }

  async create(input: CreateTaskMaterializationBatchJobInput): Promise<TaskMaterializationBatchJob> {
    const nowISO = new Date().toISOString();
    const jobId = generateId();
    const totalItems = input.knowledgePageIds.length;
    const docData: Record<string, unknown> = {
      workspaceId: input.workspaceId,
      actorId: input.actorId,
      correlationId: input.correlationId,
      knowledgePageIds: [...input.knowledgePageIds],
      totalItems,
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
    return toTaskMaterializationBatchJob(jobId, docData);
  }

  async findById(jobId: string): Promise<TaskMaterializationBatchJob | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.path(jobId));
    if (!data) return null;
    return toTaskMaterializationBatchJob(jobId, data);
  }

  async findByWorkspaceId(workspaceId: string): Promise<TaskMaterializationBatchJob[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_TASK_MATERIALIZATION_BATCH_JOBS_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
      { orderBy: [{ field: "updatedAtISO", direction: "desc" }], limit: 50 },
    );
    return docs.map((doc) => toTaskMaterializationBatchJob(doc.id, doc.data));
  }

  async markRunning(jobId: string): Promise<TaskMaterializationBatchJob | null> {
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
    input: CompleteTaskMaterializationBatchJobInput,
  ): Promise<TaskMaterializationBatchJob | null> {
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

  async markFailed(jobId: string, errorCode: string, errorMessage: string): Promise<TaskMaterializationBatchJob | null> {
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
