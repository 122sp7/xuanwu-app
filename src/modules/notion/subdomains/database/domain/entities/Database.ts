/**
 * Database — distilled from modules/notion/subdomains/knowledge/domain/aggregates/KnowledgeCollection.ts
 * Represents a structured collection of pages with typed properties (Notion-style database).
 */
import { v4 as uuid } from "uuid";

export type PropertyType = "text" | "number" | "select" | "multi_select" | "date" | "checkbox" | "url" | "email" | "file" | "relation";

export interface DatabaseProperty {
  readonly id: string;
  readonly name: string;
  readonly type: PropertyType;
  readonly options?: string[];
}

export type DatabaseStatus = "active" | "archived";

export interface DatabaseSnapshot {
  readonly id: string;
  readonly pageId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly properties: DatabaseProperty[];
  readonly status: DatabaseStatus;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateDatabaseInput {
  readonly pageId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly properties?: DatabaseProperty[];
  readonly createdByUserId: string;
}

export class Database {
  private constructor(private _props: DatabaseSnapshot) {}

  static create(input: CreateDatabaseInput): Database {
    const now = new Date().toISOString();
    return new Database({
      id: uuid(),
      pageId: input.pageId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      title: input.title,
      description: input.description,
      properties: input.properties ?? [],
      status: "active",
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    });
  }

  static reconstitute(snapshot: DatabaseSnapshot): Database {
    return new Database(snapshot);
  }

  addProperty(property: DatabaseProperty): void {
    if (this._props.properties.some((p) => p.id === property.id)) throw new Error(`Property ${property.id} already exists`);
    this._props = {
      ...this._props,
      properties: [...this._props.properties, property],
      updatedAtISO: new Date().toISOString(),
    };
  }

  get id(): string { return this._props.id; }
  get title(): string { return this._props.title; }
  get pageId(): string { return this._props.pageId; }
  get properties(): DatabaseProperty[] { return [...this._props.properties]; }

  getSnapshot(): Readonly<DatabaseSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
