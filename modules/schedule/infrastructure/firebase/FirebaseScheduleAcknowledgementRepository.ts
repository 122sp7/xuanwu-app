import {
  doc,
  getFirestore,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";
import {
  SCHEDULE_ACKNOWLEDGEMENT_ID_DELIMITER,
  AcknowledgeWorkspaceScheduleItemInput,
  WorkspaceScheduleAcknowledgement,
} from "../../domain/entities/ScheduleAcknowledgement";
import type { ScheduleAcknowledgementRepository } from "../../domain/repositories/ScheduleAcknowledgementRepository";

function createAcknowledgementId(workspaceId: string, scheduleItemId: string) {
  return `${workspaceId}${SCHEDULE_ACKNOWLEDGEMENT_ID_DELIMITER}${scheduleItemId}`;
}

function requireString(data: Record<string, unknown>, field: string) {
  const value = data[field];
  if (typeof value !== "string" || !value) {
    throw new Error(
      `Schedule acknowledgement field ${field} is missing, empty, or not a string.`,
    );
  }

  return value;
}

function toScheduleAcknowledgementEntity(
  id: string,
  data: Record<string, unknown>,
): WorkspaceScheduleAcknowledgement {
  return {
    id,
    workspaceId: requireString(data, "workspaceId"),
    scheduleItemId: requireString(data, "scheduleItemId"),
    acknowledgedByAccountId: requireString(data, "acknowledgedByAccountId"),
    acknowledgedAtISO: requireString(data, "acknowledgedAtISO"),
  };
}

export class FirebaseScheduleAcknowledgementRepository
  implements ScheduleAcknowledgementRepository
{
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async acknowledge(
    input: AcknowledgeWorkspaceScheduleItemInput,
  ): Promise<WorkspaceScheduleAcknowledgement> {
    const acknowledgementId = createAcknowledgementId(input.workspaceId, input.scheduleItemId);
    const acknowledgementRef = doc(this.db, "workspaceScheduleAcknowledgements", acknowledgementId);
    const nowISO = new Date().toISOString();

    return runTransaction(this.db, async (transaction) => {
      const existingAcknowledgement = await transaction.get(acknowledgementRef);
      if (existingAcknowledgement.exists()) {
        return toScheduleAcknowledgementEntity(
          existingAcknowledgement.id,
          existingAcknowledgement.data() as Record<string, unknown>,
        );
      }

      transaction.set(acknowledgementRef, {
        workspaceId: input.workspaceId,
        scheduleItemId: input.scheduleItemId,
        acknowledgedByAccountId: input.actorAccountId,
        acknowledgedAtISO: nowISO,
        updatedAtISO: nowISO,
        updatedAt: serverTimestamp(),
      });

      return {
        id: acknowledgementId,
        workspaceId: input.workspaceId,
        scheduleItemId: input.scheduleItemId,
        acknowledgedByAccountId: input.actorAccountId,
        acknowledgedAtISO: nowISO,
      };
    });
  }
}
