"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import { makeKnowledgeUseCases } from "../composition/use-cases";
import { PublishKnowledgeVersionUseCase } from "../../../subdomains/knowledge/application/queries/knowledge-version.queries";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  ApproveKnowledgePageDto,
} from "../../../subdomains/knowledge/application/dto/KnowledgePageDto";
import type {
  VerifyKnowledgePageDto,
  RequestPageReviewDto,
  AssignPageOwnerDto,
  UpdatePageIconDto,
  UpdatePageCoverDto,
} from "../../../subdomains/knowledge/application/dto/KnowledgePageLifecycleDto";

export async function createKnowledgePage(input: CreateKnowledgePageDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().createKnowledgePage.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_CREATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function renameKnowledgePage(input: RenameKnowledgePageDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().renameKnowledgePage.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_RENAME_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function moveKnowledgePage(input: MoveKnowledgePageDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().moveKnowledgePage.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_MOVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function archiveKnowledgePage(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().archiveKnowledgePage.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_ARCHIVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function reorderKnowledgePageBlocks(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().reorderKnowledgePageBlocks.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_REORDER_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function publishKnowledgeVersion(input: { accountId: string; pageId: string; createdByUserId: string }): Promise<CommandResult> {
  try { return await new PublishKnowledgeVersionUseCase().execute(input); }
  catch (e) { return commandFailureFrom("VERSION_PUBLISH_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function approveKnowledgePage(input: ApproveKnowledgePageDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().approveKnowledgePage.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_APPROVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function verifyKnowledgePage(input: VerifyKnowledgePageDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().verifyKnowledgePage.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_VERIFY_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function requestKnowledgePageReview(input: RequestPageReviewDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().requestPageReview.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_REVIEW_REQUEST_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function assignKnowledgePageOwner(input: AssignPageOwnerDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().assignPageOwner.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_OWNER_ASSIGN_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function updateKnowledgePageIcon(input: UpdatePageIconDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().updatePageIcon.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_ICON_UPDATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function updateKnowledgePageCover(input: UpdatePageCoverDto): Promise<CommandResult> {
  try { return await makeKnowledgeUseCases().updatePageCover.execute(input); }
  catch (e) { return commandFailureFrom("PAGE_COVER_UPDATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}
