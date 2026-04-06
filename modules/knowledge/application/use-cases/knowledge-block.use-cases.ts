/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Block use cases — add, update, delete, list.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { KnowledgeBlock } from "../../domain/entities/content-block.entity";
import type { KnowledgeBlockRepository } from "../../domain/repositories/knowledge.repositories";
import {
  AddKnowledgeBlockSchema,
  type AddKnowledgeBlockDto,
  UpdateKnowledgeBlockSchema,
  type UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockSchema,
  type DeleteKnowledgeBlockDto,
  NestKnowledgeBlockSchema,
  type NestKnowledgeBlockDto,
  UnnestKnowledgeBlockSchema,
  type UnnestKnowledgeBlockDto,
} from "../dto/knowledge.dto";

export class AddKnowledgeBlockUseCase {
  constructor(private readonly repo: KnowledgeBlockRepository) {}

  async execute(input: AddKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = AddKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
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
      return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, blockId, content } = parsed.data;
    const updated = await this.repo.update({ accountId, blockId, content });
    if (!updated) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class DeleteKnowledgeBlockUseCase {
  constructor(private readonly repo: KnowledgeBlockRepository) {}

  async execute(input: DeleteKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = DeleteKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
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

export class NestKnowledgeBlockUseCase {
  constructor(private readonly repo: KnowledgeBlockRepository) {}

  async execute(input: NestKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = NestKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    }
    const updated = await this.repo.nest(parsed.data);
    if (!updated) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block or parent block not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class UnnestKnowledgeBlockUseCase {
  constructor(private readonly repo: KnowledgeBlockRepository) {}

  async execute(input: UnnestKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = UnnestKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    }
    const updated = await this.repo.unnest(parsed.data);
    if (!updated) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block not found.");
    return commandSuccess(updated.id, Date.now());
  }
}
