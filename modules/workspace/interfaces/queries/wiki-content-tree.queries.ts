import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "../../api/contracts";
import type { WikiWorkspaceRepository } from "../../ports";
import { buildWikiContentTree as buildWikiContentTreeProjection } from "../../application/use-cases/wiki-content-tree.use-case";
import { FirebaseWikiWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWikiWorkspaceRepository";

function makeWikiWorkspaceRepository(): WikiWorkspaceRepository {
  return new FirebaseWikiWorkspaceRepository();
}

export function buildWikiContentTree(
  seeds: WikiAccountSeed[],
  workspaceRepository: WikiWorkspaceRepository = makeWikiWorkspaceRepository(),
): Promise<WikiAccountContentNode[]> {
  return buildWikiContentTreeProjection(seeds, workspaceRepository);
}