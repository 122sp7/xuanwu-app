/**
 * @package matching-engine
 * Matching domain — contracts, pure scoring logic, and orchestration types.
 *
 * This package provides:
 *   - Domain contracts: MatchingRequest, MatchAssignment, MatchScore, MatchingProjection
 *   - Repository port interfaces
 *   - CandidateProfile — the input shape for pure scoring
 *   - matchTaskToSkills() — pure, framework-free candidate ranking function
 *   - assignTask()        — pure assignment builder
 *   - SkillMatcher        — concrete IMatchingEngine implementation (no external deps)
 *
 * Dependency rule:
 *   - @shared-types for ID / generateId
 *   - @skill-core  for AccountSkillEntity, SkillEntity, SkillLevel
 *   - NO Firebase, NO HTTP, NO React, NO Next.js
 *
 * Usage:
 *   import { matchTaskToSkills, assignTask, SkillMatcher } from "@matching-engine";
 */

import { generateId } from "@shared-types";
import type { AccountSkillEntity, SkillEntity, SkillLevel } from "@skill-core";

// ── Re-export shared-types ID so consumers don't need a second import ─────

export type { ID } from "@shared-types";

// ── Matching request ───────────────────────────────────────────────────────

export type MatchingRequestId = string;
export type MatchAssignmentId = string;
export type MatchScheduleId = string;

export type MatchingRequestStatus =
  | "pending"
  | "matching"
  | "matched"
  | "assigned"
  | "rejected"
  | "cancelled";

