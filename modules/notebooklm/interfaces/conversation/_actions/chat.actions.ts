"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "@/modules/notebooklm/api";
import {
  GenerateNotebookResponseUseCase,
  PlatformTextGenerationAdapter,
} from "@/modules/notebooklm/api/server";
import { saveThread, loadThread } from "@/modules/notebooklm/api";

export async function sendChatMessage(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(new PlatformTextGenerationAdapter());
  return useCase.execute(input);
}

export { saveThread, loadThread };
