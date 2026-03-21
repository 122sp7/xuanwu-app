/**
 * MatchTaskUseCase
 *
 * Orchestrates the full matching flow for a single task/request:
 *   1. Load all candidate account-skill records
 *   2. Load skill details to build the skillIndex
 *   3. Build CandidateProfile objects
 *   4. Run pure matching engine (SkillMatcher)
 *   5. Return ranked MatchScore[]
 *
 * This use-case is READ-ONLY — it does not persist anything.
 * To persist the results, pass them to AssignTaskUseCase.
 *
 * Dependency: @matching-engine, @skill-core, @shared-types
 */

import {
  SkillMatcher,
  buildCandidateProfiles,
  type MatchingRequest,
  type MatchScore,
} from "@matching-engine";
import type { SkillRepository, AccountSkillRepository, SkillEntity } from "@skill-core";
import {
  commandFailureFrom,
  type CommandResult,
} from "@shared-types";

export interface MatchTaskInput {
  /** The matching request to evaluate candidates against. */
  readonly request: Pick<MatchingRequest, "id" | "requiredSkillIds">;
  /**
   * If provided, only these account IDs will be considered as candidates.
   * When omitted the use-case evaluates ALL accounts that have skill assignments.
   */
  readonly candidateIds?: readonly string[];
}

export interface MatchTaskResult {
  readonly success: true;
  readonly scores: readonly MatchScore[];
}

export type MatchTaskResponse = MatchTaskResult | CommandResult;

export class MatchTaskUseCase {
  private readonly matcher = new SkillMatcher();

  constructor(
    private readonly skillRepository: SkillRepository,
    private readonly accountSkillRepository: AccountSkillRepository,
  ) {}

  /**
   * Run the matching engine and return ranked candidate scores.
   *
   * @returns MatchTaskResult on success, CommandFailure on validation error.
   */
  async execute(input: MatchTaskInput): Promise<MatchTaskResult | ReturnType<typeof commandFailureFrom>> {
    const { request, candidateIds } = input;

    if (!request.id.trim()) {
      return commandFailureFrom("MATCH_REQUEST_ID_REQUIRED", "Matching request ID is required.");
    }

    // 1. Load all skill details and build a lookup map
    const allSkills = await this.skillRepository.findAll();
    const skillIndex = new Map<string, SkillEntity>(allSkills.map((s) => [s.id, s]));

    // 2. Load account-skill assignments
    //    If candidateIds provided, fetch per-account; otherwise fetch by each required skill
    const accountSkills = await this._loadAccountSkills(
      request.requiredSkillIds,
      candidateIds,
    );

    // 3. Build candidate profiles
    const profileMap = buildCandidateProfiles(accountSkills, skillIndex);
    const candidates = Array.from(profileMap.values());

    if (candidates.length === 0) {
      return {
        success: true,
        scores: [],
      };
    }

    // 4. Run pure scoring
    const scores = this.matcher.score(request, candidates);

    return {
      success: true,
      scores,
    };
  }

  private async _loadAccountSkills(
    requiredSkillIds: readonly string[],
    candidateIds?: readonly string[],
  ) {
    if (candidateIds && candidateIds.length > 0) {
      // Load per candidate
      const results = await Promise.all(
        candidateIds.map((id) => this.accountSkillRepository.findByAccount(id)),
      );
      return results.flat();
    }

    // Load by each required skill
    if (requiredSkillIds.length > 0) {
      const results = await Promise.all(
        requiredSkillIds.map((id) => this.accountSkillRepository.findBySkill(id)),
      );
      return results.flat();
    }

    return [];
  }
}
