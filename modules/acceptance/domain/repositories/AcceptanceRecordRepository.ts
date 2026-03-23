/**
 * Module: acceptance
 * Layer: domain/repositories
 * Purpose: AcceptanceRecordRepository — persistence port for the AcceptanceRecord aggregate.
 *
 * Only the domain types and value-objects are imported here; no Firebase or framework
 * dependencies are allowed in the domain layer.
 */

import type { AcceptanceRecord, CreateAcceptanceRecordInput } from "../entities/AcceptanceRecord";
import type { AcceptanceLifecycleStatus } from "../value-objects/acceptance-state";

export interface AcceptanceRecordTransitionExtra {
  readonly reviewedBy?: string;
  readonly signedBy?: string;
  readonly rejectionReason?: string;
}

export interface AcceptanceRecordRepository {
  create(input: CreateAcceptanceRecordInput): Promise<AcceptanceRecord>;
  findById(recordId: string): Promise<AcceptanceRecord | null>;
  findByWorkspaceId(workspaceId: string): Promise<AcceptanceRecord[]>;
  transitionStatus(
    recordId: string,
    to: AcceptanceLifecycleStatus,
    nowISO: string,
    extra?: AcceptanceRecordTransitionExtra,
  ): Promise<AcceptanceRecord | null>;
}
