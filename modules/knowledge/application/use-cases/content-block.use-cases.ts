/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Block use cases — add, update, delete, list.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { ContentBlock } from "../../domain/entities/content-block.entity";
import type { ContentBlockRepository } from "../../domain/repositories/content.repositories";
import {
  AddContentBlockSchema,
  type AddContentBlockDto,
  UpdateContentBlockSchema,
  type UpdateContentBlockDto,
  DeleteContentBlockSchema,
  type DeleteContentBlockDto,
} from "../dto/content.dto";

export class AddContentBlockUseCase {
  constructor(private readonly repo: ContentBlockRepository) {}

  async execute(input: AddContentBlockDto): Promise<CommandResult> {
    const parsed = AddContentBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, content, index } = parsed.data;
    const block = await this.repo.add({ accountId, pageId, content, index });
    return commandSuccess(block.id, Date.now());
  }
}

export class UpdateContentBlockUseCase {
  constructor(private readonly repo: ContentBlockRepository) {}

  async execute(input: UpdateContentBlockDto): Promise<CommandResult> {
    const parsed = UpdateContentBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, blockId, content } = parsed.data;
    const updated = await this.repo.update({ accountId, blockId, content });
    if (!updated) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class DeleteContentBlockUseCase {
  constructor(private readonly repo: ContentBlockRepository) {}

  async execute(input: DeleteContentBlockDto): Promise<CommandResult> {
    const parsed = DeleteContentBlockSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, blockId } = parsed.data;
    await this.repo.delete(accountId, blockId);
    return commandSuccess(blockId, Date.now());
  }
}

export class ListContentBlocksUseCase {
  constructor(private readonly repo: ContentBlockRepository) {}

  async execute(accountId: string, pageId: string): Promise<ContentBlock[]> {
    if (!accountId.trim() || !pageId.trim()) return [];
    return this.repo.listByPageId(accountId, pageId);
  }
}
