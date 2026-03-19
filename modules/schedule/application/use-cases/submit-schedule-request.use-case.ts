import { commandFailureFrom, commandSuccess, type CommandResult } from "@/shared/types";
import type {
  SkillRequirement,
  SubmitScheduleRequestInput,
} from "../../domain/entities/ScheduleRequest";
import { SCHEDULE_SKILL_PROFICIENCY_LEVELS } from "../../domain/entities/ScheduleRequest";
import type { ScheduleRequestRepository } from "../../domain/repositories/ScheduleRequestRepository";

function normalizeSkillRequirements(
  requiredSkills: readonly SkillRequirement[],
): SkillRequirement[] | null {
  if (requiredSkills.length === 0) {
    return null;
  }

  const normalizedRequirements: SkillRequirement[] = [];
  const seenSkillIds = new Set<string>();

  for (const requirement of requiredSkills) {
    const skillId = requirement.skillId.trim();
    if (!skillId) {
      return null;
    }

    if (seenSkillIds.has(skillId)) {
      return null;
    }

    seenSkillIds.add(skillId);

    if (!SCHEDULE_SKILL_PROFICIENCY_LEVELS.includes(requirement.minProficiency)) {
      return null;
    }

    if (!Number.isInteger(requirement.requiredHeadcount) || requirement.requiredHeadcount <= 0) {
      return null;
    }

    normalizedRequirements.push({
      skillId,
      minProficiency: requirement.minProficiency,
      requiredHeadcount: requirement.requiredHeadcount,
    });
  }

  return normalizedRequirements;
}

export class SubmitScheduleRequestUseCase {
  constructor(private readonly scheduleRequestRepository: ScheduleRequestRepository) {}

  async execute(input: SubmitScheduleRequestInput): Promise<CommandResult> {
    const workspaceId = input.workspaceId.trim();
    const organizationId = input.organizationId.trim();
    const actorAccountId = input.actorAccountId.trim();
    const notes = input.notes?.trim() ?? "";
    const proposedStartAtISO = input.proposedStartAtISO?.trim() || null;

    if (!workspaceId) {
      return commandFailureFrom("SCHEDULE_WORKSPACE_REQUIRED", "Workspace is required.");
    }

    if (!organizationId) {
      return commandFailureFrom("SCHEDULE_ORGANIZATION_REQUIRED", "Organization is required.");
    }

    if (!actorAccountId) {
      return commandFailureFrom("SCHEDULE_ACTOR_REQUIRED", "Actor account is required.");
    }

    const requiredSkills = normalizeSkillRequirements(input.requiredSkills);
    if (!requiredSkills) {
      return commandFailureFrom(
        "SCHEDULE_REQUIRED_SKILLS_INVALID",
        "Required skills must contain unique skill identifiers, supported proficiency levels, and positive headcount values.",
      );
    }

    if (proposedStartAtISO && Number.isNaN(Date.parse(proposedStartAtISO))) {
      return commandFailureFrom(
        "SCHEDULE_PROPOSED_START_INVALID",
        `Proposed start timestamp is invalid: ${proposedStartAtISO}`,
      );
    }

    try {
      const scheduleRequest = await this.scheduleRequestRepository.submit({
        workspaceId,
        organizationId,
        requiredSkills,
        proposedStartAtISO,
        notes,
        actorAccountId,
      });

      const scheduleRequestVersion = Date.parse(scheduleRequest.updatedAtISO);
      if (Number.isNaN(scheduleRequestVersion)) {
        return commandFailureFrom(
          "SCHEDULE_REQUEST_UPDATED_AT_INVALID",
          `Schedule request ${scheduleRequest.id} has invalid timestamp: ${scheduleRequest.updatedAtISO}`,
        );
      }

      return commandSuccess(scheduleRequest.id, scheduleRequestVersion);
    } catch (error) {
      return commandFailureFrom(
        "SCHEDULE_REQUEST_SUBMIT_FAILED",
        error instanceof Error ? error.message : "Unexpected schedule request submission error",
      );
    }
  }
}
