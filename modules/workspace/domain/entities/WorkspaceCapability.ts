export interface CapabilitySpec {
  id: string;
  name: string;
  type: "ui" | "api" | "data" | "governance" | "monitoring";
  status: "stable" | "beta";
  description: string;
}

export interface Capability extends CapabilitySpec {
  config?: object;
}

export interface WorkspaceCapabilityAssignments {
  capabilities: Capability[];
}