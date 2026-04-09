/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Entity: WikiLibrary — structured database entity used by wiki-style views.
 */

export type WikiLibraryStatus = "active" | "archived";
export type WikiLibraryFieldType = "title" | "text" | "number" | "select" | "relation";

export interface WikiLibrary {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly slug: string;
  readonly status: WikiLibraryStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface WikiLibraryField {
  readonly id: string;
  readonly libraryId: string;
  readonly key: string;
  readonly label: string;
  readonly type: WikiLibraryFieldType;
  readonly required: boolean;
  readonly options?: readonly string[];
  readonly createdAt: Date;
}

export interface WikiLibraryRow {
  readonly id: string;
  readonly libraryId: string;
  readonly values: Record<string, unknown>;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateWikiLibraryInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
}

export interface AddWikiLibraryFieldInput {
  readonly accountId: string;
  readonly libraryId: string;
  readonly key: string;
  readonly label: string;
  readonly type: WikiLibraryFieldType;
  readonly required?: boolean;
  readonly options?: readonly string[];
}

export interface CreateWikiLibraryRowInput {
  readonly accountId: string;
  readonly libraryId: string;
  readonly values: Record<string, unknown>;
}
