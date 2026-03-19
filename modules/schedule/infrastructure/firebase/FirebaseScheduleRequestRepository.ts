import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";
import {
  SCHEDULE_REQUEST_STATUSES,
  SCHEDULE_SKILL_PROFICIENCY_LEVELS,
  type ScheduleRequest,
  type ScheduleRequestStatus,
  type ScheduleSkillProficiencyLevel,
  type SkillRequirement,
  type SubmitScheduleRequestInput,
} from "../../domain/entities/ScheduleRequest";
import type { ScheduleRequestRepository } from "../../domain/repositories/ScheduleRequestRepository";

function requireString(data: Record<string, unknown>, field: string) {
  const value = data[field];
  if (typeof value !== "string" || !value) {
    throw new Error(`Schedule request field ${field} is missing, empty, or not a string.`);
  }

  return value;
}

function requireNullableString(data: Record<string, unknown>, field: string) {
  const value = data[field];
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(`Schedule request field ${field} is not a string or null.`);
  }

  return value;
}

function requireScheduleRequestStatus(
  data: Record<string, unknown>,
  field: string,
): ScheduleRequestStatus {
  const value = requireString(data, field);
  if (!SCHEDULE_REQUEST_STATUSES.includes(value as ScheduleRequestStatus)) {
    throw new Error(`Schedule request field ${field} has unsupported status: ${value}`);
  }

  return value as ScheduleRequestStatus;
}

function requireSkillRequirement(value: unknown, index: number): SkillRequirement {
  if (!value || typeof value !== "object") {
    throw new Error(`Schedule request requiredSkills[${index}] is not an object.`);
  }

  const record = value as Record<string, unknown>;
  const skillId = requireString(record, "skillId");
  const minProficiency = requireString(record, "minProficiency");
  const requiredHeadcount = record.requiredHeadcount;

  if (
    !SCHEDULE_SKILL_PROFICIENCY_LEVELS.includes(
      minProficiency as ScheduleSkillProficiencyLevel,
    )
  ) {
    throw new Error(
      `Schedule request requiredSkills[${index}] has unsupported proficiency: ${minProficiency}`,
    );
  }

  if (
    typeof requiredHeadcount !== "number" ||
    !Number.isInteger(requiredHeadcount) ||
    requiredHeadcount <= 0
  ) {
    throw new Error(
      `Schedule request requiredSkills[${index}] has invalid headcount: ${String(requiredHeadcount)}`,
    );
  }

  return {
    skillId,
    minProficiency: minProficiency as ScheduleSkillProficiencyLevel,
    requiredHeadcount,
  };
}

function toScheduleRequestEntity(id: string, data: Record<string, unknown>): ScheduleRequest {
  const requiredSkills = data.requiredSkills;
  if (!Array.isArray(requiredSkills)) {
    throw new Error("Schedule request field requiredSkills is not an array.");
  }

  return {
    id,
    workspaceId: requireString(data, "workspaceId"),
    organizationId: requireString(data, "organizationId"),
    status: requireScheduleRequestStatus(data, "status"),
    requiredSkills: requiredSkills.map((value, index) => requireSkillRequirement(value, index)),
    proposedStartAtISO: requireNullableString(data, "proposedStartAtISO"),
    notes: requireNullableString(data, "notes") ?? "",
    submittedByAccountId: requireString(data, "submittedByAccountId"),
    submittedAtISO: requireString(data, "submittedAtISO"),
    createdAtISO: requireString(data, "createdAtISO"),
    updatedAtISO: requireString(data, "updatedAtISO"),
  };
}

export class FirebaseScheduleRequestRepository implements ScheduleRequestRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async submit(input: SubmitScheduleRequestInput): Promise<ScheduleRequest> {
    const requestId = crypto.randomUUID();
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
      submittedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } satisfies Record<string, unknown>;

    await setDoc(scheduleRequestRef, documentData);

    return toScheduleRequestEntity(requestId, documentData);
  }
}
