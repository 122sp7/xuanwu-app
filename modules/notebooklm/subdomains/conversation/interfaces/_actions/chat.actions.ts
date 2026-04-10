"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
  Thread,
} from "@/modules/notebooklm/api";
import {
  GenerateNotebookResponseUseCase,
  GenkitNotebookRepository,
} from "@/modules/notebooklm/api/server";
import { saveThread, loadThread } from "@/modules/notebooklm/api";

export async function sendChatMessage(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(new GenkitNotebookRepository());
  return useCase.execute(input);
}

export { saveThread, loadThread };
export type { Thread };
