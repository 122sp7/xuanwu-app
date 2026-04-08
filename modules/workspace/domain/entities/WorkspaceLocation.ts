export interface WorkspaceLocation {
  locationId: string;
  label: string;
  description?: string;
  capacity?: number;
}

export interface WorkspaceLocationCatalog {
  locations?: WorkspaceLocation[];
}