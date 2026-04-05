"use server";

import type {
  GenerateNotebookResponseInput,
  GenerateNotebookResponseResult,
} from "../../domain/entities/AgentGeneration";
import type { Thread } from "../../domain/entities/thread";
import type { AnswerRagQueryInput, AnswerRagQueryResult } from "@/modules/search/api";
import { AnswerRagQueryUseCase } from "@/modules/search/api/server";
import { GenerateNotebookResponseUseCase } from "../../application/use-cases/generate-agent-response.use-case";
import { FirebaseRagRetrievalRepository } from "@/modules/search/api/server";
import { GenkitNotebookRepository } from "../../infrastructure/genkit/GenkitNotebookRepository";
import { GenkitRagGenerationRepository } from "@/modules/search/api/server";
import { FirebaseThreadRepository } from "../../infrastructure/firebase/FirebaseThreadRepository";

function makeThreadRepo() {
  return new FirebaseThreadRepository();
}

export async function generateNotebookResponse(
  input: GenerateNotebookResponseInput,
): Promise<GenerateNotebookResponseResult> {
  const useCase = new GenerateNotebookResponseUseCase(new GenkitNotebookRepository());
  return useCase.execute(input);
}

export async function answerRagQuery(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult> {
  const useCase = new AnswerRagQueryUseCase(
    new FirebaseRagRetrievalRepository(),
    new GenkitRagGenerationRepository(),
  );
  return useCase.execute(input);
}

export async function saveThread(accountId: string, thread: Thread): Promise<void> {
  await makeThreadRepo().save(accountId, thread);
}

export async function loadThread(accountId: string, threadId: string): Promise<Thread | null> {
  return makeThreadRepo().getById(accountId, threadId);
}
