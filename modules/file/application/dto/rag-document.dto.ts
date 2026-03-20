export interface RegisterUploadedRagDocumentInputDto {
  readonly organizationId: string;
  readonly workspaceId: string;
  /** Account ID of the actor who uploaded this document. */
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

export type RegisterUploadedRagDocumentResult =
  | {
      ok: true;
      data: RegisterUploadedRagDocumentOutputDto;
      commandId: string;
    }
  | {
      ok: false;
      error: {
        code:
          | "RAG_ORGANIZATION_REQUIRED"
          | "RAG_WORKSPACE_REQUIRED"
          | "RAG_ACCOUNT_ID_REQUIRED"
          | "RAG_TITLE_REQUIRED"
          | "RAG_FILE_NAME_REQUIRED"
          | "RAG_MIME_TYPE_REQUIRED"
          | "RAG_STORAGE_PATH_REQUIRED";
        message: string;
      };
      commandId: string;
    };
