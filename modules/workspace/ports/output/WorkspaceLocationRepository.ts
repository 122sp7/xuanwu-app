import type { WorkspaceLocation } from "../../domain/aggregates/Workspace";

export interface WorkspaceLocationRepository {
  createLocation(workspaceId: string, location: Omit<WorkspaceLocation, "locationId">): Promise<string>;
  updateLocation(workspaceId: string, location: WorkspaceLocation): Promise<void>;
  deleteLocation(workspaceId: string, locationId: string): Promise<void>;
}