/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: ContentBlock aggregate root — atomic content unit inside a Page.
 */

import { v4 as uuid } from "@lib-uuid";
import type { BlockContent } from "../value-objects/BlockContent";
import { richTextToPlainText } from "../value-objects/BlockContent";
import type { NotionDomainEvent } from "../events/NotionDomainEvent";

export interface ContentBlockSnapshot {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  readonly parentBlockId: string | null;
  readonly childBlockIds: ReadonlyArray<string>;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateContentBlockInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  readonly parentBlockId?: string | null;
}

export class ContentBlock {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: ContentBlockSnapshot) {}

  static create(id: string, input: CreateContentBlockInput): ContentBlock {
    const now = new Date().toISOString();
    const block = new ContentBlock({
      id,
      pageId: input.pageId,
      accountId: input.accountId,
      content: input.content,
      order: input.order,
      parentBlockId: input.parentBlockId ?? null,
      childBlockIds: [],
      createdAtISO: now,
      updatedAtISO: now,
    });
    const contentText = richTextToPlainText(input.content.richText);
    block._domainEvents.push({
      type: "notion.knowledge.block_added",
      eventId: uuid(),
      occurredAt: now,
      payload: { blockId: id, pageId: input.pageId, accountId: input.accountId, contentText },
    });
    return block;
  }

  static reconstitute(snapshot: ContentBlockSnapshot): ContentBlock {
    return new ContentBlock({ ...snapshot });
  }

  update(newContent: BlockContent): void {
    const now = new Date().toISOString();
    const contentText = richTextToPlainText(newContent.richText);
    this._props = { ...this._props, content: newContent, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.block_updated",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        blockId: this._props.id,
        pageId: this._props.pageId,
        accountId: this._props.accountId,
        contentText,
      },
    });
  }

  delete(): void {
    const now = new Date().toISOString();
    this._domainEvents.push({
      type: "notion.knowledge.block_deleted",
      eventId: uuid(),
      occurredAt: now,
      payload: {
        blockId: this._props.id,
        pageId: this._props.pageId,
        accountId: this._props.accountId,
      },
    });
  }

  nest(parentId: string, index?: number): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, parentBlockId: parentId, updatedAtISO: now };
    void index;
  }

  unnest(index?: number): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, parentBlockId: null, updatedAtISO: now };
    void index;
  }

  addChild(childId: string, index?: number): void {
    const now = new Date().toISOString();
    const children = [...this._props.childBlockIds];
    const idx = index !== undefined ? index : children.length;
    children.splice(idx, 0, childId);
    this._props = { ...this._props, childBlockIds: children, updatedAtISO: now };
  }

  removeChild(childId: string): void {
    const now = new Date().toISOString();
    const children = this._props.childBlockIds.filter((id) => id !== childId);
    this._props = { ...this._props, childBlockIds: children, updatedAtISO: now };
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get id(): string { return this._props.id; }
  get pageId(): string { return this._props.pageId; }
  get accountId(): string { return this._props.accountId; }
  get content(): BlockContent { return this._props.content; }
  get order(): number { return this._props.order; }
  get parentBlockId(): string | null { return this._props.parentBlockId; }
  get childBlockIds(): ReadonlyArray<string> { return this._props.childBlockIds; }
  get createdAtISO(): string { return this._props.createdAtISO; }
  get updatedAtISO(): string { return this._props.updatedAtISO; }

  getSnapshot(): Readonly<ContentBlockSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
