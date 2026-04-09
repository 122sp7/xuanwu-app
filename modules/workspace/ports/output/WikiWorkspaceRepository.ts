/**
 * Module: workspace
 * Layer: ports/output
 * Purpose: Repository port for fetching workspace refs used by the
 *          Wiki content-tree use-case.
 */

import type { WikiWorkspaceRef } from "../../application/dtos/wiki-content-tree.dto";

export interface WikiWorkspaceRepository {
  listByAccountId(accountId: string): Promise<WikiWorkspaceRef[]>;
}
