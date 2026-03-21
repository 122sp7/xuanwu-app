/**
 * FirebaseWorkspaceRepository — Infrastructure adapter for workspace persistence.
 * Translates Firestore documents ↔ Domain WorkspaceEntity.
 * Firebase SDK only exists in this file.
 */

import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  documentId,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase";
import type { WorkspaceRepository } from "../../domain/repositories/WorkspaceRepository";
import type {
  WorkspaceEntity,
  Capability,
  WorkspaceGrant,
  UpdateWorkspaceSettingsCommand,
  WorkspaceLocation,
} from "../../domain/entities/Workspace";

// ─── Mapper ───────────────────────────────────────────────────────────────────

const VALID_ACCOUNT_TYPES = new Set<WorkspaceEntity["accountType"]>(["user", "organization"]);
const VALID_LIFECYCLE_STATES = new Set<WorkspaceEntity["lifecycleState"]>(["preparatory", "active", "stopped"]);
const VALID_VISIBILITY = new Set<WorkspaceEntity["visibility"]>(["visible", "hidden"]);

function toWorkspaceEntity(id: string, data: Record<string, unknown>): WorkspaceEntity {
  const accountType = VALID_ACCOUNT_TYPES.has(data.accountType as WorkspaceEntity["accountType"])
    ? (data.accountType as WorkspaceEntity["accountType"])
    : "user";
  const lifecycleState = VALID_LIFECYCLE_STATES.has(data.lifecycleState as WorkspaceEntity["lifecycleState"])
    ? (data.lifecycleState as WorkspaceEntity["lifecycleState"])
    : "preparatory";
  const visibility = VALID_VISIBILITY.has(data.visibility as WorkspaceEntity["visibility"])
    ? (data.visibility as WorkspaceEntity["visibility"])
    : "visible";

  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    accountType,
    lifecycleState,
    visibility,
    capabilities: Array.isArray(data.capabilities) ? (data.capabilities as Capability[]) : [],
    grants: Array.isArray(data.grants) ? (data.grants as WorkspaceGrant[]) : [],
    teamIds: Array.isArray(data.teamIds) ? (data.teamIds as string[]) : [],
    photoURL: typeof data.photoURL === "string" ? data.photoURL : undefined,
    address: data.address != null ? (data.address as WorkspaceEntity["address"]) : undefined,
    locations: Array.isArray(data.locations) ? (data.locations as WorkspaceLocation[]) : undefined,
    personnel: data.personnel != null ? (data.personnel as WorkspaceEntity["personnel"]) : undefined,
    createdAt: data.createdAt as WorkspaceEntity["createdAt"],
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class FirebaseWorkspaceRepository implements WorkspaceRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(id: string): Promise<WorkspaceEntity | null> {
    const snap = await getDoc(doc(this.db, "workspaces", id));
    if (!snap.exists()) return null;
    return toWorkspaceEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByIdForAccount(accountId: string, workspaceId: string): Promise<WorkspaceEntity | null> {
    const q = query(
      collection(this.db, "workspaces"),
      where("accountId", "==", accountId),
      where(documentId(), "==", workspaceId),
    );
    const snaps = await getDocs(q);
    const snap = snaps.docs[0];
    if (!snap) return null;
    return toWorkspaceEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async findAllByAccountId(accountId: string): Promise<WorkspaceEntity[]> {
    const q = query(collection(this.db, "workspaces"), where("accountId", "==", accountId));
    const snaps = await getDocs(q);
    return snaps.docs.map((d) => toWorkspaceEntity(d.id, d.data() as Record<string, unknown>));
  }

  async save(workspace: WorkspaceEntity): Promise<string> {
    const ref = doc(this.db, "workspaces", workspace.id);
    await setDoc(ref, {
      name: workspace.name,
      accountId: workspace.accountId,
      accountType: workspace.accountType,
      lifecycleState: workspace.lifecycleState,
      visibility: workspace.visibility,
      capabilities: workspace.capabilities,
      grants: workspace.grants,
      teamIds: workspace.teamIds,
      createdAt: serverTimestamp(),
    });
    return workspace.id;
  }

  async updateSettings(command: UpdateWorkspaceSettingsCommand): Promise<void> {
    const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (command.name !== undefined) updates.name = command.name;
    if (command.visibility !== undefined) updates.visibility = command.visibility;
    if (command.lifecycleState !== undefined) updates.lifecycleState = command.lifecycleState;
    if (command.address !== undefined) updates.address = command.address;
    if (command.personnel !== undefined) updates.personnel = command.personnel;
    await updateDoc(doc(this.db, "workspaces", command.workspaceId), updates);
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.db, "workspaces", id));
  }

  async mountCapabilities(workspaceId: string, capabilities: Capability[]): Promise<void> {
    await updateDoc(doc(this.db, "workspaces", workspaceId), {
      capabilities: arrayUnion(...capabilities),
      updatedAt: serverTimestamp(),
    });
  }

  async unmountCapability(workspaceId: string, capabilityId: string): Promise<void> {
    const snap = await getDoc(doc(this.db, "workspaces", workspaceId));
    if (!snap.exists()) return;
    const data = snap.data() as Record<string, unknown>;
    const caps = ((data.capabilities as Capability[]) ?? []).filter((c) => c.id !== capabilityId);
    await updateDoc(doc(this.db, "workspaces", workspaceId), {
      capabilities: caps,
      updatedAt: serverTimestamp(),
    });
  }

  async grantTeamAccess(workspaceId: string, teamId: string): Promise<void> {
    await updateDoc(doc(this.db, "workspaces", workspaceId), {
      teamIds: arrayUnion(teamId),
      updatedAt: serverTimestamp(),
    });
  }

  async revokeTeamAccess(workspaceId: string, teamId: string): Promise<void> {
    await updateDoc(doc(this.db, "workspaces", workspaceId), {
      teamIds: arrayRemove(teamId),
      updatedAt: serverTimestamp(),
    });
  }

  async grantIndividualAccess(workspaceId: string, grant: WorkspaceGrant): Promise<void> {
    await updateDoc(doc(this.db, "workspaces", workspaceId), {
      grants: arrayUnion(grant),
      updatedAt: serverTimestamp(),
    });
  }

  async revokeIndividualAccess(workspaceId: string, userId: string): Promise<void> {
    const snap = await getDoc(doc(this.db, "workspaces", workspaceId));
    if (!snap.exists()) return;
    const data = snap.data() as Record<string, unknown>;
    const grants = ((data.grants as WorkspaceGrant[]) ?? []).filter((g) => g.userId !== userId);
    await updateDoc(doc(this.db, "workspaces", workspaceId), {
      grants,
      updatedAt: serverTimestamp(),
    });
  }

  async createLocation(
    workspaceId: string,
    location: Omit<WorkspaceLocation, "locationId">,
  ): Promise<string> {
    const locationId = crypto.randomUUID();
    await updateDoc(doc(this.db, "workspaces", workspaceId), {
      locations: arrayUnion({ ...location, locationId }),
      updatedAt: serverTimestamp(),
    });
    return locationId;
  }

  async updateLocation(workspaceId: string, location: WorkspaceLocation): Promise<void> {
    const snap = await getDoc(doc(this.db, "workspaces", workspaceId));
    if (!snap.exists()) return;
    const data = snap.data() as Record<string, unknown>;
    const locations = ((data.locations as WorkspaceLocation[]) ?? []).map((l) =>
      l.locationId === location.locationId ? location : l,
    );
    await updateDoc(doc(this.db, "workspaces", workspaceId), {
      locations,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteLocation(workspaceId: string, locationId: string): Promise<void> {
    const snap = await getDoc(doc(this.db, "workspaces", workspaceId));
    if (!snap.exists()) return;
    const data = snap.data() as Record<string, unknown>;
    const locations = ((data.locations as WorkspaceLocation[]) ?? []).filter(
      (l) => l.locationId !== locationId,
    );
    await updateDoc(doc(this.db, "workspaces", workspaceId), {
      locations,
      updatedAt: serverTimestamp(),
    });
  }
}
