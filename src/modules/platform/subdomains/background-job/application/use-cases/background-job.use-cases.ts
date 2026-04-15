import { v4 as randomUUID } from "@lib-uuid";
import type { DomainError } from "@shared-types";
import type { JobDocument } from "../../domain/entities/JobDocument";
import {
  canTransitionJobStatus,
  type BackgroundJob,
  type BackgroundJobStatus,
} from "../../domain/entities/BackgroundJob";
import type { BackgroundJobRepository } from "../../domain/repositories/BackgroundJobRepository";

export type JobResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: DomainError };

function ok<T>(data: T): JobResult<T> {
  return { ok: true, data };
}

function fail(code: string, message: string): JobResult<never> {
  return { ok: false, error: { code, message } };
}

export interface RegisterJobDocumentInput {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
}

export class RegisterJobDocumentUseCase {
  constructor(private readonly repo: BackgroundJobRepository) {}

  async execute(input: RegisterJobDocumentInput): Promise<JobResult<BackgroundJob>> {
    const organizationId = input.organizationId.trim();
    const workspaceId = input.workspaceId.trim();
    const sourceFileId = input.sourceFileId.trim();
    const title = input.title.trim();
    const mimeType = input.mimeType.trim();

    if (!organizationId) return fail("JOB_ORGANIZATION_REQUIRED", "Organization is required.");
    if (!workspaceId) return fail("JOB_WORKSPACE_REQUIRED", "Workspace is required.");
    if (!sourceFileId) return fail("JOB_SOURCE_FILE_REQUIRED", "Source file id is required.");
    if (!title) return fail("JOB_TITLE_REQUIRED", "Document title is required.");
    if (!mimeType) return fail("JOB_MIME_TYPE_REQUIRED", "Mime type is required.");

    const now = new Date().toISOString();
    const document: JobDocument = {
      id: randomUUID(),
      organizationId,
      workspaceId,
      sourceFileId,
      title,
      mimeType,
      createdAtISO: now,
      updatedAtISO: now,
    };

    const job: BackgroundJob = {
      id: randomUUID(),
      document,
      status: "uploaded",
      createdAtISO: now,
      updatedAtISO: now,
    };

    await this.repo.save(job);
    return ok(job);
  }
}

export interface AdvanceJobStageInput {
  readonly documentId: string;
  readonly nextStatus: BackgroundJobStatus;
  readonly statusMessage?: string;
}

export class AdvanceJobStageUseCase {
  constructor(private readonly repo: BackgroundJobRepository) {}

  async execute(input: AdvanceJobStageInput): Promise<JobResult<BackgroundJob>> {
    const documentId = input.documentId.trim();
    if (!documentId) return fail("JOB_DOCUMENT_REQUIRED", "Document id is required.");

    const job = await this.repo.findByDocumentId(documentId);
    if (!job) return fail("JOB_DOCUMENT_NOT_FOUND", "Job document not found.");

    if (!canTransitionJobStatus(job.status, input.nextStatus)) {
      return fail(
        "JOB_INVALID_STATUS_TRANSITION",
        `Cannot transition job status from '${job.status}' to '${input.nextStatus}'.`,
      );
    }

    const updated = await this.repo.updateStatus({
      documentId,
      status: input.nextStatus,
      statusMessage: input.statusMessage,
      updatedAtISO: new Date().toISOString(),
    });

    if (!updated) return fail("JOB_UPDATE_FAILED", "Failed to persist job status update.");
    return ok(updated);
  }
}

export interface ListWorkspaceJobsInput {
  readonly organizationId: string;
  readonly workspaceId: string;
}

export class ListWorkspaceJobsUseCase {
  constructor(private readonly repo: BackgroundJobRepository) {}

  async execute(input: ListWorkspaceJobsInput): Promise<readonly BackgroundJob[]> {
    return this.repo.listByWorkspace(input);
  }
}
