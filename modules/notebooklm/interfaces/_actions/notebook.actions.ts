"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { Thread } from "../../domain/entities/thread";
import type { AnswerRagQueryInput, AnswerRagQueryResult } from "../../subdomains/ai/qa";
import { createAnswerRagQueryUseCase } from "../../subdomains/ai/qa/server";
import { GenerateNotebookResponseUseCase } from "../../application/use-cases/generate-agent-response.use-case";
import { makeNotebookRepo, makeThreadRepo } from "../../api/factories";

export async function generateNotebookResponse(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(makeNotebookRepo());
  return useCase.execute(input);
}

export async function answerRagQuery(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult> {
  return createAnswerRagQueryUseCase().execute(input);
}

export async function saveThread(accountId: string, thread: Thread): Promise<void> {
  await makeThreadRepo().save(accountId, thread);
}

export async function loadThread(accountId: string, threadId: string): Promise<Thread | null> {
  return makeThreadRepo().getById(accountId, threadId);
}
