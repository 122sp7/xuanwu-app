"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeBlockRepo } from "../composition/repositories";
import {
  AddContentBlockUseCase,
  UpdateContentBlockUseCase,
  DeleteContentBlockUseCase,
} from "../../../subdomains/knowledge/application/queries/content-block.queries";
import type { AddKnowledgeBlockDto as AddContentBlockDto, UpdateKnowledgeBlockDto as UpdateContentBlockDto, DeleteKnowledgeBlockDto as DeleteContentBlockDto } from "../../../subdomains/knowledge/application/dto/ContentBlockDto";

export async function addKnowledgeBlock(input: AddContentBlockDto): Promise<CommandResult> {
  try { return await new AddContentBlockUseCase(makeBlockRepo()).execute(input); }
  catch (e) { return commandFailureFrom("BLOCK_ADD_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function updateKnowledgeBlock(input: UpdateContentBlockDto): Promise<CommandResult> {
  try { return await new UpdateContentBlockUseCase(makeBlockRepo()).execute(input); }
  catch (e) { return commandFailureFrom("BLOCK_UPDATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function deleteKnowledgeBlock(input: DeleteContentBlockDto): Promise<CommandResult> {
  try { return await new DeleteContentBlockUseCase(makeBlockRepo()).execute(input); }
  catch (e) { return commandFailureFrom("BLOCK_DELETE_FAILED", (e as Error)?.message ?? "Unknown"); }
}
