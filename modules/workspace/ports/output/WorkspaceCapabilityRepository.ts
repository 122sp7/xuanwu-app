import type { Capability } from "../../domain/aggregates/Workspace";

export interface WorkspaceCapabilityRepository {
  mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void>;
  unmountCapability(workspaceId: string, capabilityId: string): Promise<void>;
}