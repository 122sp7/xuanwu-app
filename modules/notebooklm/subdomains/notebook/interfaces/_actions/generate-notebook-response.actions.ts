"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../application/dto/notebook.dto";
import { GenerateNotebookResponseUseCase } from "../../application/use-cases/generate-notebook-response.use-case";
import { makeNotebookRepo } from "../../api/factories";

export async function generateNotebookResponse(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(makeNotebookRepo());
  return useCase.execute(input);
}
