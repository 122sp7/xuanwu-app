"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
  Thread,
} from "@/modules/notebook/api";
import {
  GenerateNotebookResponseUseCase,
  GenkitNotebookRepository,
} from "@/modules/notebook/api/server";
import { saveThread, loadThread } from "@/modules/notebook/api";

export async function sendChatMessage(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(new GenkitNotebookRepository());
  return useCase.execute(input);
}

export { saveThread, loadThread };
export type { Thread };

