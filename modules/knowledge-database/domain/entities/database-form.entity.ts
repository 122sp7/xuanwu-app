/**
 * Module: knowledge-database
 * Layer: domain/entities
 * Purpose: DatabaseForm — shareable public form for collecting records into a Database.
 */

export interface DatabaseForm {
  id: string;
  databaseId: string;
  accountId: string;
  title: string;
  description?: string;
  /** Fields exposed in the form. Subset of database.fields. Empty = all fields. */
  fieldIds: string[];
  /** Whether the form accepts new submissions. */
  active: boolean;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export interface CreateDatabaseFormInput {
  databaseId: string;
  accountId: string;
  title: string;
  description?: string;
  fieldIds?: string[];
  createdByUserId: string;
}

export interface UpdateDatabaseFormInput {
  id: string;
  accountId: string;
  title?: string;
  description?: string;
  fieldIds?: string[];
  active?: boolean;
}
