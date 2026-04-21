/**
 * Page — distilled from modules/notion/subdomains/knowledge/domain/aggregates/KnowledgePage.ts
 */
import { v4 as uuid } from "uuid";

export type PageStatus = "active" | "archived";

export interface PageSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly summary?: string;
  readonly sourceLabel?: string;
  readonly sourceDocumentId?: string;
  readonly sourceText?: string;
  readonly slug: string;
  readonly parentPageId: string | null;
  readonly order: number;
  readonly blockIds: readonly string[];
  readonly status: PageStatus;
  readonly ownerId?: string;
  readonly iconUrl?: string;
  readonly coverUrl?: string;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreatePageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly summary?: string;
  readonly sourceLabel?: string;
  readonly sourceDocumentId?: string;
  readonly sourceText?: string;
  readonly parentPageId?: string | null;
  readonly createdByUserId: string;
  readonly order?: number;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export class Page {
  private _domainEvents: Array<{ type: string; eventId: string; occurredAt: string; payload: Record<string, unknown> }> = [];

  private constructor(private _props: PageSnapshot) {}

  static create(input: CreatePageInput): Page {
    const now = new Date().toISOString();
    const page = new Page({
      id: uuid(),
      accountId: input.accountId,
        workspaceId: input.workspaceId,
        title: input.title,
        summary: input.summary?.trim() || undefined,
        sourceLabel: input.sourceLabel?.trim() || undefined,
        sourceDocumentId: input.sourceDocumentId?.trim() || undefined,
        sourceText: input.sourceText?.trim() || undefined,
        slug: slugify(input.title),
        parentPageId: input.parentPageId ?? null,
        order: input.order ?? 0,
      blockIds: [],
      status: "active",
      ownerId: input.createdByUserId,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
    page._domainEvents.push({
      type: "notion.page.created",
      eventId: uuid(),
      occurredAt: now,
      payload: { pageId: page._props.id, accountId: input.accountId },
    });
    return page;
  }

  static reconstitute(snapshot: PageSnapshot): Page {
    return new Page(snapshot);
  }

  rename(title: string): void {
    if (!title.trim()) throw new Error("Page title cannot be empty");
    this._props = {
      ...this._props,
      title,
      slug: slugify(title),
      updatedAtISO: new Date().toISOString(),
    };
  }

  appendBlock(blockId: string): void {
    if (this._props.blockIds.includes(blockId)) return;
    this._props = {
      ...this._props,
      blockIds: [...this._props.blockIds, blockId],
      updatedAtISO: new Date().toISOString(),
    };
  }

  archive(): void {
    if (this._props.status === "archived") throw new Error("Page is already archived");
    this._props = { ...this._props, status: "archived", updatedAtISO: new Date().toISOString() };
    this._domainEvents.push({
      type: "notion.page.archived",
      eventId: uuid(),
      occurredAt: new Date().toISOString(),
      payload: { pageId: this._props.id },
    });
  }

  get id(): string { return this._props.id; }
  get title(): string { return this._props.title; }
  get summary(): string | undefined { return this._props.summary; }
  get sourceLabel(): string | undefined { return this._props.sourceLabel; }
  get sourceDocumentId(): string | undefined { return this._props.sourceDocumentId; }
  get sourceText(): string | undefined { return this._props.sourceText; }
  get slug(): string { return this._props.slug; }
  get status(): PageStatus { return this._props.status; }
  get blockIds(): readonly string[] { return this._props.blockIds; }
  get parentPageId(): string | null { return this._props.parentPageId; }

  getSnapshot(): Readonly<PageSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents() {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
