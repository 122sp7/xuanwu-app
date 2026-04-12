"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeCollectionRepo } from "../composition/repositories";
import {
  CreateKnowledgeCollectionUseCase,
  RenameKnowledgeCollectionUseCase,
  AddPageToCollectionUseCase,
  RemovePageFromCollectionUseCase,
  AddCollectionColumnUseCase,
  ArchiveKnowledgeCollectionUseCase,
} from "../../../subdomains/knowledge/application/use-cases/KnowledgeCollectionUseCases";
import type {
  CreateKnowledgeCollectionDto,
  RenameKnowledgeCollectionDto,
  AddPageToCollectionDto,
  RemovePageFromCollectionDto,
  AddCollectionColumnDto,
  ArchiveKnowledgeCollectionDto,
} from "../../../subdomains/knowledge/application/dto/KnowledgeCollectionDto";

export async function createKnowledgeCollection(input: CreateKnowledgeCollectionDto): Promise<CommandResult> {
  try { return await new CreateKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_CREATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function renameKnowledgeCollection(input: RenameKnowledgeCollectionDto): Promise<CommandResult> {
  try { return await new RenameKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_RENAME_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function addPageToCollection(input: AddPageToCollectionDto): Promise<CommandResult> {
  try { return await new AddPageToCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_ADD_PAGE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function removePageFromCollection(input: RemovePageFromCollectionDto): Promise<CommandResult> {
  try { return await new RemovePageFromCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_REMOVE_PAGE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function addCollectionColumn(input: AddCollectionColumnDto): Promise<CommandResult> {
  try { return await new AddCollectionColumnUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_ADD_COLUMN_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function archiveKnowledgeCollection(input: ArchiveKnowledgeCollectionDto): Promise<CommandResult> {
  try { return await new ArchiveKnowledgeCollectionUseCase(makeCollectionRepo()).execute(input); }
  catch (e) { return commandFailureFrom("COLLECTION_ARCHIVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}
