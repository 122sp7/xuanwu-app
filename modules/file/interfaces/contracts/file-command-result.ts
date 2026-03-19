export type FileCommandErrorCode =
  | "FILE_WORKSPACE_REQUIRED"
  | "FILE_ORGANIZATION_REQUIRED"
  | "FILE_ACTOR_REQUIRED"
  | "FILE_NAME_REQUIRED"
  | "FILE_ID_REQUIRED"
  | "FILE_VERSION_REQUIRED"
  | "FILE_VERSION_NOT_FOUND"
  | "FILE_INVALID_SIZE"
  | "FILE_NOT_FOUND"
  | "FILE_SCOPE_MISMATCH"
  | "FILE_STATUS_CONFLICT"
  | "FILE_RAG_REGISTRATION_FAILED";

export type FileCommandResult<TData> =
  | {
      ok: true;
      data: TData;
      commandId: string;
    }
  | {
      ok: false;
      error: {
        code: FileCommandErrorCode;
        message: string;
      };
      commandId: string;
    };
