/**
 * Module: notebooklm/subdomains/source
 * Layer: application/dto
 * Purpose: DTOs for RagDocument registration use-case I/O.
 */

import type { RagDocumentStatus } from "../../domain/entities/RagDocument";

export interface RegisterUploadedRagDocumentInputDto {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly sizeBytes?: number;
  readonly checksum?: string;
  readonly taxonomy?: string;
  readonly category?: string;
  readonly department?: string;
  readonly tags?: readonly string[];
  readonly language?: string;
  readonly accessControl?: readonly string[];
  readonly versionGroupId?: string;
  readonly versionNumber?: number;
  readonly updateLog?: string;
  readonly expiresAtISO?: string;
}

export interface RegisterUploadedRagDocumentOutputDto {
  readonly documentId: string;
  readonly status: "uploaded";
  readonly registeredAtISO: string;
}

export type RegisterUploadedRagDocumentErrorCode =
  | "RAG_ORGANIZATION_REQUIRED"
  | "RAG_WORKSPACE_REQUIRED"
  | "RAG_ACCOUNT_ID_REQUIRED"
  | "RAG_TITLE_REQUIRED"
  | "RAG_FILE_NAME_REQUIRED"
  | "RAG_MIME_TYPE_REQUIRED"
  | "RAG_STORAGE_PATH_REQUIRED";

export type RegisterUploadedRagDocumentResult =
  | { ok: true; data: RegisterUploadedRagDocumentOutputDto; commandId: string }
  | {
      ok: false;
      error: { code: RegisterUploadedRagDocumentErrorCode; message: string };
      commandId: string;
    };

export interface ListSourceDocumentsInputDto {
  readonly organizationId: string;
  readonly workspaceId: string;
}

export interface SourceDocumentListItemDto {
  readonly id: string;
  readonly displayName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly status: RagDocumentStatus;
  readonly statusMessage?: string;
  readonly taxonomy?: string;
  readonly language?: string;
  readonly versionNumber: number;
  readonly isLatest: boolean;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
