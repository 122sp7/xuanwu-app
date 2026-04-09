import type { Capability } from "../../domain/entities/Workspace";

export interface WorkspaceCapabilityRepository {
  mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void>;
  unmountCapability(workspaceId: string, capabilityId: string): Promise<void>;
}