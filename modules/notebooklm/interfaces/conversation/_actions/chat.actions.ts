"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../../subdomains/notebook/api";
import {
  GenerateNotebookResponseUseCase,
  PlatformTextGenerationAdapter,
} from "../../../subdomains/notebook/api/server";
import { saveThread, loadThread } from "./thread.actions";

export async function sendChatMessage(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(new PlatformTextGenerationAdapter());
  return useCase.execute(input);
}

export { saveThread, loadThread };
