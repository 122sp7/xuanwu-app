/**
 * Module: asset
 * Layer: domain/entities
 * Purpose: WikiBeta-style library entity — lightweight structured-data model
 *          used by the wiki-beta interfaces during the transitional period.
 *          Lives in asset because libraries are an asset/database-resource concern.
 */

export type WikiBetaLibraryStatus = "active" | "archived";
export type WikiBetaLibraryFieldType = "title" | "text" | "number" | "select" | "relation";

export interface WikiBetaLibrary {
  id: string;
  accountId: string;
  workspaceId?: string;
  name: string;
  slug: string;
  status: WikiBetaLibraryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WikiBetaLibraryField {
  id: string;
  libraryId: string;
  key: string;
  label: string;
  type: WikiBetaLibraryFieldType;
  required: boolean;
  options?: string[];
  createdAt: Date;
}

export interface WikiBetaLibraryRow {
  id: string;
  libraryId: string;
  values: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWikiBetaLibraryInput {
  accountId: string;
  workspaceId?: string;
  name: string;
}

export interface AddWikiBetaLibraryFieldInput {
  accountId: string;
  libraryId: string;
  key: string;
  label: string;
  type: WikiBetaLibraryFieldType;
  required?: boolean;
  options?: string[];
}

export interface CreateWikiBetaLibraryRowInput {
  accountId: string;
  libraryId: string;
  values: Record<string, unknown>;
}
