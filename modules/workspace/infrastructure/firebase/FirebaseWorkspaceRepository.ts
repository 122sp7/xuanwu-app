/**
 * FirebaseWorkspaceRepository — Infrastructure adapter for workspace persistence.
 * Translates Firestore documents ↔ Domain WorkspaceEntity.
 * Firebase SDK only exists in this file.
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import type { WorkspaceRepository } from "../../domain/ports/output/WorkspaceRepository";
import type { WorkspaceCapabilityRepository } from "../../domain/ports/output/WorkspaceCapabilityRepository";
import type { WorkspaceAccessRepository } from "../../domain/ports/output/WorkspaceAccessRepository";
import type { WorkspaceLocationRepository } from "../../domain/ports/output/WorkspaceLocationRepository";
import type {
  WorkspaceEntity,
  Capability,
  WorkspaceGrant,
  UpdateWorkspaceSettingsCommand,
  WorkspaceLocation,
} from "../../domain/aggregates/Workspace";
import { createAddress } from "../../domain/value-objects/Address";
import { createWorkspaceLifecycleState } from "../../domain/value-objects/WorkspaceLifecycleState";
import { createWorkspaceName } from "../../domain/value-objects/WorkspaceName";
import { createWorkspaceVisibility } from "../../domain/value-objects/WorkspaceVisibility";

// ─── Mapper ───────────────────────────────────────────────────────────────────

const VALID_ACCOUNT_TYPES = new Set<WorkspaceEntity["accountType"]>(["user", "organization"]);

export function toWorkspaceEntity(id: string, data: Record<string, unknown>): WorkspaceEntity {
  const accountType = VALID_ACCOUNT_TYPES.has(data.accountType as WorkspaceEntity["accountType"])
    ? (data.accountType as WorkspaceEntity["accountType"])
    : "user";

  return {
    id,
    name: createWorkspaceName(typeof data.name === "string" ? data.name : "Untitled workspace"),
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    accountType,
    lifecycleState: createWorkspaceLifecycleState(
      data.lifecycleState === "active" ||
        data.lifecycleState === "stopped" ||
        data.lifecycleState === "preparatory"
        ? data.lifecycleState
        : "preparatory",
    ),
    visibility: createWorkspaceVisibility(
      data.visibility === "hidden" || data.visibility === "visible"
        ? data.visibility
        : "visible",
    ),
    capabilities: Array.isArray(data.capabilities) ? (data.capabilities as Capability[]) : [],
    grants: Array.isArray(data.grants) ? (data.grants as WorkspaceGrant[]) : [],
    teamIds: Array.isArray(data.teamIds) ? (data.teamIds as string[]) : [],
    photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
    address: data.address != null ? createAddress(data.address as NonNullable<UpdateWorkspaceSettingsCommand["address"]>) : undefined,
    locations: Array.isArray(data.locations) ? (data.locations as WorkspaceLocation[]) : undefined,
    personnel: data.personnel != null ? (data.personnel as WorkspaceEntity["personnel"]) : undefined,
    createdAt: data.createdAt as WorkspaceEntity["createdAt"],
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class FirebaseWorkspaceRepository
  implements
    WorkspaceRepository,
    WorkspaceCapabilityRepository,
    WorkspaceAccessRepository,
    WorkspaceLocationRepository {
  private workspacePath(workspaceId: string): string {
    return `workspaces/${workspaceId}`;
  }

  async findById(id: string): Promise<WorkspaceEntity | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.workspacePath(id));
    if (!data) return null;
    return toWorkspaceEntity(id, data);
  }

  async findByIdForAccount(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      "workspaces",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    const target = docs.find((doc) => doc.id === workspaceId);
    if (!target) return null;
    return toWorkspaceEntity(target.id, target.data);
  }

  async findAllByAccountId(accountId: string): Promise<WorkspaceEntity[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      "workspaces",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    return docs.map((doc) => toWorkspaceEntity(doc.id, doc.data));
  }

  async save(workspace: WorkspaceEntity): Promise<string> {
    const payload: Record<string, unknown> = {
      name: workspace.name,
      accountId: workspace.accountId,
      accountType: workspace.accountType,
      lifecycleState: workspace.lifecycleState,
      visibility: workspace.visibility,
      capabilities: workspace.capabilities,
      grants: workspace.grants,
      teamIds: workspace.teamIds,
      createdAtISO: new Date().toISOString(),
    };

    if (workspace.photoURL !== undefined) payload.photoURL = workspace.photoURL;
    if (workspace.address !== undefined) payload.address = workspace.address;
    if (workspace.locations !== undefined) payload.locations = workspace.locations;
    if (workspace.personnel !== undefined) payload.personnel = workspace.personnel;

    await firestoreInfrastructureApi.set(this.workspacePath(workspace.id), payload);
    return workspace.id;
  }

  async updateSettings(command: UpdateWorkspaceSettingsCommand): Promise<void> {
    const updates: Record<string, unknown> = { updatedAtISO: new Date().toISOString() };
    if (command.name !== undefined) updates.name = command.name;
    if (command.visibility !== undefined) updates.visibility = command.visibility;
    if (command.lifecycleState !== undefined) updates.lifecycleState = command.lifecycleState;
    if (command.address !== undefined) updates.address = command.address;
    if (command.personnel !== undefined) updates.personnel = command.personnel;
    await firestoreInfrastructureApi.update(this.workspacePath(command.workspaceId), updates);
  }

  async delete(id: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.workspacePath(id));
  }

  async mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const existing = Array.isArray(data.capabilities) ? (data.capabilities as Capability[]) : [];
    const merged = [...existing];
    capabilities.forEach((capability) => {
      if (!merged.some((item) => item.id === capability.id)) {
        merged.push(capability);
      }
    });

    await firestoreInfrastructureApi.update(path, {
      capabilities: merged,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async unmountCapability(workspaceId: string, capabilityId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const caps = ((data.capabilities as Capability[]) ?? []).filter((c) => c.id !== capabilityId);
    await firestoreInfrastructureApi.update(path, {
      capabilities: caps,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async grantTeamAccess(workspaceId: string, teamId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const teamIds = Array.isArray(data.teamIds) ? [...(data.teamIds as string[])] : [];
    if (!teamIds.includes(teamId)) {
      teamIds.push(teamId);
    }
    await firestoreInfrastructureApi.update(path, {
      teamIds,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async revokeTeamAccess(workspaceId: string, teamId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const teamIds = (Array.isArray(data.teamIds) ? (data.teamIds as string[]) : []).filter((item) => item !== teamId);
    await firestoreInfrastructureApi.update(path, {
      teamIds,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async grantIndividualAccess(workspaceId: string, grant: WorkspaceGrant): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const grants = Array.isArray(data.grants) ? [...(data.grants as WorkspaceGrant[])] : [];
    const exists = grants.some((item) => item.userId === grant.userId && item.teamId === grant.teamId);
    if (!exists) {
      grants.push(grant);
    }
    await firestoreInfrastructureApi.update(path, {
      grants,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async revokeIndividualAccess(workspaceId: string, userId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const grants = ((data.grants as WorkspaceGrant[]) ?? []).filter((g) => g.userId !== userId);
    await firestoreInfrastructureApi.update(path, {
      grants,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async createLocation(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<string> {
    const locationId = crypto.randomUUID();
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return locationId;
    const locations = Array.isArray(data.locations) ? [...(data.locations as WorkspaceLocation[])] : [];
    locations.push({ ...location, locationId });
    await firestoreInfrastructureApi.update(path, {
      locations,
      updatedAtISO: new Date().toISOString(),
    });
    return locationId;
  }

  async updateLocation(workspaceId: string, location: WorkspaceLocation): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const locations = ((data.locations as WorkspaceLocation[]) ?? []).map((l) =>
      l.locationId === location.locationId ? location : l,
    );
    await firestoreInfrastructureApi.update(path, {
      locations,
      updatedAtISO: new Date().toISOString(),
    });
  }

  async deleteLocation(workspaceId: string, locationId: string): Promise<void> {
    const path = this.workspacePath(workspaceId);
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!data) return;
    const locations = ((data.locations as WorkspaceLocation[]) ?? []).filter(
      (l) => l.locationId !== locationId,
    );
    await firestoreInfrastructureApi.update(path, {
      locations,
      updatedAtISO: new Date().toISOString(),
    });
  }
}
