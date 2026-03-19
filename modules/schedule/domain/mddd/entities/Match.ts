import type { MatchGap } from "../value-objects/Scheduling";

export interface Match {
  readonly matchId: string;
  readonly taskId: string;
  readonly candidateAccountUserId: string;
  readonly score: number;
  readonly eligible: boolean;
  readonly gaps: readonly MatchGap[];
  readonly constraintViolations: readonly string[];
  readonly createdAtISO: string;
}

export interface MatchCandidateInput {
  readonly accountUserId: string;
  readonly score: number;
  readonly eligible: boolean;
  readonly gaps?: readonly MatchGap[];
  readonly constraintViolations?: readonly string[];
}

export function createMatch(
  matchId: string,
  taskId: string,
  nowISO: string,
  candidate: MatchCandidateInput,
): Match {
  return {
    matchId,
    taskId,
    candidateAccountUserId: candidate.accountUserId,
    score: candidate.score,
    eligible: candidate.eligible,
    gaps: candidate.gaps ?? [],
    constraintViolations: candidate.constraintViolations ?? [],
    createdAtISO: nowISO,
  };
}
