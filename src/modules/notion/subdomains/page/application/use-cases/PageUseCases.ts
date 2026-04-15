import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { Page, type CreatePageInput } from "../../domain/entities/Page";
import type { PageRepository, PageQuery } from "../../domain/repositories/PageRepository";

export class CreatePageUseCase {
  constructor(private readonly repo: PageRepository) {}

  async execute(input: CreatePageInput): Promise<CommandResult> {
    try {
      const page = Page.create(input);
      await this.repo.save(page.getSnapshot());
      return commandSuccess(page.id, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_PAGE_FAILED", err instanceof Error ? err.message : "Failed to create page");
    }
  }
}

export class RenamePageUseCase {
  constructor(private readonly repo: PageRepository) {}

  async execute(pageId: string, title: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(pageId);
      if (!snapshot) return commandFailureFrom("PAGE_NOT_FOUND", `Page ${pageId} not found`);
      const page = Page.reconstitute(snapshot);
      page.rename(title);
      await this.repo.save(page.getSnapshot());
      return commandSuccess(pageId, Date.now());
    } catch (err) {
      return commandFailureFrom("RENAME_PAGE_FAILED", err instanceof Error ? err.message : "Failed to rename page");
    }
  }
}

export class ArchivePageUseCase {
  constructor(private readonly repo: PageRepository) {}

  async execute(pageId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(pageId);
      if (!snapshot) return commandFailureFrom("PAGE_NOT_FOUND", `Page ${pageId} not found`);
      const page = Page.reconstitute(snapshot);
      page.archive();
      await this.repo.save(page.getSnapshot());
      return commandSuccess(pageId, Date.now());
    } catch (err) {
      return commandFailureFrom("ARCHIVE_PAGE_FAILED", err instanceof Error ? err.message : "Failed to archive page");
    }
  }
}

export class QueryPagesUseCase {
  constructor(private readonly repo: PageRepository) {}

  async execute(params: PageQuery) {
    return this.repo.query(params);
  }
}
