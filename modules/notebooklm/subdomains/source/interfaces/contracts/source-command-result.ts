import type { SourceFileCommandErrorCode } from "../../application/dto/source-file.dto";

export type SourceFileCommandResult<TData> =
  | {
      readonly ok: true;
      readonly data: TData;
      readonly commandId: string;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: SourceFileCommandErrorCode;
        readonly message: string;
      };
      readonly commandId: string;
    };
