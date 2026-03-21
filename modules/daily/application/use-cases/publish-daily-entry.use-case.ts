import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import {
  isDailyEntryType,
  isDailyVisibility,
  type PublishDailyEntryInput,
} from "../../domain/entities/DailyEntry";
import type { DailyEntryRepository } from "../../domain/repositories/DailyEntryRepository";

export class PublishDailyEntryUseCase {
  constructor(private readonly dailyEntryRepository: DailyEntryRepository) {}

  async execute(input: PublishDailyEntryInput): Promise<CommandResult> {
    const organizationId = input.organizationId.trim();
    const workspaceId = input.workspaceId.trim();
    const authorId = input.authorId.trim();
    const title = input.title.trim();
    const summary = input.summary.trim();
    const body = input.body?.trim() ?? null;
    const tags = (input.tags ?? []).map((tag) => tag.trim()).filter(Boolean);

    if (!organizationId) {
      return commandFailureFrom("DAILY_ORGANIZATION_REQUIRED", "Organization is required.");
    }

    if (!workspaceId) {
      return commandFailureFrom("DAILY_WORKSPACE_REQUIRED", "Workspace is required.");
    }

    if (!authorId) {
      return commandFailureFrom("DAILY_AUTHOR_REQUIRED", "Author is required.");
    }

    if (!title) {
      return commandFailureFrom("DAILY_TITLE_REQUIRED", "Title is required.");
    }

    if (!summary) {
      return commandFailureFrom("DAILY_SUMMARY_REQUIRED", "Summary is required.");
    }

    if (!isDailyEntryType(input.entryType)) {
      return commandFailureFrom("DAILY_ENTRY_TYPE_INVALID", "Entry type is invalid.");
    }

    if (!isDailyVisibility(input.visibility)) {
      return commandFailureFrom("DAILY_VISIBILITY_INVALID", "Visibility is invalid.");
    }

    if (input.entryType === "story" && !input.expiresAtISO?.trim()) {
      return commandFailureFrom(
        "DAILY_STORY_EXPIRATION_REQUIRED",
        "Story entries must define an expiration time.",
      );
    }

    const expiresAtISO = input.expiresAtISO?.trim() || null;
    if (expiresAtISO && Number.isNaN(Date.parse(expiresAtISO))) {
      return commandFailureFrom(
        "DAILY_EXPIRATION_INVALID",
        `Invalid expiration timestamp: ${expiresAtISO}`,
      );
    }

    const entry = await this.dailyEntryRepository.publish({
      organizationId,
      workspaceId,
      authorId,
      entryType: input.entryType,
      visibility: input.visibility,
      title,
      summary,
      body,
      tags,
      expiresAtISO,
    });

    const versionSource = entry.publishedAtISO ?? entry.createdAtISO;
    const version = Date.parse(versionSource);
    if (Number.isNaN(version)) {
      return commandFailureFrom(
        "DAILY_ENTRY_TIMESTAMP_INVALID",
        `Published Daily entry ${entry.entryId} returned an invalid timestamp: ${versionSource}`,
      );
    }

    return commandSuccess(entry.entryId, version);
  }
}
