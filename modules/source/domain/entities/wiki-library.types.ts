/**
 * Module: source
 * Layer: domain/entities
 * Purpose: Wiki-style library entity — lightweight structured-data model
 *          used by the wiki interfaces during the transitional period.
 *          Lives in asset because libraries are an asset/database-resource concern.
 */

export type WikiLibraryStatus = "active" | "archived";
export type WikiLibraryFieldType = "title" | "text" | "number" | "select" | "relation";

export interface WikiLibrary {
  id: string;
  accountId: string;
  workspaceId?: string;
  name: string;
  slug: string;
  status: WikiLibraryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WikiLibraryField {
  id: string;
  libraryId: string;
  key: string;
  label: string;
  type: WikiLibraryFieldType;
  required: boolean;
  options?: string[];
  createdAt: Date;
}

export interface WikiLibraryRow {
  id: string;
  libraryId: string;
  values: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWikiLibraryInput {
  accountId: string;
  workspaceId?: string;
  name: string;
}

export interface AddWikiLibraryFieldInput {
  accountId: string;
  libraryId: string;
  key: string;
  label: string;
  type: WikiLibraryFieldType;
  required?: boolean;
  options?: string[];
}

export interface CreateWikiLibraryRowInput {
  accountId: string;
  libraryId: string;
  values: Record<string, unknown>;
}
