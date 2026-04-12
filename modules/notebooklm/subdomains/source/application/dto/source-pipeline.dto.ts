import type {
  ParseSourceDocumentInput,
  ParseSourceDocumentOutput,
  ReindexSourceDocumentInput,
  ReindexSourceDocumentOutput,
} from "../../domain/ports/ISourcePipelinePort";

export interface SourcePipelineError {
  readonly code: "SOURCE_PIPELINE_INVALID_INPUT" | "SOURCE_PIPELINE_EXECUTION_FAILED";
  readonly message: string;
}

export type SourcePipelineResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: SourcePipelineError };

export type ParseSourceDocumentInputDto = ParseSourceDocumentInput;
export type ParseSourceDocumentOutputDto = ParseSourceDocumentOutput;
export type ReindexSourceDocumentInputDto = ReindexSourceDocumentInput;
export type ReindexSourceDocumentOutputDto = ReindexSourceDocumentOutput;
