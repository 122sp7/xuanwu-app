/**
 * Module: notion/subdomains/knowledge-database
 * Layer: domain/aggregates
 * Purpose: Database aggregate root — structured data container with named fields.
 */

export type FieldType =
  | "text"
  | "number"
  | "select"
  | "multi_select"
  | "date"
  | "checkbox"
  | "url"
  | "email"
  | "relation"
  | "formula"
  | "rollup";

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  config: Record<string, unknown>;
  required: boolean;
  order: number;
}

export interface DatabaseSnapshot {
  id: string;
  workspaceId: string;
  accountId: string;
  name: string;
  description: string | null;
  fields: Field[];
  viewIds: string[];
  icon: string | null;
  coverImageUrl: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export type DatabaseId = string;
export type FieldId = string;
