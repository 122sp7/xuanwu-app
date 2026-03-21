/**
 * Workspace Domain Entities — pure TypeScript, zero framework dependencies.
 */

import type { Timestamp } from "@shared-types";

export type WorkspaceLifecycleState = "preparatory" | "active" | "stopped";

export interface WorkspacePersonnel {
  managerId?: string;
  supervisorId?: string;
  safetyOfficerId?: string;
}

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

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  details?: string;
}

export interface WorkspaceLocation {
  locationId: string;
  label: string;
  description?: string;
  capacity?: number;
}

export type WorkspaceVisibility = "visible" | "hidden";

export interface WorkspaceGrant {
  userId?: string;
  teamId?: string;
  role: string;
  protocol?: string;
}

export interface WorkspaceEntity {
  id: string;
  name: string;
  photoURL?: string;
  lifecycleState: WorkspaceLifecycleState;
  visibility: WorkspaceVisibility;
  accountId: string;
  accountType: "user" | "organization";
  capabilities: Capability[];
  grants: WorkspaceGrant[];
  teamIds: string[];
  address?: Address;
  locations?: WorkspaceLocation[];
  personnel?: WorkspacePersonnel;
  createdAt: Timestamp;
}

// ─── Commands ─────────────────────────────────────────────────────────────────

export interface CreateWorkspaceCommand {
  readonly name: string;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
}

export interface UpdateWorkspaceSettingsCommand {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name?: string;
  readonly visibility?: WorkspaceVisibility;
  readonly lifecycleState?: WorkspaceLifecycleState;
  readonly address?: Address;
  readonly personnel?: WorkspacePersonnel;
}
