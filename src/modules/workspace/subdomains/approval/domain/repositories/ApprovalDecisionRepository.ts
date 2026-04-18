import type { ApprovalDecisionSnapshot } from "../entities/ApprovalDecision";

export interface ApprovalDecisionRepository {
  findById(decisionId: string): Promise<ApprovalDecisionSnapshot | null>;
  findByTaskId(taskId: string): Promise<ApprovalDecisionSnapshot[]>;
  findByWorkspaceId(workspaceId: string): Promise<ApprovalDecisionSnapshot[]>;
  save(decision: ApprovalDecisionSnapshot): Promise<void>;
  delete(decisionId: string): Promise<void>;
}
