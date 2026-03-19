import type { AcceptanceGate } from "../entities/AcceptanceGate";

export interface AcceptanceScope {
  readonly workspaceId: string;
}

export interface AcceptanceRepository {
  listByWorkspace(scope: AcceptanceScope): readonly AcceptanceGate[];
}
