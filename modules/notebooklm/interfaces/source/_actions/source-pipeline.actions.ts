"use server";

import { makeSourcePipelineAdapter } from "../composition/adapters";
import type {
  ParseSourceDocumentInputDto,
  ParseSourceDocumentOutputDto,
  ReindexSourceDocumentInputDto,
  ReindexSourceDocumentOutputDto,
  SourcePipelineResult,
} from "../../../subdomains/source/application/dto/source-pipeline.dto";
import {
  ParseSourceDocumentUseCase,
  ReindexSourceDocumentUseCase,
} from "../../../subdomains/source/application/use-cases/source-pipeline.use-cases";

export async function parseSourceDocument(
  input: ParseSourceDocumentInputDto,
): Promise<SourcePipelineResult<ParseSourceDocumentOutputDto>> {
  const useCase = new ParseSourceDocumentUseCase(makeSourcePipelineAdapter());
  return useCase.execute(input);
}

export async function reindexSourceDocument(
  input: ReindexSourceDocumentInputDto,
): Promise<SourcePipelineResult<ReindexSourceDocumentOutputDto>> {
  const useCase = new ReindexSourceDocumentUseCase(makeSourcePipelineAdapter());
  return useCase.execute(input);
}
