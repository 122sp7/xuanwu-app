import type { AccountUser, Organization } from "../entities/References";
import type { Task } from "../entities/Task";
import { createMatch, type Match } from "../entities/Match";
import { SKILL_LEVELS, type SkillLevel } from "../value-objects/Requirements";
import { createMdddId } from "../utils/create-id";

const SKILL_LEVEL_RANK: Record<SkillLevel, number> = {
  junior: 1,
  mid: 2,
  senior: 3,
};
const SKILL_LEVEL_SET = new Set<string>(SKILL_LEVELS);

// Current scoring policy prioritizes skill coverage first (0.6) because missing core skills
// is the most expensive scheduling failure, then capability coverage (0.4) for compliance fit.
// A separate load penalty (0.1 * current load units) is subtracted from that base score to
// reduce overload risk without dominating fit. Typical score range can cross below 0 when
// overload is high; ranking only considers eligible candidates.
// Examples:
// - perfect fit + zero load => (1 * 0.6) + (1 * 0.4) - 0 = 1.0
// - full fit + load=3 => 1.0 - (3 * 0.1) = 0.7
// - skill fit=0.5, capability fit=1, load=2 => 0.3 + 0.4 - 0.2 = 0.5
const MATCHING_SCORE_WEIGHTS = {
  skillCoverage: 0.6,
  capabilityCoverage: 0.4,
  loadPenaltyPerUnit: 0.1,
  preferenceBonusUnit: 0.02,
} as const;

interface ConstraintCheckResult {
  readonly pass: boolean;
  readonly violations: readonly string[];
}

function isStringValue(value: string | number | boolean): value is string {
  return typeof value === "string";
}

function isSkillLevel(value: string): value is SkillLevel {
  return SKILL_LEVEL_SET.has(value);
}

function hasSufficientSkillLevel(level: SkillLevel, requiredLevel: SkillLevel): boolean {
  const candidateRank = SKILL_LEVEL_RANK[level];
  const requiredRank = SKILL_LEVEL_RANK[requiredLevel];
  return candidateRank >= requiredRank;
}

function includesAllRequiredSkills(task: Task, user: AccountUser): boolean {
  return task.requiredSkills.every((required) =>
    user.skills.some(
      (skill) =>
        skill.skillId === required.skillId &&
        isSkillLevel(skill.level) &&
        isSkillLevel(required.minLevel) &&
        hasSufficientSkillLevel(skill.level, required.minLevel),
    ),
  );
}

function includesAllRequiredCapabilities(task: Task, user: AccountUser): boolean {
  return task.requiredCapabilities.every((required) =>
    !required.required || user.capabilities.some((capability) => capability.capabilityId === required.capabilityId),
  );
}

function computeScore(task: Task, user: AccountUser): number {
  const matchedSkills = task.requiredSkills.filter((required) =>
    user.skills.some(
      (skill) =>
        skill.skillId === required.skillId &&
        isSkillLevel(skill.level) &&
        isSkillLevel(required.minLevel) &&
        hasSufficientSkillLevel(skill.level, required.minLevel),
    ),
  ).length;

  const matchedCapabilities = task.requiredCapabilities.filter((required) =>
    !required.required || user.capabilities.some((capability) => capability.capabilityId === required.capabilityId),
  ).length;

  const skillCoverage = task.requiredSkills.length === 0 ? 1 : matchedSkills / task.requiredSkills.length;
  const capabilityCoverage =
    task.requiredCapabilities.length === 0 ? 1 : matchedCapabilities / task.requiredCapabilities.length;

  const loadPenalty =
    Math.max(user.currentLoadUnits, 0) * MATCHING_SCORE_WEIGHTS.loadPenaltyPerUnit;
  const preferenceBonus = task.preferences.reduce((sum, preference) => {
    if (
      preference.type === "preferred-team" &&
      isStringValue(preference.value) &&
      user.teamIds.includes(preference.value)
    ) {
      return sum + Math.max(0, preference.weight) * MATCHING_SCORE_WEIGHTS.preferenceBonusUnit;
    }
    return sum;
  }, 0);
  const score =
    skillCoverage * MATCHING_SCORE_WEIGHTS.skillCoverage +
    capabilityCoverage * MATCHING_SCORE_WEIGHTS.capabilityCoverage -
    loadPenalty +
    preferenceBonus;
  return Math.round(score * 10_000) / 10_000;
}

function satisfiesHardConstraints(task: Task, user: AccountUser): ConstraintCheckResult {
  const violations: string[] = [];
  for (const constraint of task.constraints) {
    if (constraint.type === "team-required" && isStringValue(constraint.value)) {
      const requiredTeamId = constraint.value;
      if (!user.teamIds.includes(requiredTeamId)) {
        violations.push("team_required_mismatch");
      }
    }
  }
  return { pass: violations.length === 0, violations };
}

export interface MatchingResult {
  readonly matches: readonly Match[];
  readonly bestMatch: Match | null;
}

function createMatchId(taskId: string): string {
  return createMdddId("match", taskId);
}

export function matchTaskCandidates(
  params: {
    readonly task: Task;
    readonly candidates: readonly AccountUser[];
    readonly organization: Organization;
    readonly nowISO: string;
  },
): MatchingResult {
  const { task, candidates, organization, nowISO } = params;

  const matches = candidates.map((candidate) => {
    const skillPass = includesAllRequiredSkills(task, candidate);
    const capabilityPass = includesAllRequiredCapabilities(task, candidate);
    const loadPass = candidate.currentLoadUnits < organization.maxLoadPerMember;
    const hardConstraintResult = satisfiesHardConstraints(task, candidate);
    const constraintPass = skillPass && capabilityPass && loadPass && hardConstraintResult.pass;

    const violations: string[] = [];
    if (!skillPass) violations.push("missing_required_skills");
    if (!capabilityPass) violations.push("missing_required_capabilities");
    if (!loadPass) violations.push("member_overloaded");
    violations.push(...hardConstraintResult.violations);

    return createMatch(createMatchId(task.taskId), task.taskId, nowISO, {
      accountUserId: candidate.accountUserId,
      score: computeScore(task, candidate),
      eligible: constraintPass,
      constraintViolations: violations,
      gaps: [],
    });
  });

  const eligible = matches.filter((match) => match.eligible).sort((a, b) => b.score - a.score);
  return {
    matches,
    bestMatch: eligible[0] ?? null,
  };
}
