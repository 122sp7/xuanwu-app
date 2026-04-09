/**
 * Module: workspace
 * Layer: domain/repositories
 * Purpose: Repository port for fetching workspace refs used by the
 *          Wiki content-tree use-case.
 */

import type { WikiWorkspaceRef } from "../../domain/entities/WikiContentTree";

export interface WikiWorkspaceRepository {
  listByAccountId(accountId: string): Promise<WikiWorkspaceRef[]>;
}
