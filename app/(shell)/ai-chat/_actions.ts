"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "@/modules/notebook/api";
import { GenerateNotebookResponseUseCase } from "@/modules/notebook/api";
import { GenkitNotebookRepository } from "@/modules/notebook/api";

export async function sendChatMessage(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(new GenkitNotebookRepository());
  return useCase.execute(input);
}
