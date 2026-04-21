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
  readonly parentPageId: string | null;
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
  readonly parentPageId?: string | null;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title: string;
  readonly description?: string;
  readonly properties?: DatabaseProperty[];
  readonly createdByUserId: string;
}

export class Database {
  private constructor(private _props: DatabaseSnapshot) {}

  private static createDefaultProperty(): DatabaseProperty {
    return {
      id: uuid(),
      name: "名稱",
      type: "text",
    };
  }

  static create(input: CreateDatabaseInput): Database {
    const now = new Date().toISOString();
    const properties = input.properties?.length
      ? input.properties
      : [Database.createDefaultProperty()];
    return new Database({
      id: uuid(),
      parentPageId: input.parentPageId ?? null,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      title: input.title,
      description: input.description,
      properties,
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
    const nextName = property.name.trim();
    if (!nextName) throw new Error("Property name cannot be empty");
    if (this._props.properties.some((p) => p.id === property.id)) {
      throw new Error(`Property with ID '${property.id}' already exists`);
    }
    if (this._props.properties.some((p) => p.name.trim().toLowerCase() === nextName.toLowerCase())) {
      throw new Error(`Property name '${nextName}' already exists (case-insensitive)`);
    }
    this._props = {
      ...this._props,
      properties: [...this._props.properties, { ...property, name: nextName }],
      updatedAtISO: new Date().toISOString(),
    };
  }

  get id(): string { return this._props.id; }
  get title(): string { return this._props.title; }
  get parentPageId(): string | null { return this._props.parentPageId; }
  get properties(): DatabaseProperty[] { return [...this._props.properties]; }

  getSnapshot(): Readonly<DatabaseSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
