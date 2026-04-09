/**
 * Module: notion/subdomains/authoring
 * Layer: domain/aggregates
 * Purpose: Category aggregate root — hierarchical article organisation.
 */

import type { NotionDomainEvent } from "../../../../core/domain/events/NotionDomainEvent";

export interface CategorySnapshot {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly slug: string;
  readonly parentCategoryId: string | null;
  readonly depth: number;
  readonly articleIds: readonly string[];
  readonly description: string | null;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateCategoryInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly parentCategoryId: string | null;
  readonly depth: number;
  readonly description: string | null;
  readonly createdByUserId: string;
}

export class Category {
  private readonly _domainEvents: NotionDomainEvent[] = [];

  private constructor(private _props: CategorySnapshot) {}

  static create(id: string, input: CreateCategoryInput): Category {
    const now = new Date().toISOString();
    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return new Category({
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      name: input.name,
      slug,
      parentCategoryId: input.parentCategoryId,
      depth: input.depth,
      articleIds: [],
      description: input.description,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
  }

  static reconstitute(snapshot: CategorySnapshot): Category {
    return new Category({ ...snapshot });
  }

  rename(newName: string): void {
    const now = new Date().toISOString();
    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    this._props = { ...this._props, name: newName, slug, updatedAtISO: now };
  }

  move(newParentId: string | null, newDepth: number): void {
    const now = new Date().toISOString();
    this._props = { ...this._props, parentCategoryId: newParentId, depth: newDepth, updatedAtISO: now };
  }

  getSnapshot(): CategorySnapshot {
    return { ...this._props };
  }

  pullDomainEvents(): NotionDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  get id(): string { return this._props.id; }
  get accountId(): string { return this._props.accountId; }
}
