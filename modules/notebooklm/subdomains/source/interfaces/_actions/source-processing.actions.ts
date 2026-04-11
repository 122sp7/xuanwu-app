"use server";

import type { CommandResult } from "@shared-types";

import { makeKnowledgePageGateway, makeParsedDocumentAdapter } from "../../api/factories";
import { CreateKnowledgeDraftFromSourceUseCase } from "../../application/use-cases/create-knowledge-draft-from-source.use-case";

interface CreateKnowledgeDraftFromSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly createdByUserId: string;
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
}

export async function createKnowledgeDraftFromSourceDocument(
  input: CreateKnowledgeDraftFromSourceDocumentInput,
): Promise<CommandResult> {
  const useCase = new CreateKnowledgeDraftFromSourceUseCase(
    makeParsedDocumentAdapter(),
    makeKnowledgePageGateway(),
  );
  return useCase.execute(input);
}
