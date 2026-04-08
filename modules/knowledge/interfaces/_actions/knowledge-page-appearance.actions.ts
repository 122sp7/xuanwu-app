"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import {
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
} from "../../application/use-cases/knowledge-page-appearance.use-cases";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import type { UpdatePageIconDto, UpdatePageCoverDto } from "../../application/dto/knowledge.dto";

function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

export async function updateKnowledgePageIcon(input: UpdatePageIconDto): Promise<CommandResult> {
  try {
    return await new UpdatePageIconUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_ICON_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateKnowledgePageCover(input: UpdatePageCoverDto): Promise<CommandResult> {
  try {
    return await new UpdatePageCoverUseCase(makePageRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_PAGE_COVER_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
