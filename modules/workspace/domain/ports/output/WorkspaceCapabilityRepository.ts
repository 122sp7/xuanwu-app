import type { Capability } from "../../aggregates/Workspace";

export interface WorkspaceCapabilityRepository {
  mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void>;
  unmountCapability(workspaceId: string, capabilityId: string): Promise<void>;
}