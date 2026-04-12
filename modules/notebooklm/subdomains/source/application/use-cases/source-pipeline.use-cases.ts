import type { ISourcePipelinePort } from "../../domain/ports/ISourcePipelinePort";
import type {
  ParseSourceDocumentInputDto,
  ParseSourceDocumentOutputDto,
  ReindexSourceDocumentInputDto,
  ReindexSourceDocumentOutputDto,
  SourcePipelineResult,
} from "../dto/source-pipeline.dto";

function isBlank(value: string): boolean {
  return !value.trim();
}

export class ParseSourceDocumentUseCase {
  constructor(private readonly pipelinePort: ISourcePipelinePort) {}

  async execute(
    input: ParseSourceDocumentInputDto,
  ): Promise<SourcePipelineResult<ParseSourceDocumentOutputDto>> {
    if (
      isBlank(input.accountId)
      || isBlank(input.workspaceId)
      || isBlank(input.documentId)
      || isBlank(input.gcsUri)
      || isBlank(input.filename)
      || !Number.isFinite(input.sizeBytes)
      || input.sizeBytes <= 0
    ) {
      return {
        ok: false,
        error: {
          code: "SOURCE_PIPELINE_INVALID_INPUT",
          message: "Invalid parse input.",
        },
      };
    }

    try {
      const output = await this.pipelinePort.parseDocument(input);
      return { ok: true, data: output };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: "SOURCE_PIPELINE_EXECUTION_FAILED",
          message: error instanceof Error ? error.message : "Parse execution failed.",
        },
      };
    }
  }
}

export class ReindexSourceDocumentUseCase {
  constructor(private readonly pipelinePort: ISourcePipelinePort) {}

  async execute(
    input: ReindexSourceDocumentInputDto,
  ): Promise<SourcePipelineResult<ReindexSourceDocumentOutputDto>> {
    if (
      isBlank(input.accountId)
      || isBlank(input.workspaceId)
      || isBlank(input.documentId)
      || isBlank(input.jsonGcsUri)
      || isBlank(input.sourceGcsUri)
      || isBlank(input.filename)
      || !Number.isFinite(input.pageCount)
      || input.pageCount < 0
    ) {
      return {
        ok: false,
        error: {
          code: "SOURCE_PIPELINE_INVALID_INPUT",
          message: "Invalid reindex input.",
        },
      };
    }

    try {
      const output = await this.pipelinePort.reindexDocument(input);
      return { ok: true, data: output };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: "SOURCE_PIPELINE_EXECUTION_FAILED",
          message: error instanceof Error ? error.message : "Reindex execution failed.",
        },
      };
    }
  }
}
