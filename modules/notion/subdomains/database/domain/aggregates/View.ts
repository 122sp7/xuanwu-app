/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: View aggregate — configures how records are displayed in a Database.
 */

export type ViewType = "table" | "board" | "list" | "calendar" | "timeline" | "gallery";

export interface FilterRule {
  fieldId: string;
  operator: "eq" | "neq" | "contains" | "not_contains" | "is_empty" | "is_not_empty" | "gt" | "lt";
  value: unknown;
}

export interface SortRule {
  fieldId: string;
  direction: "asc" | "desc";
}

export interface ViewSnapshot {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  name: string;
  type: ViewType;
  filters: FilterRule[];
  sorts: SortRule[];
  groupBy: { fieldId: string; direction: "asc" | "desc" } | null;
  visibleFieldIds: string[];
  hiddenFieldIds: string[];
  boardGroupFieldId: string | null;
  calendarDateFieldId: string | null;
  timelineStartFieldId: string | null;
  timelineEndFieldId: string | null;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export type ViewId = string;
