/**
 * FirebaseWorkspaceNotificationPreferenceRepository
 *
 * Firestore collection: workspaceNotificationPreferences
 * Document path:        workspaceNotificationPreferences/{workspaceId}_{memberId}
 * Secondary index:      workspaceId ASC, subscribedEvents ARRAY_CONTAINS (fan-out query)
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
        try { return createWorkspaceNotificationEventType(e); } catch { return null; }
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
    const raw = await firestoreInfrastructureApi.get<PersistedPreference>(
      `${COLLECTION}/${docId(workspaceId, memberId)}`,
    );
    return raw ? toEntity(raw) : undefined;
  }

  async save(preference: WorkspaceNotificationPreference): Promise<void> {
    const data: PersistedPreference = {
      workspaceId: preference.workspaceId,
      memberId: preference.memberId,
      subscribedEvents: [...preference.subscribedEvents],
      updatedAtISO: preference.updatedAtISO,
    };
    await firestoreInfrastructureApi.set(
      `${COLLECTION}/${docId(preference.workspaceId, preference.memberId)}`,
      data,
    );
  }

  async findSubscribersByEventType(
    workspaceId: string,
    eventType: string,
  ): Promise<string[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<PersistedPreference>(
      COLLECTION,
      [
        { field: "workspaceId", op: "==", value: workspaceId },
        { field: "subscribedEvents", op: "array-contains", value: eventType },
      ],
    );
    return docs.map((d) => d.data.memberId);
  }
}
