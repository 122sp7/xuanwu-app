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
