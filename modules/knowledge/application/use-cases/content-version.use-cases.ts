/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Version use cases — publish a version snapshot and retrieve history.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { ContentVersion } from "../../domain/entities/content-version.entity";
import type { ContentVersionRepository } from "../../domain/repositories/content.repositories";
import {
  CreateContentVersionSchema,
  type CreateContentVersionDto,
} from "../dto/content.dto";

export class PublishContentVersionUseCase {
  constructor(private readonly repo: ContentVersionRepository) {}

  async execute(input: CreateContentVersionDto): Promise<CommandResult> {
    const parsed = CreateContentVersionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_VERSION_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, label, createdByUserId } = parsed.data;
    const version = await this.repo.create({
      accountId,
      pageId,
      label: label ?? "Published",
      createdByUserId,
    });
    return commandSuccess(version.id, Date.now());
  }
}

export class ListContentVersionsUseCase {
  constructor(private readonly repo: ContentVersionRepository) {}

  async execute(accountId: string, pageId: string): Promise<ContentVersion[]> {
    if (!accountId.trim() || !pageId.trim()) return [];
    return this.repo.listByPageId(accountId, pageId);
  }
}
