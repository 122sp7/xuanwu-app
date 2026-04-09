import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "./contracts";
import type { WikiWorkspaceRepository } from "../../ports";
import * as wikiContentTreeUseCase from "../../application/use-cases/wiki-content-tree.use-case";
import { FirebaseWikiWorkspaceRepository } from "../../infrastructure/firebase/FirebaseWikiWorkspaceRepository";

function makeWikiWorkspaceRepository(): WikiWorkspaceRepository {
  return new FirebaseWikiWorkspaceRepository();
}

export function buildWikiContentTree(
  seeds: WikiAccountSeed[],
  workspaceRepository: WikiWorkspaceRepository = makeWikiWorkspaceRepository(),
): Promise<WikiAccountContentNode[]> {
  return wikiContentTreeUseCase.buildWikiContentTree(seeds, workspaceRepository);
}