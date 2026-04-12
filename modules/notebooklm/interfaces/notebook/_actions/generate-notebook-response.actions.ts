"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../../subdomains/notebook/application/dto/notebook.dto";
import { GenerateNotebookResponseUseCase } from "../../../subdomains/notebook/application/use-cases/generate-notebook-response.use-case";
import { makeNotebookRepo } from "../../../subdomains/notebook/api/factories";

export async function generateNotebookResponse(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(makeNotebookRepo());
  return useCase.execute(input);
}
