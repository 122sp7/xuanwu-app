/**
 * AssignTaskUseCase
 *
 * Proposes a MatchAssignment by persisting the best candidate chosen
 * from a prior MatchTaskUseCase result.
 *
 *   1. Validate inputs
 *   2. Load candidate's skill assignments
 *   3. Build assignment payload (pure, via assignTaskWithScore)
 *   4. Persist via MatchAssignmentRepository
 *   5. Return CommandResult
 *
 * Dependency: @matching-engine, @skill-core, @shared-types
 */

import {
  assignTaskWithScore,
  type MatchAssignmentRepository,
  type MatchScore,
} from "@matching-engine";
import type { AccountSkillRepository } from "@skill-core";
import {
  commandFailureFrom,
  commandSuccess,
  type CommandResult,
} from "@shared-types";

export interface AssignTaskInput {
  /** The top-scored candidate to propose. */
  readonly score: MatchScore;
  /** Repository used to persist the assignment. */
}

export class AssignTaskUseCase {
  constructor(
    private readonly accountSkillRepository: AccountSkillRepository,
    private readonly assignmentRepository: MatchAssignmentRepository,
  ) {}

  /**
   * Persist a proposed assignment for the winning candidate.
   *
   * @returns CommandSuccess with the new assignment ID, or CommandFailure.
   */
  async execute(input: AssignTaskInput): Promise<CommandResult> {
    const { score } = input;

    if (!score.candidateId.trim()) {
      return commandFailureFrom("ASSIGN_CANDIDATE_REQUIRED", "Candidate ID is required.");
    }

    if (!score.requestId.trim()) {
      return commandFailureFrom("ASSIGN_REQUEST_REQUIRED", "Matching request ID is required.");
    }

    // Load the candidate's skills to attach to the assignment
    const candidateSkills = await this.accountSkillRepository.findByAccount(
      score.candidateId,
    );

    // Build the assignment payload (pure function — no I/O)
    const payload = assignTaskWithScore(score.requestId, score, candidateSkills);

    // Persist
    const assignment = await this.assignmentRepository.propose(payload);

    return commandSuccess(assignment.id, Date.now());
  }
}
