/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Version use cases — publish a version snapshot and retrieve history.
 *
 * A version is an immutable point-in-time snapshot of a page's content.
 * Creating a version triggers the KnowledgeVersionPublishedEvent which
 * downstream consumers (audit, notifications) can subscribe to.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { KnowledgeVersion } from "../../domain/entities/knowledge-version.entity";
import type { KnowledgeVersionRepository } from "../../domain/repositories/knowledge.repositories";
import {
  CreateKnowledgeVersionSchema,
  type CreateKnowledgeVersionDto,
} from "../dto/knowledge.dto";

// ── Use Cases ─────────────────────────────────────────────────────────────────

export class PublishKnowledgeVersionUseCase {
  constructor(private readonly repo: KnowledgeVersionRepository) {}

  async execute(input: CreateKnowledgeVersionDto): Promise<CommandResult> {
    const parsed = CreateKnowledgeVersionSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("KNOWLEDGE_VERSION_INVALID_INPUT", parsed.error.message);
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

export class ListKnowledgeVersionsUseCase {
  constructor(private readonly repo: KnowledgeVersionRepository) {}

  async execute(accountId: string, pageId: string): Promise<KnowledgeVersion[]> {
    if (!accountId.trim() || !pageId.trim()) return [];
    return this.repo.listByPageId(accountId, pageId);
  }
}
