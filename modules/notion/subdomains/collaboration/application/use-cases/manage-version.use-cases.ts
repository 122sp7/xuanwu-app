/**
 * Module: notion/subdomains/collaboration
 * Layer: application/use-cases
 * Aggregate: Version
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { VersionRepository } from "../../domain/repositories/VersionRepository";
import {
  CreateVersionSchema, type CreateVersionDto,
  DeleteVersionSchema, type DeleteVersionDto,
} from "../dto/CollaborationDto";

export class CreateVersionUseCase {
  constructor(private readonly repo: VersionRepository) {}

  async execute(input: CreateVersionDto): Promise<CommandResult> {
    const parsed = CreateVersionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("VERSION_INVALID_INPUT", parsed.error.message);
    const { accountId, workspaceId, contentId, contentType, snapshotBlocks, label, description, createdByUserId } = parsed.data;
    const version = await this.repo.create({
      contentId, contentType, workspaceId, accountId, snapshotBlocks,
      label: label ?? null,
      description: description ?? null,
      createdByUserId,
    });
    return commandSuccess(version.id, Date.now());
  }
}

export class DeleteVersionUseCase {
  constructor(private readonly repo: VersionRepository) {}

  async execute(input: DeleteVersionDto): Promise<CommandResult> {
    const parsed = DeleteVersionSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("VERSION_INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, Date.now());
  }
}
