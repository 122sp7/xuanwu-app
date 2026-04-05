"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "@/modules/notebook/api";
import { GenerateNotebookResponseUseCase, GenkitNotebookRepository } from "@/modules/notebook/api/server";

export async function sendChatMessage(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(new GenkitNotebookRepository());
  return useCase.execute(input);
}
