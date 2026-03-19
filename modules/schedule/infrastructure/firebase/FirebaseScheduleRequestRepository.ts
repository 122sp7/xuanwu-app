import { collection, doc, getFirestore, setDoc } from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type {
  ScheduleRequest,
  SubmitScheduleRequestInput,
} from "../../domain/entities/ScheduleRequest";
import type { ScheduleRequestRepository } from "../../domain/repositories/ScheduleRequestRepository";
import { toScheduleRequestEntity } from "./converters/schedule-request.converter";

export class FirebaseScheduleRequestRepository implements ScheduleRequestRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async submit(input: SubmitScheduleRequestInput): Promise<ScheduleRequest> {
    const requestId = doc(collection(this.db, "scheduleRequests")).id;
    const nowISO = new Date().toISOString();
    const scheduleRequestRef = doc(this.db, "scheduleRequests", requestId);

    const documentData = {
      workspaceId: input.workspaceId,
      organizationId: input.organizationId,
      status: "submitted",
      requiredSkills: input.requiredSkills.map((requirement) => ({
        skillId: requirement.skillId,
        minProficiency: requirement.minProficiency,
        requiredHeadcount: requirement.requiredHeadcount,
      })),
      proposedStartAtISO: input.proposedStartAtISO ?? null,
      notes: input.notes ?? "",
      submittedByAccountId: input.actorAccountId,
      submittedAtISO: nowISO,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    } satisfies Record<string, unknown>;

    await setDoc(scheduleRequestRef, documentData);

    return toScheduleRequestEntity(requestId, documentData);
  }
}
