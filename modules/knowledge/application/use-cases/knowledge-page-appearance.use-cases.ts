/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Page appearance use cases — update icon, update cover.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { KnowledgePageRepository } from "../../domain/repositories/knowledge.repositories";
import {
  UpdatePageIconSchema,
  type UpdatePageIconDto,
  UpdatePageCoverSchema,
  type UpdatePageCoverDto,
} from "../dto/knowledge.dto";

export class UpdatePageIconUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: UpdatePageIconDto): Promise<CommandResult> {
    const parsed = UpdatePageIconSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }
    const { accountId, pageId, iconUrl } = parsed.data;
    const result = await this.repo.updateIcon({ accountId, pageId, iconUrl });
    if (!result) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class UpdatePageCoverUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: UpdatePageCoverDto): Promise<CommandResult> {
    const parsed = UpdatePageCoverSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }
    const { accountId, pageId, coverUrl } = parsed.data;
    const result = await this.repo.updateCover({ accountId, pageId, coverUrl });
    if (!result) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(result.id, Date.now());
  }
}
