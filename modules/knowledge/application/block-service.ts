/**
 * Module: knowledge
 * Layer: application
 * Purpose: BlockService — orchestrates block updates and fires ContentUpdatedEvent.
 *
 * Follows Occam's Razor: minimal logic to prove the event-driven loop.
 * The service wraps the existing UpdateContentBlockUseCase and adds event
 * publishing so downstream modules (knowledge, AI) can react.
 */

import {
  type ContentUpdatedEvent,
  CONTENT_UPDATED_EVENT_TYPE,
  createContentUpdatedEvent,
} from "../../shared/domain/events/content-updated.event";
import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";

import type { ContentBlock } from "../domain/entities/content-block.entity";
import type { ContentBlockRepository } from "../domain/repositories/content.repositories";

export interface BlockServiceUpdateInput {
  readonly accountId: string;
  readonly blockId: string;
  /** New plain-text or rich-text content */
  readonly text: string;
}

export class BlockService {
  constructor(
    private readonly blockRepo: ContentBlockRepository,
    private readonly eventBus: SimpleEventBus,
  ) {}

  /**
   * Update a block's text content and publish a `ContentUpdatedEvent`.
   * Returns the updated block, or `null` when the block is not found.
   */
  async updateBlock(input: BlockServiceUpdateInput): Promise<ContentBlock | null> {
    const updated = await this.blockRepo.update({
      accountId: input.accountId,
      blockId: input.blockId,
      content: { type: "text", text: input.text },
    });

    if (!updated) return null;

    const event: ContentUpdatedEvent = createContentUpdatedEvent(
      updated.pageId,
      updated.id,
      input.text,
    );

    await this.eventBus.publish(event);

    return updated;
  }
}

export { CONTENT_UPDATED_EVENT_TYPE };
