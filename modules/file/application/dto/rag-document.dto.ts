export interface RegisterUploadedRagDocumentInputDto {
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly checksum?: string;
  readonly taxonomy?: string;
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
          | "RAG_TENANT_REQUIRED"
          | "RAG_WORKSPACE_REQUIRED"
          | "RAG_TITLE_REQUIRED"
          | "RAG_FILE_NAME_REQUIRED"
          | "RAG_MIME_TYPE_REQUIRED"
          | "RAG_STORAGE_PATH_REQUIRED";
        message: string;
      };
      commandId: string;
    };
