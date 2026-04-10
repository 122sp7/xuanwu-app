/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/aggregates
 * Purpose: KnowledgeCollection aggregate root — named grouping / database-view of pages.
 */

import type { NotionDomainEvent } from "../events/NotionDomainEvent";

export type CollectionColumnType =
  | "text"
  | "number"
  | "select"
  | "multi-select"
  | "date"
  | "checkbox"
  | "url"
  | "relation";

export interface CollectionColumn {
  readonly id: string;
  readonly name: string;
  readonly type: CollectionColumnType;
  readonly options?: readonly string[];
}

export type CollectionStatus = "active" | "archived";
export type CollectionSpaceType = "database" | "wiki";

export interface KnowledgeCollectionSnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  readonly columns: readonly CollectionColumn[];
  readonly pageIds: readonly string[];
  readonly status: CollectionStatus;
  readonly spaceType: CollectionSpaceType;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateKnowledgeCollectionInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  readonly columns?: readonly Omit<CollectionColumn, "id">[];
  readonly createdByUserId: string;
  readonly spaceType?: CollectionSpaceType;
}

export class KnowledgeCollection {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: KnowledgeCollectionSnapshot) {}

  static create(id: string, columnIds: readonly string[], input: CreateKnowledgeCollectionInput): KnowledgeCollection {
    const now = new Date().toISOString();
    const columns: CollectionColumn[] = (input.columns ?? []).map((c, i) => ({
      id: columnIds[i] ?? crypto.randomUUID(),
      name: c.name,
      type: c.type,
      options: c.options,
    }));
    const collection = new KnowledgeCollection({
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      name: input.name,
      description: input.description,
      columns,
      pageIds: [],
      status: "active",
      spaceType: input.spaceType ?? "database",
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
    collection._domainEvents.push({
      type: "notion.knowledge.collection_created",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        collectionId: id,
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        name: input.name,
        createdByUserId: input.createdByUserId,
      },
    });
    return collection;
  }

  static reconstitute(snapshot: KnowledgeCollectionSnapshot): KnowledgeCollection {
    return new KnowledgeCollection({ ...snapshot });
  }

  rename(newName: string): void {
    if (this._props.status === "archived") {
      throw new Error("Cannot rename an archived collection.");
    }
    const previousName = this._props.name;
    const now = new Date().toISOString();
    this._props = { ...this._props, name: newName, updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.collection_renamed",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: {
        collectionId: this._props.id,
        accountId: this._props.accountId,
        previousName,
        newName,
      },
    });
  }

  addPage(pageId: string): void {
    if (this._props.pageIds.includes(pageId)) return;
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      pageIds: [...this._props.pageIds, pageId],
      updatedAtISO: now,
    };
  }

  removePage(pageId: string): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      pageIds: this._props.pageIds.filter((id) => id !== pageId),
      updatedAtISO: now,
    };
  }

  addColumn(column: CollectionColumn): void {
    const now = new Date().toISOString();
    this._props = {
      ...this._props,
      columns: [...this._props.columns, column],
      updatedAtISO: now,
    };
  }

  archive(): void {
    if (this._props.status === "archived") {
      throw new Error("Collection is already archived.");
    }
    const now = new Date().toISOString();
    this._props = { ...this._props, status: "archived", updatedAtISO: now };
    this._domainEvents.push({
      type: "notion.knowledge.collection_archived",
      eventId: crypto.randomUUID(),
      occurredAt: now,
      payload: { collectionId: this._props.id, accountId: this._props.accountId },
    });
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  get id(): string { return this._props.id; }
  get accountId(): string { return this._props.accountId; }
  get workspaceId(): string | undefined { return this._props.workspaceId; }
  get name(): string { return this._props.name; }
  get description(): string | undefined { return this._props.description; }
  get columns(): readonly CollectionColumn[] { return this._props.columns; }
  get pageIds(): readonly string[] { return this._props.pageIds; }
  get status(): CollectionStatus { return this._props.status; }
  get spaceType(): CollectionSpaceType { return this._props.spaceType; }
  get createdByUserId(): string { return this._props.createdByUserId; }
  get createdAtISO(): string { return this._props.createdAtISO; }
  get updatedAtISO(): string { return this._props.updatedAtISO; }

  getSnapshot(): Readonly<KnowledgeCollectionSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
