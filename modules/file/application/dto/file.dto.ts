import type { File } from "../../domain/entities/File";

export interface WorkspaceFileListItemDto {
  readonly id: string;
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly name: string;
  readonly status: File["status"];
  readonly kind: File["classification"];
  readonly source: string;
  readonly detail: string;
  readonly href?: string;
}

export interface UploadInitFileInputDto {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly idempotencyKey?: string;
}

export interface UploadInitFileOutputDto {
  readonly fileId: string;
  readonly versionId: string;
  readonly uploadPath: string;
  readonly uploadToken: string;
  readonly expiresAtISO: string;
}

export interface UploadCompleteFileInputDto {
  readonly workspaceId: string;
  readonly organizationId: string;
  readonly actorAccountId: string;
  readonly fileId: string;
  readonly versionId: string;
}

export interface UploadCompleteFileOutputDto {
  readonly fileId: string;
  readonly versionId: string;
  readonly status: "active";
}
