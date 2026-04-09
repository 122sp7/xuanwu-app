"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { FirebaseKnowledgePageRepository } from "../../infrastructure/firebase/FirebaseKnowledgePageRepository";
import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
} from "../../application/use-cases/KnowledgePageUseCases";
import {
  ApproveKnowledgePageUseCase,
  VerifyKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
} from "../../application/use-cases/KnowledgePageReviewUseCases";
import {
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
} from "../../application/use-cases/KnowledgePageAppearanceUseCases";
import { PublishKnowledgeVersionUseCase } from "../../application/use-cases/KnowledgeVersionUseCases";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  ApproveKnowledgePageDto,
} from "../../application/dto/KnowledgePageDto";
import type { VerifyKnowledgePageDto, RequestPageReviewDto, AssignPageOwnerDto, UpdatePageIconDto, UpdatePageCoverDto } from "../../application/dto/KnowledgeWikiDto";

const makePageRepo = () => new FirebaseKnowledgePageRepository();

export async function createKnowledgePage(input: CreateKnowledgePageDto): Promise<CommandResult> {
  try { return await new CreateKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_CREATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function renameKnowledgePage(input: RenameKnowledgePageDto): Promise<CommandResult> {
  try { return await new RenameKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_RENAME_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function moveKnowledgePage(input: MoveKnowledgePageDto): Promise<CommandResult> {
  try { return await new MoveKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_MOVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function archiveKnowledgePage(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
  try { return await new ArchiveKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_ARCHIVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function reorderKnowledgePageBlocks(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult> {
  try { return await new ReorderKnowledgePageBlocksUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_REORDER_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function publishKnowledgeVersion(input: { accountId: string; pageId: string }): Promise<CommandResult> {
  try { return await new PublishKnowledgeVersionUseCase().execute(input); }
  catch (e) { return commandFailureFrom("VERSION_PUBLISH_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function approveKnowledgePage(input: ApproveKnowledgePageDto): Promise<CommandResult> {
  try { return await new ApproveKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_APPROVE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function verifyKnowledgePage(input: VerifyKnowledgePageDto): Promise<CommandResult> {
  try { return await new VerifyKnowledgePageUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_VERIFY_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function requestKnowledgePageReview(input: RequestPageReviewDto): Promise<CommandResult> {
  try { return await new RequestPageReviewUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_REVIEW_REQUEST_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function assignKnowledgePageOwner(input: AssignPageOwnerDto): Promise<CommandResult> {
  try { return await new AssignPageOwnerUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_OWNER_ASSIGN_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function updateKnowledgePageIcon(input: UpdatePageIconDto): Promise<CommandResult> {
  try { return await new UpdatePageIconUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_ICON_UPDATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function updateKnowledgePageCover(input: UpdatePageCoverDto): Promise<CommandResult> {
  try { return await new UpdatePageCoverUseCase(makePageRepo()).execute(input); }
  catch (e) { return commandFailureFrom("PAGE_COVER_UPDATE_FAILED", (e as Error)?.message ?? "Unknown"); }
}
