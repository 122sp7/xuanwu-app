/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page appearance use cases — update icon, update cover.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";
import {
  UpdatePageIconSchema,
  type UpdatePageIconDto,
  UpdatePageCoverSchema,
  type UpdatePageCoverDto,
} from "../dto/KnowledgePageLifecycleDto";

export class UpdatePageIconUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: UpdatePageIconDto): Promise<CommandResult> {
    const parsed = UpdatePageIconSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, iconUrl } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.updateIcon(iconUrl);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class UpdatePageCoverUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: UpdatePageCoverDto): Promise<CommandResult> {
    const parsed = UpdatePageCoverSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, coverUrl } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.updateCover(coverUrl);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}
