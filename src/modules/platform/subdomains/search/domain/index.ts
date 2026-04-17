// search — domain layer
// Owns shell command catalog: searchable navigation items for quick-open palette.

export interface SearchItem {
  readonly href: string;
  readonly label: string;
  readonly group: string;
}

export interface SearchCatalogPort {
  listItems(): readonly SearchItem[];
}
