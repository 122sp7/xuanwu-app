import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "./contracts";
import { workspaceQueryPort } from "./workspace-runtime";

export function buildWikiContentTree(
  seeds: WikiAccountSeed[],
): Promise<WikiAccountContentNode[]> {
  return workspaceQueryPort.buildWikiContentTree(seeds);
}