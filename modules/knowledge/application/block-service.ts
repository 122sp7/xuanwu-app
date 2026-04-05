/**
 * Module: knowledge
 * Layer: application
 * Purpose: BlockService — orchestrates block updates and fires KnowledgeUpdatedEvent.
 *
 * Follows Occam's Razor: minimal logic to prove the event-driven loop.
 * The service wraps the existing UpdateKnowledgeBlockUseCase and adds event
 * publishing so downstream modules (knowledge, AI) can react.
 */

import {
  type KnowledgeUpdatedEvent,
  KNOWLEDGE_UPDATED_EVENT_TYPE,
  createKnowledgeUpdatedEvent,
} from "../../shared/domain/events/knowledge-updated.event";
import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";

import type { KnowledgeBlock } from "../domain/entities/content-block.entity";
import type { KnowledgeBlockRepository } from "../domain/repositories/knowledge.repositories";

export interface BlockServiceUpdateInput {
  readonly accountId: string;
  readonly blockId: string;
  /** New plain-text or rich-text content */
  readonly text: string;
}

export class BlockService {
  constructor(
    private readonly blockRepo: KnowledgeBlockRepository,
    private readonly eventBus: SimpleEventBus,
  ) {}

  /**
   * Update a block's text content and publish a `KnowledgeUpdatedEvent`.
   * Returns the updated block, or `null` when the block is not found.
   */
  async updateBlock(input: BlockServiceUpdateInput): Promise<KnowledgeBlock | null> {
    const updated = await this.blockRepo.update({
      accountId: input.accountId,
      blockId: input.blockId,
      content: { type: "text", text: input.text },
    });

    if (!updated) return null;

    const event: KnowledgeUpdatedEvent = createKnowledgeUpdatedEvent(
      updated.pageId,
      updated.id,
      input.text,
    );

    await this.eventBus.publish(event);

    return updated;
  }
}

export { KNOWLEDGE_UPDATED_EVENT_TYPE };
