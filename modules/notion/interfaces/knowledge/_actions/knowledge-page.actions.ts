"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { IEventStoreRepository, IEventBusRepository } from "@shared-events";
import { makePageRepo } from "../../../subdomains/knowledge/api/factories";
import {
  CreateKnowledgePageUseCase,
  RenameKnowledgePageUseCase,
  MoveKnowledgePageUseCase,
  ArchiveKnowledgePageUseCase,
  ReorderKnowledgePageBlocksUseCase,
} from "../../../subdomains/knowledge/application/use-cases/KnowledgePageUseCases";
import {
  ApproveKnowledgePageUseCase,
  VerifyKnowledgePageUseCase,
  RequestPageReviewUseCase,
  AssignPageOwnerUseCase,
} from "../../../subdomains/knowledge/application/use-cases/KnowledgePageReviewUseCases";
import {
  UpdatePageIconUseCase,
  UpdatePageCoverUseCase,
} from "../../../subdomains/knowledge/application/use-cases/KnowledgePageAppearanceUseCases";
import { PublishKnowledgeVersionUseCase } from "../../../subdomains/knowledge/application/queries/knowledge-version.queries";
import type {
  CreateKnowledgePageDto,
  RenameKnowledgePageDto,
  MoveKnowledgePageDto,
  ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksDto,
  ApproveKnowledgePageDto,
} from "../../../subdomains/knowledge/application/dto/KnowledgePageDto";
import type { VerifyKnowledgePageDto, RequestPageReviewDto, AssignPageOwnerDto, UpdatePageIconDto, UpdatePageCoverDto } from "../../../subdomains/knowledge/application/dto/KnowledgePageLifecycleDto";

/** Stub event store — persists nothing. Replace with a real impl once infrastructure is wired. */
const makeEventStore = (): IEventStoreRepository => ({
  save: async () => {},
  findById: async () => null,
  findByAggregate: async () => [],
  findUndispatched: async () => [],
  markDispatched: async () => {},
});

/** Stub event bus — publishes nothing. Replace with QStash/Firestore publish once infrastructure is wired. */
const makeEventBus = (): IEventBusRepository => ({
  publish: async () => {},
});

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

export async function publishKnowledgeVersion(input: { accountId: string; pageId: string; createdByUserId: string }): Promise<CommandResult> {
  try { return await new PublishKnowledgeVersionUseCase().execute(input); }
  catch (e) { return commandFailureFrom("VERSION_PUBLISH_FAILED", (e as Error)?.message ?? "Unknown"); }
}

export async function approveKnowledgePage(input: ApproveKnowledgePageDto): Promise<CommandResult> {
  try { return await new ApproveKnowledgePageUseCase(makePageRepo(), makeEventStore(), makeEventBus()).execute(input); }
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
