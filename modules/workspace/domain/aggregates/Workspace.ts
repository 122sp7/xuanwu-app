/**
 * Workspace Domain Entities — pure TypeScript, zero framework dependencies.
 */

import { v4 as uuid } from "@lib-uuid";
import type { Timestamp } from "@shared-types";
import type { WorkspaceAccessPolicy, WorkspaceGrant } from "../entities/WorkspaceAccess";
import type {
  Capability,
  WorkspaceCapabilityAssignments,
} from "../entities/WorkspaceCapability";
import type { WorkspaceLocation } from "../entities/WorkspaceLocation";
import type {
  Address,
  WorkspaceOperationalProfile,
  WorkspacePersonnel,
} from "../entities/WorkspaceProfile";
import { createAddress, type AddressInput } from "../value-objects/Address";
import type {
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
} from "../value-objects/WorkspaceLifecycleState";
import {
  canTransitionWorkspaceLifecycleState,
  createWorkspaceLifecycleState,
} from "../value-objects/WorkspaceLifecycleState";
import type {
  WorkspaceName,
  WorkspaceNameInput,
} from "../value-objects/WorkspaceName";
import { createWorkspaceName } from "../value-objects/WorkspaceName";
import type {
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../value-objects/WorkspaceVisibility";
import { createWorkspaceVisibility } from "../value-objects/WorkspaceVisibility";
import {
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
  type WorkspaceDomainEvent,
} from "../events/workspace.events";

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
    WorkspaceOperationalProfile {}

// ─── Commands ─────────────────────────────────────────────────────────────────

export interface CreateWorkspaceCommand {
  readonly name: WorkspaceNameInput;
  readonly accountId: string;
  readonly accountType: "user" | "organization";
  readonly creatorUserId?: string;
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

type WorkspaceSettingsPatch = Omit<
  UpdateWorkspaceSettingsCommand,
  "workspaceId" | "accountId"
>;

function createWorkspaceTimestamp(date = new Date()): Timestamp {
  const milliseconds = date.getTime();
  const seconds = Math.floor(milliseconds / 1000);
  const nanoseconds = (milliseconds % 1000) * 1_000_000;

  return {
    seconds,
    nanoseconds,
    toDate: () => new Date(milliseconds),
  };
}

function cloneCapabilities(capabilities: Capability[] = []): Capability[] {
  return capabilities.map((capability) => ({
    ...capability,
    config:
      capability.config !== undefined && capability.config !== null
        ? { ...capability.config }
        : capability.config,
  }));
}

function cloneGrants(grants: WorkspaceGrant[] = []): WorkspaceGrant[] {
  return grants.map((grant) => ({ ...grant }));
}

function cloneLocations(locations?: WorkspaceLocation[]): WorkspaceLocation[] | undefined {
  return locations?.map((location) => ({ ...location }));
}

function clonePersonnel(
  personnel?: WorkspacePersonnel,
): WorkspacePersonnel | undefined {
  if (!personnel) {
    return undefined;
  }

  return {
    ...personnel,
    customRoles: personnel.customRoles?.map((role) => ({ ...role })),
  };
}

function normalizeAccountId(accountId: string): string {
  const normalizedAccountId = accountId.trim();
  if (!normalizedAccountId) {
    throw new Error("Workspace accountId is required");
  }

  return normalizedAccountId;
}

export class Workspace implements WorkspaceEntity {
  readonly id: string;

  name: WorkspaceName;

  photoURL?: string;

  lifecycleState: WorkspaceLifecycleState;

  visibility: WorkspaceVisibility;

  readonly accountId: string;

  readonly accountType: "user" | "organization";

  readonly createdAt: Timestamp;

  capabilities: Capability[];

  grants: WorkspaceGrant[];

  teamIds: string[];

  address?: Address;

  locations?: WorkspaceLocation[];

  personnel?: WorkspacePersonnel;

  private readonly _domainEvents: WorkspaceDomainEvent[] = [];

  private constructor(snapshot: WorkspaceEntity) {
    this.id = snapshot.id;
    this.name = snapshot.name;
    this.photoURL = snapshot.photoURL?.trim() || undefined;
    this.lifecycleState = snapshot.lifecycleState;
    this.visibility = snapshot.visibility;
    this.accountId = normalizeAccountId(snapshot.accountId);
    this.accountType = snapshot.accountType;
    this.createdAt = snapshot.createdAt;
    this.capabilities = cloneCapabilities(snapshot.capabilities);
    this.grants = cloneGrants(snapshot.grants);
    this.teamIds = [...snapshot.teamIds];
    this.address = snapshot.address;
    this.locations = cloneLocations(snapshot.locations);
    this.personnel = clonePersonnel(snapshot.personnel);
  }

  static create(command: CreateWorkspaceCommand): Workspace {
    const initialGrants: WorkspaceGrant[] =
      command.creatorUserId?.trim()
        ? [{ userId: command.creatorUserId.trim(), role: "owner" }]
        : [];

    const workspace = new Workspace({
      id: uuid(),
      name: createWorkspaceName(command.name),
      accountId: normalizeAccountId(command.accountId),
      accountType: command.accountType,
      lifecycleState: createWorkspaceLifecycleState("preparatory"),
      visibility: createWorkspaceVisibility("visible"),
      capabilities: [],
      grants: initialGrants,
      teamIds: [],
      createdAt: createWorkspaceTimestamp(),
    });

    workspace._domainEvents.push(
      createWorkspaceCreatedEvent({
        workspaceId: workspace.id,
        accountId: workspace.accountId,
        accountType: workspace.accountType,
        name: workspace.name,
      }),
    );

    return workspace;
  }

  static reconstitute(snapshot: WorkspaceEntity): Workspace {
    return new Workspace(snapshot);
  }

  rename(nextName: WorkspaceNameInput): void {
    this.name = createWorkspaceName(nextName);
  }

  changeVisibility(nextVisibility: WorkspaceVisibilityInput): void {
    const prev = this.visibility;
    this.visibility = createWorkspaceVisibility(nextVisibility);
    if (prev !== this.visibility) {
      this._domainEvents.push(
        createWorkspaceVisibilityChangedEvent({
          workspaceId: this.id,
          accountId: this.accountId,
          fromVisibility: prev,
          toVisibility: this.visibility,
        }),
      );
    }
  }

  activate(): void {
    this.transitionLifecycle("active");
  }

  stop(): void {
    this.transitionLifecycle("stopped");
  }

  transitionLifecycle(nextState: WorkspaceLifecycleStateInput): void {
    const normalizedNextState = createWorkspaceLifecycleState(nextState);
    if (normalizedNextState === this.lifecycleState) {
      return;
    }

    if (
      !canTransitionWorkspaceLifecycleState(
        this.lifecycleState,
        normalizedNextState,
      )
    ) {
      throw new Error(
        `Invalid workspace lifecycle transition: ${this.lifecycleState} -> ${normalizedNextState}`,
      );
    }

    const prev = this.lifecycleState;
    this.lifecycleState = normalizedNextState;
    this._domainEvents.push(
      createWorkspaceLifecycleTransitionedEvent({
        workspaceId: this.id,
        accountId: this.accountId,
        fromState: prev,
        toState: this.lifecycleState,
      }),
    );
  }

  updateAddress(nextAddress: AddressInput): void {
    this.address = createAddress(nextAddress);
  }

  updatePersonnel(nextPersonnel: WorkspacePersonnel): void {
    this.personnel = clonePersonnel(nextPersonnel);
  }

  applySettings(patch: WorkspaceSettingsPatch): void {
    if (patch.name !== undefined) {
      this.rename(patch.name);
    }

    if (patch.visibility !== undefined) {
      this.changeVisibility(patch.visibility);
    }

    if (patch.lifecycleState !== undefined) {
      this.transitionLifecycle(patch.lifecycleState);
    }

    if (patch.address !== undefined) {
      this.updateAddress(patch.address);
    }

    if (patch.personnel !== undefined) {
      this.updatePersonnel(patch.personnel);
    }
  }

  pullDomainEvents(): WorkspaceDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  toSnapshot(): WorkspaceEntity {
    return {
      id: this.id,
      name: this.name,
      photoURL: this.photoURL,
      lifecycleState: this.lifecycleState,
      visibility: this.visibility,
      accountId: this.accountId,
      accountType: this.accountType,
      createdAt: this.createdAt,
      capabilities: cloneCapabilities(this.capabilities),
      grants: cloneGrants(this.grants),
      teamIds: [...this.teamIds],
      address: this.address,
      locations: cloneLocations(this.locations),
      personnel: clonePersonnel(this.personnel),
    };
  }
}

export type { WorkspaceGrant } from "../entities/WorkspaceAccess";
export type { Capability, CapabilitySpec } from "../entities/WorkspaceCapability";
export type { WorkspaceLocation } from "../entities/WorkspaceLocation";
export type {
  Address,
  AddressInput,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
} from "../entities/WorkspaceProfile";
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