export interface MatchingRequest {
  readonly id: MatchingRequestId;
  readonly scheduleId: MatchScheduleId;
  readonly workspaceId: string;
  readonly requiredSkillIds: readonly string[];
  readonly requiredCapacity: number;
  readonly preferredStartISO?: string;
  readonly preferredEndISO?: string;
  readonly status: MatchingRequestStatus;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateMatchingRequestInput {
  readonly scheduleId: MatchScheduleId;
  readonly workspaceId: string;
  readonly requiredSkillIds?: string[];
  readonly requiredCapacity?: number;
  readonly preferredStartISO?: string;
  readonly preferredEndISO?: string;
}

// ── Match assignment ───────────────────────────────────────────────────────

export type MatchAssignmentStatus = "proposed" | "accepted" | "rejected" | "cancelled";

export interface MatchAssignment {
  readonly id: MatchAssignmentId;
  readonly requestId: MatchingRequestId;
  readonly assigneeId: string;
  readonly assigneeSkillIds: readonly string[];
  readonly score: number;
  readonly status: MatchAssignmentStatus;
  readonly proposedAtISO: string;
  readonly respondedAtISO?: string;
}

// ── Match score ────────────────────────────────────────────────────────────

export interface MatchScore {
  readonly candidateId: string;
  readonly requestId: MatchingRequestId;
  readonly skillOverlapScore: number;
  readonly availabilityScore: number;
  readonly capacityScore: number;
  readonly totalScore: number;
}

// ── Matching projection (read model) ──────────────────────────────────────

export interface MatchingProjection {
  readonly requestId: MatchingRequestId;
  readonly scheduleId: MatchScheduleId;
  readonly status: MatchingRequestStatus;
  readonly topCandidates: readonly MatchScore[];
  readonly selectedAssignment?: MatchAssignment;
  readonly updatedAtISO: string;
}

// ── Repository ports ──────────────────────────────────────────────────────

export interface MatchingRequestRepository {
  create(input: CreateMatchingRequestInput): Promise<MatchingRequest>;
  updateStatus(requestId: MatchingRequestId, status: MatchingRequestStatus): Promise<void>;
  findById(requestId: MatchingRequestId): Promise<MatchingRequest | null>;
  findByScheduleId(scheduleId: MatchScheduleId): Promise<MatchingRequest[]>;
}

export interface MatchAssignmentRepository {
  propose(assignment: Omit<MatchAssignment, "id" | "proposedAtISO">): Promise<MatchAssignment>;
  respond(assignmentId: MatchAssignmentId, status: "accepted" | "rejected"): Promise<void>;
  findByRequest(requestId: MatchingRequestId): Promise<MatchAssignment[]>;
}

export interface MatchingProjectionRepository {
  upsert(projection: MatchingProjection): Promise<void>;
  findByRequest(requestId: MatchingRequestId): Promise<MatchingProjection | null>;
  findBySchedule(scheduleId: MatchScheduleId): Promise<MatchingProjection[]>;
}

// ── Orchestration port ────────────────────────────────────────────────────

/** Port that any matching orchestrator must implement. */
export interface IMatchingEngine {
  run(requestId: MatchingRequestId): Promise<MatchingProjection>;
  score(requestId: MatchingRequestId, candidateIds: string[]): Promise<MatchScore[]>;
}

// ═════════════════════════════════════════════════════════════════════════
// PURE DOMAIN LOGIC — no external dependencies
// ═════════════════════════════════════════════════════════════════════════

/**
 * A candidate profile bundles together all skill-related data for one account.
 * Repositories load this; the matching engine consumes it.
 */
export interface CandidateProfile {
  /** The account or user being evaluated. */
  readonly candidateId: string;
  /** All skill assignments for this candidate. */
  readonly skills: readonly AccountSkillEntity[];
  /**
   * Full skill details for the skills held by this candidate.
   * Indexed to avoid O(n²) lookups: key = skillId.
   */
  readonly skillDetails: ReadonlyMap<string, SkillEntity>;
}

// ── Skill level numeric weights ────────────────────────────────────────────

const LEVEL_WEIGHT: Record<SkillLevel, number> = {
  beginner: 0.25,
  intermediate: 0.50,
  advanced: 0.75,
  expert: 1.00,
};

/**
 * Score a single candidate against the set of required skill IDs.
 *
 * ### Scoring dimensions
 *
 * | Dimension | Weight | Description |
 * |-----------|--------|-------------|
 * | skillOverlapScore | 50% | (matched skills) / (required skills) |
 * | skillLevelScore   | 30% | avg(level weight) across matched skills |
 * | tagAffinityScore  | 20% | fraction of required tags present in candidate's skill tags |
 *
 * `availabilityScore` and `capacityScore` default to 1.0 — infrastructure-layer
 * adapters may override them before persisting the projection.
 *
 * Returns a value in [0, 1] for each dimension; totalScore is the weighted sum.
 */
function scoreCandidate(
  requestId: MatchingRequestId,
  requiredSkillIds: readonly string[],
  candidate: CandidateProfile,
): MatchScore {
  if (requiredSkillIds.length === 0) {
    return {
      candidateId: candidate.candidateId,
      requestId,
      skillOverlapScore: 1,
      availabilityScore: 1,
      capacityScore: 1,
      totalScore: 1,
    };
  }

  const requiredSet = new Set(requiredSkillIds);

  // Find candidate's skills that match the requirement
  const matchedAssignments = candidate.skills.filter((s) => requiredSet.has(s.skillId));
  const matchedCount = matchedAssignments.length;

  // Skill overlap: fraction of required skills the candidate holds
  const skillOverlapScore = matchedCount / requiredSkillIds.length;

  // Skill level: average level weight across matched skills
  const skillLevelScore =
    matchedCount === 0
      ? 0
      : matchedAssignments.reduce(
          (sum, s) => sum + (LEVEL_WEIGHT[s.level] ?? 0),
          0,
        ) / matchedCount;

  // Tag affinity: collect all tags from required skills; measure coverage
  const requiredTags = new Set<string>();
  for (const skillId of requiredSkillIds) {
    const detail = candidate.skillDetails.get(skillId);
    if (detail) {
      for (const tag of detail.tags) {
        requiredTags.add(tag);
      }
    }
  }

  let tagAffinityScore = 1; // default 1 when no tags defined
  if (requiredTags.size > 0) {
    const candidateTags = new Set<string>();
    for (const assignment of candidate.skills) {
      const detail = candidate.skillDetails.get(assignment.skillId);
      if (detail) {
        for (const tag of detail.tags) {
          candidateTags.add(tag);
        }
      }
    }
    let tagOverlap = 0;
    for (const tag of requiredTags) {
      if (candidateTags.has(tag)) tagOverlap++;
    }
    tagAffinityScore = tagOverlap / requiredTags.size;
  }

  // Weighted total (availability + capacity provided by infra layer, default 1)
  const totalScore =
    0.5 * skillOverlapScore +
    0.3 * skillLevelScore +
    0.2 * tagAffinityScore;

  return {
    candidateId: candidate.candidateId,
    requestId,
    skillOverlapScore,
    availabilityScore: 1,
    capacityScore: 1,
    totalScore,
  };
}

/**
 * Rank all candidates against the skill requirements in a matching request.
 *
 * This is a **pure function** — it has no side effects and no I/O.
 * Repository adapters load the data; this function does the scoring.
 *
 * Results are sorted descending by `totalScore`.
 *
 * @param request  The matching request (carries requiredSkillIds)
 * @param candidates  All candidate profiles to evaluate
 * @returns Ranked list of MatchScore objects
 */
export function matchTaskToSkills(
  request: Pick<MatchingRequest, "id" | "requiredSkillIds">,
  candidates: readonly CandidateProfile[],
): MatchScore[] {
  return candidates
    .map((c) => scoreCandidate(request.id, request.requiredSkillIds, c))
    .sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Build a proposed MatchAssignment from a winning candidate.
 *
 * This is a **pure function** — the repository's `propose()` method
 * persists it; this function only constructs the value.
 *
 * @param requestId   The matching request being fulfilled
 * @param candidateId The selected candidate
 * @param skills      The candidate's account-skill assignments
 * @returns A ready-to-persist assignment payload (without id / proposedAtISO)
 */
export function assignTask(
  requestId: MatchingRequestId,
  candidateId: string,
  skills: readonly AccountSkillEntity[],
): Omit<MatchAssignment, "id" | "proposedAtISO"> {
  return {
    requestId,
    assigneeId: candidateId,
    assigneeSkillIds: skills.map((s) => s.skillId),
    score: 0, // caller should set this from MatchScore.totalScore
    status: "proposed",
  };
}

/**
 * Build a proposed MatchAssignment with score attached.
 * Convenience wrapper over assignTask() that injects the score.
 */
export function assignTaskWithScore(
  requestId: MatchingRequestId,
  score: MatchScore,
  skills: readonly AccountSkillEntity[],
): Omit<MatchAssignment, "id" | "proposedAtISO"> {
  return {
    ...assignTask(requestId, score.candidateId, skills),
    score: score.totalScore,
  };
}

// ── SkillMatcher — concrete engine (pure, no I/O) ─────────────────────────

/**
 * A concrete, synchronous SkillMatcher that scores candidates in-process.
 *
 * This implements `IMatchingEngine` partially — `run()` requires repository
 * access so it is NOT implemented here. Provide `score()` logic for use-cases
 * that already have loaded candidate profiles.
 *
 * For the full orchestration (load + score + persist), use
 * `@matching-service` MatchTaskUseCase.
 */
export class SkillMatcher {
  /**
   * Score a pre-loaded list of candidate profiles against the given request.
   * Returns ranked scores, highest first.
   */
  score(
    request: Pick<MatchingRequest, "id" | "requiredSkillIds">,
    candidates: readonly CandidateProfile[],
  ): MatchScore[] {
    return matchTaskToSkills(request, candidates);
  }

  /**
   * Return the top-N candidates only.
   */
  topN(
    request: Pick<MatchingRequest, "id" | "requiredSkillIds">,
    candidates: readonly CandidateProfile[],
    n: number,
  ): MatchScore[] {
    return this.score(request, candidates).slice(0, n);
  }

  /**
   * Return the best single candidate, or null if the pool is empty.
   */
  best(
    request: Pick<MatchingRequest, "id" | "requiredSkillIds">,
    candidates: readonly CandidateProfile[],
  ): MatchScore | null {
    const ranked = this.score(request, candidates);
    return ranked.length > 0 ? (ranked[0] ?? null) : null;
  }
}

// ── Convenience: build a CandidateProfile map ─────────────────────────────

/**
 * Group a flat list of AccountSkillEntity records into a Map of CandidateProfile,
 * keyed by candidateId. Provide the skill detail index as a Map<skillId, SkillEntity>.
 *
 * Convenience helper for use in service/orchestration layers.
 */
export function buildCandidateProfiles(
  accountSkills: readonly AccountSkillEntity[],
  skillIndex: ReadonlyMap<string, SkillEntity>,
): Map<string, CandidateProfile> {
  const profileMap = new Map<string, CandidateProfile>();

  for (const as of accountSkills) {
    const existing = profileMap.get(as.accountId);
    if (existing) {
      // Append skill to existing profile
      profileMap.set(as.accountId, {
        ...existing,
        skills: [...existing.skills, as],
      });
    } else {
      profileMap.set(as.accountId, {
        candidateId: as.accountId,
        skills: [as],
        skillDetails: skillIndex,
      });
    }
  }

  return profileMap;
}

// Re-export generateId for service layer convenience
export { generateId };
