"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import {
  AddKnowledgeBlockUseCase,
  UpdateKnowledgeBlockUseCase,
  DeleteKnowledgeBlockUseCase,
} from "../../application/use-cases/knowledge-block.use-cases";
import { FirebaseKnowledgeBlockRepository } from "../../infrastructure/firebase/FirebaseContentBlockRepository";
import type {
  AddKnowledgeBlockDto,
  UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockDto,
} from "../../application/dto/knowledge.dto";

function makeBlockRepo() {
  return new FirebaseKnowledgeBlockRepository();
}

export async function addKnowledgeBlock(input: AddKnowledgeBlockDto): Promise<CommandResult> {
  try {
    return await new AddKnowledgeBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_BLOCK_ADD_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateKnowledgeBlock(input: UpdateKnowledgeBlockDto): Promise<CommandResult> {
  try {
    return await new UpdateKnowledgeBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_BLOCK_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteKnowledgeBlock(input: DeleteKnowledgeBlockDto): Promise<CommandResult> {
  try {
    return await new DeleteKnowledgeBlockUseCase(makeBlockRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("CONTENT_BLOCK_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
