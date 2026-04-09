/**
 * Ingestion Use Cases — application-layer orchestration for IngestionJob domain operations.
 *
 * Each use case receives its repository dependency via constructor injection,
 * keeping it testable and decoupled from any specific adapter.
 *
 * Return type uses a locally-defined IngestionResult<T> rather than the
 * command-only CommandResult, because creation and advancement operations
 * need to surface the resulting IngestionJob entity to callers.
 */

import { randomUUID } from "node:crypto";

import type { DomainError } from "@shared-types";

import type { IngestionDocument } from "../../domain/entities/IngestionDocument";
import { canTransitionIngestionStatus, type IngestionJob, type IngestionStatus } from "../../domain/entities/IngestionJob";
import type { IIngestionJobRepository } from "../../domain/repositories/IIngestionJobRepository";

// ── Shared result type ────────────────────────────────────────────────────────

export type IngestionResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: DomainError };

function ok<T>(data: T): IngestionResult<T> {
  return { ok: true, data };
}

function fail(code: string, message: string): IngestionResult<never> {
  return { ok: false, error: { code, message } };
}

// ── Register Ingestion Document ───────────────────────────────────────────────

export interface RegisterIngestionDocumentInput {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
}

export class RegisterIngestionDocumentUseCase {
  constructor(private readonly repo: IIngestionJobRepository) {}

  async execute(input: RegisterIngestionDocumentInput): Promise<IngestionResult<IngestionJob>> {
    const organizationId = input.organizationId.trim();
    const workspaceId    = input.workspaceId.trim();
    const sourceFileId   = input.sourceFileId.trim();
    const title          = input.title.trim();
    const mimeType       = input.mimeType.trim();

    if (!organizationId) return fail("INGESTION_ORGANIZATION_REQUIRED", "Organization is required.");
    if (!workspaceId)    return fail("INGESTION_WORKSPACE_REQUIRED",    "Workspace is required.");
    if (!sourceFileId)   return fail("INGESTION_SOURCE_FILE_REQUIRED",  "Source file id is required.");
    if (!title)          return fail("INGESTION_TITLE_REQUIRED",        "Document title is required.");
    if (!mimeType)       return fail("INGESTION_MIME_TYPE_REQUIRED",    "Mime type is required.");

    const now = new Date().toISOString();

    const document: IngestionDocument = {
      id: randomUUID(),
      organizationId,
      workspaceId,
      sourceFileId,
      title,
      mimeType,
      createdAtISO: now,
      updatedAtISO: now,
    };

    const job: IngestionJob = {
      id:           randomUUID(),
      document,
      status:       "uploaded",
      createdAtISO: now,
      updatedAtISO: now,
    };

    await this.repo.save(job);
    return ok(job);
  }
}

// ── Advance Ingestion Stage ───────────────────────────────────────────────────

export interface AdvanceIngestionStageInput {
  readonly documentId: string;
  readonly nextStatus: IngestionStatus;
  readonly statusMessage?: string;
}

export class AdvanceIngestionStageUseCase {
  constructor(private readonly repo: IIngestionJobRepository) {}

  async execute(input: AdvanceIngestionStageInput): Promise<IngestionResult<IngestionJob>> {
    const documentId = input.documentId.trim();

    if (!documentId) return fail("INGESTION_DOCUMENT_REQUIRED", "Document id is required.");

    const job = await this.repo.findByDocumentId(documentId);
    if (!job) return fail("INGESTION_DOCUMENT_NOT_FOUND", "Ingestion document not found.");

    if (!canTransitionIngestionStatus(job.status, input.nextStatus)) {
      return fail(
        "INGESTION_INVALID_STATUS_TRANSITION",
        `Cannot transition ingestion status from '${job.status}' to '${input.nextStatus}'.`,
      );
    }

    const updated = await this.repo.updateStatus({
      documentId,
      status:        input.nextStatus,
      statusMessage: input.statusMessage,
      updatedAtISO:  new Date().toISOString(),
    });

    if (!updated) return fail("INGESTION_UPDATE_FAILED", "Failed to persist ingestion status update.");

    return ok(updated);
  }
}

// ── List Workspace Ingestion Jobs ─────────────────────────────────────────────

export interface ListWorkspaceIngestionJobsInput {
  readonly organizationId: string;
  readonly workspaceId: string;
}

export class ListWorkspaceIngestionJobsUseCase {
  constructor(private readonly repo: IIngestionJobRepository) {}

  async execute(input: ListWorkspaceIngestionJobsInput): Promise<readonly IngestionJob[]> {
    return this.repo.listByWorkspace(input);
  }
}
