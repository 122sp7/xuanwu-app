/**
 * Module: workspace
 * Layer: domain/repositories
 * Purpose: Repository port for fetching workspace refs used by the
 *          WikiBeta content-tree use-case.
 */

import type { WikiBetaWorkspaceRef } from "../entities/WikiBetaContentTree";

export interface WikiBetaWorkspaceRepository {
  listByAccountId(accountId: string): Promise<WikiBetaWorkspaceRef[]>;
}
