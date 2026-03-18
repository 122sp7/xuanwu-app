export type FileCommandResult<TData> =
  | {
      ok: true;
      data: TData;
      commandId: string;
    }
  | {
      ok: false;
      error: {
        code:
          | "FILE_WORKSPACE_REQUIRED"
          | "FILE_ORGANIZATION_REQUIRED"
          | "FILE_ACTOR_REQUIRED"
          | "FILE_NAME_REQUIRED"
          | "FILE_INVALID_SIZE"
          | "FILE_UPLOAD_INIT_NOT_IMPLEMENTED";
        message: string;
      };
      commandId: string;
    };

