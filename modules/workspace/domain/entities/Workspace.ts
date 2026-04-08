/**
 * Workspace Domain Entities — pure TypeScript, zero framework dependencies.
 */

import type { Timestamp } from "@shared-types";
import type { WorkspaceAccessPolicy } from "./WorkspaceAccess";
import type { WorkspaceCapabilityAssignments } from "./WorkspaceCapability";
import type {
  WorkspaceOperationalProfile,
  WorkspacePersonnel,
} from "./WorkspaceProfile";
import type {
  AddressInput,
} from "../value-objects/Address";
import type {
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
} from "../value-objects/WorkspaceLifecycleState";
import type {
  WorkspaceName,
  WorkspaceNameInput,
} from "../value-objects/WorkspaceName";
import type {
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../value-objects/WorkspaceVisibility";

export interface WorkspaceEntity {
  id: string;
  name: WorkspaceName;
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
  name: WorkspaceName;
  photoURL?: string;
  lifecycleState: WorkspaceLifecycleState;
  visibility: WorkspaceVisibility;
  accountId: string;
  accountType: "user" | "organization";
  createdAt: Timestamp;
}

// ─── Commands ─────────────────────────────────────────────────────────────────

export interface CreateWorkspaceCommand {
  readonly name: WorkspaceNameInput;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
}

export interface UpdateWorkspaceSettingsCommand {
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name?: WorkspaceNameInput;
  readonly visibility?: WorkspaceVisibilityInput;
  readonly lifecycleState?: WorkspaceLifecycleStateInput;
  readonly address?: AddressInput;
  readonly personnel?: WorkspacePersonnel;
}

export type { WorkspaceGrant } from "./WorkspaceAccess";
export type { Capability, CapabilitySpec } from "./WorkspaceCapability";
export type { WorkspaceLocation } from "./WorkspaceLocation";
export type {
  Address,
  AddressInput,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
} from "./WorkspaceProfile";
export type {
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
} from "../value-objects/WorkspaceLifecycleState";
export type {
  WorkspaceName,
  WorkspaceNameInput,
} from "../value-objects/WorkspaceName";
export type {
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../value-objects/WorkspaceVisibility";
