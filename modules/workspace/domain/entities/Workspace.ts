/**
 * Workspace Domain Entities — pure TypeScript, zero framework dependencies.
 */

import type { Timestamp } from "@shared-types";
import type { WorkspaceAccessPolicy } from "./WorkspaceAccess";
import type { WorkspaceCapabilityAssignments } from "./WorkspaceCapability";
import type {
  Address,
  WorkspaceOperationalProfile,
  WorkspacePersonnel,
} from "./WorkspaceProfile";

export type WorkspaceLifecycleState = "preparatory" | "active" | "stopped";

export type WorkspaceVisibility = "visible" | "hidden";

export interface WorkspaceEntity {
  id: string;
  name: string;
  photoURL?: string;
  lifecycleState: WorkspaceLifecycleState;
  visibility: WorkspaceVisibility;
  accountId: string;
  accountType: "user" | "organization";
  createdAt: Timestamp;
}

export interface WorkspaceEntity
  extends WorkspaceCapabilityAssignments,
    WorkspaceAccessPolicy,
    WorkspaceOperationalProfile {
  id: string;
  name: string;
  photoURL?: string;
  lifecycleState: WorkspaceLifecycleState;
  visibility: WorkspaceVisibility;
  accountId: string;
  accountType: "user" | "organization";
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

export type { WorkspaceGrant } from "./WorkspaceAccess";
export type { Capability, CapabilitySpec } from "./WorkspaceCapability";
export type { WorkspaceLocation } from "./WorkspaceLocation";
export type {
  Address,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
} from "./WorkspaceProfile";
