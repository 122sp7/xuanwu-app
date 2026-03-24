/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Block use cases — add, update, delete, list.
 *
 * Block mutations are always scoped to an accountId to enforce tenant isolation.
 * After adding or updating a block, the caller should also call
 * ReorderKnowledgePageBlocksUseCase if the insertion index changed the page's
 * blockIds order.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { KnowledgeBlock } from "../../domain/entities/knowledge-block.entity";
import type { KnowledgeBlockRepository } from "../../domain/repositories/knowledge.repositories";
import {
  AddKnowledgeBlockSchema,
  type AddKnowledgeBlockDto,
  UpdateKnowledgeBlockSchema,
  type UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockSchema,
  type DeleteKnowledgeBlockDto,
} from "../dto/knowledge.dto";

// ── Use Cases ─────────────────────────────────────────────────────────────────

export class AddKnowledgeBlockUseCase {
  constructor(private readonly repo: KnowledgeBlockRepository) {}

  async execute(input: AddKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = AddKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("KNOWLEDGE_BLOCK_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, content, index } = parsed.data;
    const block = await this.repo.add({ accountId, pageId, content, index });
    return commandSuccess(block.id, Date.now());
  }
}

export class UpdateKnowledgeBlockUseCase {
  constructor(private readonly repo: KnowledgeBlockRepository) {}

  async execute(input: UpdateKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = UpdateKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("KNOWLEDGE_BLOCK_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, blockId, content } = parsed.data;
    const updated = await this.repo.update({ accountId, blockId, content });
    if (!updated) return commandFailureFrom("KNOWLEDGE_BLOCK_NOT_FOUND", "Block not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class DeleteKnowledgeBlockUseCase {
  constructor(private readonly repo: KnowledgeBlockRepository) {}

  async execute(input: DeleteKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = DeleteKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("KNOWLEDGE_BLOCK_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, blockId } = parsed.data;
    await this.repo.delete(accountId, blockId);
    return commandSuccess(blockId, Date.now());
  }
}

export class ListKnowledgeBlocksUseCase {
  constructor(private readonly repo: KnowledgeBlockRepository) {}

  async execute(accountId: string, pageId: string): Promise<KnowledgeBlock[]> {
    if (!accountId.trim() || !pageId.trim()) return [];
    return this.repo.listByPageId(accountId, pageId);
  }
}
