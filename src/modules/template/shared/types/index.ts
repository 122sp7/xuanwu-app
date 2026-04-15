// shared/types — shared TypeScript types used across subdomains

/** Lightweight read model for list views. */
export interface TemplateSummary {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Generic paginated result wrapper. */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
