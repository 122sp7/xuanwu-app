/**
 * @package matching-engine
 * Matching domain — contracts, ports, and orchestration types for talent matching.
 *
 * This package defines the core domain contracts for the matching engine:
 *   - MatchingRequest — a request to match skills/resources to tasks
 *   - MatchAssignment — a produced assignment linking a person to a task
 *   - MatchScore — scoring/ranking contract
 *   - MatchingProjection — read-model for match state
 *   - IMatchingEngine — orchestration port
 *
 * Dependency rule: This package depends only on @shared-types and @task-core.
 * No infrastructure or framework code is allowed.
 *
 * Usage:
 *   import type { MatchingRequest, MatchAssignment, IMatchingEngine } from "@matching-engine";
 */

import type { ID } from "@shared-types";

// ── Matching request ───────────────────────────────────────────────────────

export type MatchingRequestId = ID;
export type MatchAssignmentId = ID;
export type MatchScheduleId = ID;

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

/** Port that the matching flow orchestrator must implement. */
export interface IMatchingEngine {
  run(requestId: MatchingRequestId): Promise<MatchingProjection>;
  score(requestId: MatchingRequestId, candidateIds: string[]): Promise<MatchScore[]>;
}
