import type { SourceFileCommandErrorCode } from "../../../subdomains/source/application/dto/source-file.dto";

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
