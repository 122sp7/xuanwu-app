import type {
  WikiBetaAccountContentNode,
  WikiBetaAccountSeed,
  WikiBetaContentItemNode,
  WikiBetaWorkspaceContentNode,
} from "../../domain/entities/wiki-beta.types";
import type { WikiBetaWorkspaceRepository } from "../../domain/repositories/wiki-beta.repositories";
import { FirebaseWikiBetaWorkspaceRepository } from "../../infrastructure";

const defaultWorkspaceRepository: WikiBetaWorkspaceRepository = new FirebaseWikiBetaWorkspaceRepository();

function buildContentBaseItems(workspaceId: string): WikiBetaContentItemNode[] {
  return [
    { key: "spaces", label: "WorkSpace Wiki-Beta", href: `/workspace/${workspaceId}?tab=Wiki`, enabled: true },
    { key: "pages", label: "Pages", href: "/wiki-beta/pages", enabled: true },
    { key: "libraries", label: "Libraries", href: "/wiki-beta/libraries", enabled: true },
    { key: "documents", label: "Documents", href: `/workspace/${workspaceId}?tab=Files`, enabled: true },
    { key: "vector-index", label: "Vector Index", href: "/wiki-beta", enabled: false },
    { key: "rag", label: "RAG", href: "/wiki-beta", enabled: true },
    { key: "ai-tools", label: "AI Tools", href: "/ai-chat", enabled: true },
  ];
}

function buildWorkspaceNode(workspaceId: string, workspaceName: string): WikiBetaWorkspaceContentNode {
  return {
    workspaceId,
    workspaceName,
    href: `/workspace/${workspaceId}?tab=Wiki`,
    contentBaseItems: buildContentBaseItems(workspaceId),
  };
}

export async function buildWikiBetaContentTree(
  seeds: WikiBetaAccountSeed[],
  workspaceRepository: WikiBetaWorkspaceRepository = defaultWorkspaceRepository,
): Promise<WikiBetaAccountContentNode[]> {
  const accountNodes = await Promise.all(
    seeds.map(async (seed) => {
      const workspaces = await workspaceRepository.listByAccountId(seed.accountId);
      return {
        accountId: seed.accountId,
        accountName: seed.accountName,
        accountType: seed.accountType,
        isActive: seed.isActive,
        membersHref: seed.accountType === "organization" ? "/organization/members" : undefined,
        teamsHref: seed.accountType === "organization" ? "/organization/teams" : undefined,
        workspaces: workspaces.map((workspace) => buildWorkspaceNode(workspace.id, workspace.name)),
      } satisfies WikiBetaAccountContentNode;
    }),
  );

  return accountNodes.sort((a, b) => {
    if (a.accountType !== b.accountType) {
      return a.accountType === "personal" ? -1 : 1;
    }
    return a.accountName.localeCompare(b.accountName, "zh-Hant");
  });
}
