/**
 * FirebaseWorkspaceNotificationPreferenceRepository
 *
 * Infrastructure adapter implementing the WorkspaceNotificationPreferenceRepository port.
 * Uses the platform infrastructure API (Firestore) for persistence.
 *
 * Firestore collection: workspaceNotificationPreferences
 * Document path:        workspaceNotificationPreferences/{workspaceId}_{memberId}
 * Composite index:      workspaceId ASC, memberId ASC (implicit on doc ID)
 * Secondary index:      workspaceId ASC, subscribedEvents ARRAY_CONTAINS (for fan-out query)
 */

import { firestoreInfrastructureApi } from "@/modules/platform/api/infrastructure";
import type { WorkspaceNotificationPreferenceRepository } from "../../domain/repositories/WorkspaceNotificationPreferenceRepository";
import { WorkspaceNotificationPreference } from "../../domain/entities/WorkspaceNotificationPreference";
import { createWorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";
import type { WorkspaceNotificationEventType } from "../../domain/value-objects/WorkspaceNotificationEventType";

const COLLECTION = "workspaceNotificationPreferences";

function docId(workspaceId: string, memberId: string): string {
  return `${workspaceId}_${memberId}`;
}

interface PersistedPreference {
  workspaceId: string;
  memberId: string;
  subscribedEvents: string[];
  updatedAtISO: string;
}

function toEntity(data: PersistedPreference): WorkspaceNotificationPreference {
  const events = new Set<WorkspaceNotificationEventType>(
    data.subscribedEvents
      .map((e) => {
        try {
          return createWorkspaceNotificationEventType(e);
        } catch {
          return null;
        }
      })
      .filter((e): e is WorkspaceNotificationEventType => e !== null),
  );

  return WorkspaceNotificationPreference.reconstitute({
    workspaceId: data.workspaceId,
    memberId: data.memberId,
    subscribedEvents: events,
    updatedAtISO: data.updatedAtISO,
  });
}

export class FirebaseWorkspaceNotificationPreferenceRepository
  implements WorkspaceNotificationPreferenceRepository
{
  async findByMember(
    workspaceId: string,
    memberId: string,
  ): Promise<WorkspaceNotificationPreference | undefined> {
    const id = docId(workspaceId, memberId);
    const raw = await firestoreInfrastructureApi.get<PersistedPreference>(
      `${COLLECTION}/${id}`,
    );
    if (!raw) return undefined;
    return toEntity(raw);
  }

  async save(preference: WorkspaceNotificationPreference): Promise<void> {
    const id = docId(preference.workspaceId, preference.memberId);
    const data: PersistedPreference = {
      workspaceId: preference.workspaceId,
      memberId: preference.memberId,
      subscribedEvents: [...preference.subscribedEvents],
      updatedAtISO: preference.updatedAtISO,
    };
    await firestoreInfrastructureApi.set(`${COLLECTION}/${id}`, data);
  }

  async findSubscribersByEventType(
    workspaceId: string,
    eventType: string,
  ): Promise<string[]> {
    const docs =
      await firestoreInfrastructureApi.queryDocuments<PersistedPreference>(
        COLLECTION,
        [
          { field: "workspaceId", op: "==", value: workspaceId },
          { field: "subscribedEvents", op: "array-contains", value: eventType },
        ],
      );
    return docs.map((d) => d.data.memberId);
  }
}
