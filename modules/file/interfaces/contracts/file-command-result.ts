import type { FileCommandErrorCode } from "../../application/dto/file.dto";

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
