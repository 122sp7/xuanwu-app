/**
 * View — distilled from modules/notion/subdomains/knowledge (relations/filters)
 * Represents a filtered/sorted view of a database.
 */
export type ViewType = "table" | "board" | "gallery" | "list" | "calendar" | "timeline";

export interface FilterCondition {
  readonly propertyId: string;
  readonly operator: "equals" | "not_equals" | "contains" | "not_contains" | "is_empty" | "is_not_empty" | "greater_than" | "less_than";
  readonly value?: unknown;
}

export interface SortCondition {
  readonly propertyId: string;
  readonly direction: "asc" | "desc";
}

export interface ViewSnapshot {
  readonly id: string;
  readonly databaseId: string;
  readonly name: string;
  readonly type: ViewType;
  readonly filters: FilterCondition[];
  readonly sorts: SortCondition[];
  readonly visiblePropertyIds: string[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface ViewRepository {
  save(snapshot: ViewSnapshot): Promise<void>;
  findById(id: string): Promise<ViewSnapshot | null>;
  findByDatabaseId(databaseId: string): Promise<ViewSnapshot[]>;
  delete(id: string): Promise<void>;
}
