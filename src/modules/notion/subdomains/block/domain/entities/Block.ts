/**
 * Block — distilled from modules/notion/subdomains/knowledge/domain/aggregates/ContentBlock.ts
 */
import { v4 as uuid } from "uuid";

export type BlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list"
  | "numbered_list"
  | "todo"
  | "toggle"
  | "code"
  | "quote"
  | "callout"
  | "divider"
  | "image"
  | "file"
  | "embed";

export interface BlockContent {
  readonly type: BlockType;
  readonly text?: string;
  readonly checked?: boolean;
  readonly url?: string;
  readonly language?: string;
  readonly attributes?: Record<string, unknown>;
}

export interface BlockSnapshot {
  readonly id: string;
  readonly pageId: string;
  readonly parentBlockId?: string;
  readonly order: number;
  readonly content: BlockContent;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateBlockInput {
  readonly pageId: string;
  readonly parentBlockId?: string;
  readonly order: number;
  readonly content: BlockContent;
  readonly createdByUserId: string;
}

export class Block {
  private constructor(private _props: BlockSnapshot) {}

  static create(input: CreateBlockInput): Block {
    const now = new Date().toISOString();
    return new Block({
      id: uuid(),
      pageId: input.pageId,
      parentBlockId: input.parentBlockId,
      order: input.order,
      content: input.content,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
  }

  static reconstitute(snapshot: BlockSnapshot): Block {
    return new Block(snapshot);
  }

  update(content: Partial<BlockContent>): void {
    this._props = {
      ...this._props,
      content: { ...this._props.content, ...content },
      updatedAtISO: new Date().toISOString(),
    };
  }

  reorder(order: number): void {
    this._props = { ...this._props, order, updatedAtISO: new Date().toISOString() };
  }

  get id(): string { return this._props.id; }
  get pageId(): string { return this._props.pageId; }
  get content(): BlockContent { return this._props.content; }
  get order(): number { return this._props.order; }

  getSnapshot(): Readonly<BlockSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
