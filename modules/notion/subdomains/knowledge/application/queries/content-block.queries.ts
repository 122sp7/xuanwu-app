import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { ContentBlock } from "../../domain/aggregates/ContentBlock";
import type { ContentBlockSnapshot } from "../../domain/aggregates/ContentBlock";
import type { IContentBlockRepository } from "../../domain/repositories/IContentBlockRepository";
import type { BlockContent } from "../../domain/value-objects/BlockContent";
import {
  AddKnowledgeBlockSchema, type AddKnowledgeBlockDto,
  UpdateKnowledgeBlockSchema, type UpdateKnowledgeBlockDto,
  DeleteKnowledgeBlockSchema, type DeleteKnowledgeBlockDto,
  NestKnowledgeBlockSchema, type NestKnowledgeBlockDto,
  UnnestKnowledgeBlockSchema, type UnnestKnowledgeBlockDto,
} from "../dto/ContentBlockDto";

export class AddContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: AddKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = AddKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    const { accountId, pageId, content, index, parentBlockId } = parsed.data;
    const count = await this.repo.countByPageId(accountId, pageId);
    const order = index !== undefined ? index : count;
    const id = generateId();
    const block = ContentBlock.create(id, { pageId, accountId, content: content as BlockContent, order, parentBlockId });
    await this.repo.save(block);
    return commandSuccess(block.id, Date.now());
  }
}

export class UpdateContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: UpdateKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = UpdateKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    const { accountId, blockId, content } = parsed.data;
    const block = await this.repo.findById(accountId, blockId);
    if (!block) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block not found.");
    block.update(content as BlockContent);
    await this.repo.save(block);
    return commandSuccess(block.id, Date.now());
  }
}

export class DeleteContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: DeleteKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = DeleteKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    await this.repo.delete(parsed.data.accountId, parsed.data.blockId);
    return commandSuccess(parsed.data.blockId, Date.now());
  }
}

export class NestContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: NestKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = NestKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    const { accountId, blockId, parentBlockId, index } = parsed.data;
    const [block, parent] = await Promise.all([this.repo.findById(accountId, blockId), this.repo.findById(accountId, parentBlockId)]);
    if (!block || !parent) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block or parent not found.");
    block.nest(parentBlockId, index);
    parent.addChild(blockId, index);
    await Promise.all([this.repo.save(block), this.repo.save(parent)]);
    return commandSuccess(block.id, Date.now());
  }
}

export class UnnestContentBlockUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(input: UnnestKnowledgeBlockDto): Promise<CommandResult> {
    const parsed = UnnestKnowledgeBlockSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
    const { accountId, blockId, index } = parsed.data;
    const block = await this.repo.findById(accountId, blockId);
    if (!block) return commandFailureFrom("CONTENT_BLOCK_NOT_FOUND", "Block not found.");
    const parentId = block.parentBlockId;
    block.unnest(index);
    if (parentId) {
      const parent = await this.repo.findById(accountId, parentId);
      if (parent) { parent.removeChild(blockId); await this.repo.save(parent); }
    }
    await this.repo.save(block);
    return commandSuccess(block.id, Date.now());
  }
}

export class ListContentBlocksUseCase {
  constructor(private readonly repo: IContentBlockRepository) {}
  async execute(accountId: string, pageId: string): Promise<ContentBlockSnapshot[]> {
    if (!accountId || !pageId) return [];
    const blocks = await this.repo.listByPageId(accountId, pageId);
    return blocks.map(b => b.getSnapshot());
  }
}
