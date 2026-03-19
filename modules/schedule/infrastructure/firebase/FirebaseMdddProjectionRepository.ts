import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type { ScheduleDomainEvent } from "../../domain/mddd/events/ScheduleDomainEvents";
import type { ScheduleMdddProjectionRepository } from "../../domain/mddd/repositories/ProjectionRepository";
import type { ScheduleMdddProjectionQueryRepository } from "../../domain/mddd/repositories/ProjectionQueryRepository";
import type { ScheduleMdddFlowProjection } from "../../domain/mddd/value-objects/Projection";

const COLLECTION_NAME = "scheduleMdddFlowProjections";

function appendEventType(
  eventTypes: readonly string[],
  eventType: string,
): readonly string[] {
  if (eventTypes.includes(eventType)) {
    return eventTypes;
  }
  return [...eventTypes, eventType];
}

function applyEvent(
  current: ScheduleMdddFlowProjection | null,
  event: ScheduleDomainEvent,
): ScheduleMdddFlowProjection {
  const base: ScheduleMdddFlowProjection =
    current ?? {
      requestId: event.requestId,
      workspaceId: "",
      organizationId: "",
      requestStatus: "submitted",
      taskId: null,
      taskStatus: null,
      assignmentId: null,
      assignmentStatus: null,
      scheduleId: null,
      scheduleStatus: null,
      assigneeAccountUserId: null,
      lastReason: null,
      eventTypes: [],
      updatedAtISO: event.occurredAtISO,
    };

  switch (event.type) {
    case "RequestCreated":
      return {
        ...base,
        workspaceId: event.workspaceId,
        organizationId: event.organizationId,
        requestStatus: "submitted",
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
    case "RequestAccepted":
      return {
        ...base,
        workspaceId: event.workspaceId,
        organizationId: event.organizationId,
        requestStatus: "accepted",
        lastReason: null,
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
    case "RequestRejected":
      return {
        ...base,
        workspaceId: event.workspaceId,
        organizationId: event.organizationId,
        requestStatus: "rejected",
        lastReason: event.reason,
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
    case "TaskMatched":
      return {
        ...base,
        taskId: event.taskId,
        taskStatus: "assignable",
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
    case "AssignmentAccepted":
      return {
        ...base,
        taskId: event.taskId,
        assignmentId: event.assignmentId,
        assignmentStatus: "accepted",
        taskStatus: "assigned",
        assigneeAccountUserId: event.assigneeAccountUserId,
        lastReason: null,
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
    case "AssignmentRejected":
      return {
        ...base,
        taskId: event.taskId,
        assignmentId: event.assignmentId,
        assignmentStatus: "rejected",
        taskStatus: "assignable",
        assigneeAccountUserId: event.assigneeAccountUserId,
        lastReason: event.reason,
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
    case "ScheduleReserved":
      return {
        ...base,
        taskId: event.taskId,
        assignmentId: event.assignmentId,
        scheduleId: event.scheduleId,
        scheduleStatus: "reserved",
        taskStatus: "scheduled",
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
    case "TaskCompleted":
      return {
        ...base,
        taskId: event.taskId,
        scheduleId: event.scheduleId,
        taskStatus: "completed",
        scheduleStatus: "completed",
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
    case "ScheduleCancelled":
      return {
        ...base,
        taskId: event.taskId,
        assignmentId: event.assignmentId,
        scheduleId: event.scheduleId,
        taskStatus: "cancelled",
        assignmentStatus: "cancelled",
        scheduleStatus: "cancelled",
        lastReason: event.reason,
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
    default:
      return {
        ...base,
        eventTypes: appendEventType(base.eventTypes, event.type),
        updatedAtISO: event.occurredAtISO,
      };
  }
}

export class FirebaseMdddProjectionRepository
  implements ScheduleMdddProjectionRepository, ScheduleMdddProjectionQueryRepository
{
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async project(events: readonly ScheduleDomainEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const eventsByRequestId = new Map<string, ScheduleDomainEvent[]>();
    for (const event of events) {
      const bucket = eventsByRequestId.get(event.requestId) ?? [];
      bucket.push(event);
      eventsByRequestId.set(event.requestId, bucket);
    }

    const requestIds = [...eventsByRequestId.keys()];
    const existingSnapshots = await Promise.all(
      requestIds.map(async (requestId) => {
        const snapshot = await getDoc(doc(this.db, COLLECTION_NAME, requestId));
        return {
          requestId,
          current: snapshot.exists() ? (snapshot.data() as ScheduleMdddFlowProjection) : null,
        };
      }),
    );

    await Promise.all(
      existingSnapshots.map(async ({ requestId, current }) => {
        const relatedEvents = eventsByRequestId.get(requestId) ?? [];
        const nextProjection = relatedEvents.reduce<ScheduleMdddFlowProjection | null>(
          (acc, event) => applyEvent(acc, event),
          current,
        );

        if (!nextProjection) {
          return;
        }

        await setDoc(doc(this.db, COLLECTION_NAME, requestId), nextProjection, { merge: true });
      }),
    );
  }

  async findByRequestId(requestId: string): Promise<ScheduleMdddFlowProjection | null> {
    const snapshot = await getDoc(doc(this.db, COLLECTION_NAME, requestId));
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as ScheduleMdddFlowProjection;
  }

  async listByWorkspaceId(workspaceId: string): Promise<readonly ScheduleMdddFlowProjection[]> {
    const snapshots = await getDocs(
      query(collection(this.db, COLLECTION_NAME), where("workspaceId", "==", workspaceId)),
    );

    return snapshots.docs.map((snapshot) => snapshot.data() as ScheduleMdddFlowProjection);
  }
}
