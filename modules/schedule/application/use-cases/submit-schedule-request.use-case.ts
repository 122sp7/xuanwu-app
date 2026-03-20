import { commandFailureFrom, commandSuccess, type CommandResult } from "@/shared/types";
import type {
  SkillRequirement,
  SubmitScheduleRequestInput,
} from "../../domain/entities/ScheduleRequest";
import { SCHEDULE_SKILL_PROFICIENCY_LEVELS } from "../../domain/entities/ScheduleRequest";
import type { ScheduleRequestRepository } from "../../domain/repositories/ScheduleRequestRepository";

type SkillRequirementValidationResult =
  | { readonly success: true; readonly value: SkillRequirement[] }
  | { readonly success: false; readonly code: string; readonly message: string };

function normalizeSkillRequirements(
  requiredSkills: readonly SkillRequirement[],
): SkillRequirementValidationResult {
  if (requiredSkills.length === 0) {
    return {
      success: false,
      code: "SCHEDULE_REQUIRED_SKILLS_REQUIRED",
      message: "At least one required skill is required.",
    };
  }

  const normalizedRequirements: SkillRequirement[] = [];
  const seenSkillIds = new Set<string>();

  for (const requirement of requiredSkills) {
    const skillId = requirement.skillId.trim();
    if (!skillId) {
      return {
        success: false,
        code: "SCHEDULE_REQUIRED_SKILL_ID_REQUIRED",
        message: "Each required skill must include a skill identifier.",
      };
    }

    if (seenSkillIds.has(skillId)) {
      return {
        success: false,
        code: "SCHEDULE_REQUIRED_SKILL_DUPLICATE",
        message: `Duplicate required skill identifier: ${skillId}`,
      };
    }

    seenSkillIds.add(skillId);

    if (!SCHEDULE_SKILL_PROFICIENCY_LEVELS.includes(requirement.minProficiency)) {
      return {
        success: false,
        code: "SCHEDULE_REQUIRED_SKILL_PROFICIENCY_INVALID",
        message: `Unsupported skill proficiency: ${String(requirement.minProficiency)}`,
      };
    }

    if (!Number.isInteger(requirement.requiredHeadcount) || requirement.requiredHeadcount <= 0) {
      return {
        success: false,
        code: "SCHEDULE_REQUIRED_SKILL_HEADCOUNT_INVALID",
        message: `Required headcount must be a positive integer for skill ${skillId}.`,
      };
    }

    normalizedRequirements.push({
      skillId,
      minProficiency: requirement.minProficiency,
      requiredHeadcount: requirement.requiredHeadcount,
    });
  }

  return { success: true, value: normalizedRequirements };
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

    // Skills are optional for simple resource requests submitted from the workspace UI.
    // Full MDDD flow validation enforces skill requirements separately.
    const requiredSkills =
      input.requiredSkills.length === 0
        ? { success: true as const, value: [] as SkillRequirement[] }
        : normalizeSkillRequirements(input.requiredSkills);
    if (!requiredSkills.success) {
      return commandFailureFrom(requiredSkills.code, requiredSkills.message);
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
        requiredSkills: requiredSkills.value,
        proposedStartAtISO,
        notes,
        actorAccountId,
      });
      return commandSuccess(scheduleRequest.id, Date.now());
    } catch (error) {
      return commandFailureFrom(
        "SCHEDULE_REQUEST_SUBMIT_FAILED",
        error instanceof Error ? error.message : "Unexpected schedule request submission error",
      );
    }
  }
}
