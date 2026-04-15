import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { Block, type CreateBlockInput, type BlockContent } from "../../domain/entities/Block";
import type { BlockRepository } from "../../domain/repositories/BlockRepository";

export class CreateBlockUseCase {
  constructor(private readonly repo: BlockRepository) {}

  async execute(input: CreateBlockInput): Promise<CommandResult> {
    try {
      const block = Block.create(input);
      await this.repo.save(block.getSnapshot());
      return commandSuccess(block.id, Date.now());
    } catch (err) {
      return commandFailureFrom("CREATE_BLOCK_FAILED", err instanceof Error ? err.message : "Failed to create block");
    }
  }
}

export class UpdateBlockUseCase {
  constructor(private readonly repo: BlockRepository) {}

  async execute(blockId: string, content: Partial<BlockContent>): Promise<CommandResult> {
    try {
      const snapshot = await this.repo.findById(blockId);
      if (!snapshot) return commandFailureFrom("BLOCK_NOT_FOUND", `Block ${blockId} not found`);
      const block = Block.reconstitute(snapshot);
      block.update(content);
      await this.repo.save(block.getSnapshot());
      return commandSuccess(blockId, Date.now());
    } catch (err) {
      return commandFailureFrom("UPDATE_BLOCK_FAILED", err instanceof Error ? err.message : "Failed to update block");
    }
  }
}

export class GetPageBlocksUseCase {
  constructor(private readonly repo: BlockRepository) {}

  async execute(pageId: string) {
    const blocks = await this.repo.findByPageId(pageId);
    return blocks.sort((a, b) => a.order - b.order);
  }
}
