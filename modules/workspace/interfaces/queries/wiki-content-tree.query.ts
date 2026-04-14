import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "../contracts";
import { workspaceQueryPort } from "../runtime";

export function buildWikiContentTree(
  seeds: WikiAccountSeed[],
): Promise<WikiAccountContentNode[]> {
  return workspaceQueryPort.buildWikiContentTree(seeds);
}
