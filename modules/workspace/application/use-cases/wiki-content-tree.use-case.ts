/**
 * Module: workspace
 * Layer: application/use-cases
 * Purpose: Build the Wiki sidebar content-tree from account/workspace seeds.
 *          Lives in workspace because it aggregates workspace-scoped content nodes.
 */

import type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
} from "../../domain/entities/WikiContentTree";
import type { WikiWorkspaceRepository } from "../../domain/repositories/WikiWorkspaceRepository";

function buildContentBaseItems(workspaceId: string): WikiContentItemNode[] {
  return [
    { key: "spaces", label: "Wiki", href: `/workspace/${workspaceId}?tab=Wiki`, enabled: true },
    { key: "pages", label: "Pages", href: "/knowledge/pages", enabled: true },
    { key: "libraries", label: "Libraries", href: "/source/libraries", enabled: true },
    { key: "documents", label: "Documents", href: `/workspace/${workspaceId}?tab=Files`, enabled: true },
    { key: "vector-index", label: "Vector Index", href: "/knowledge", enabled: false },
    { key: "rag", label: "RAG", href: "/notebook/rag-query", enabled: true },
    { key: "ai-tools", label: "AI Tools", href: "/ai-chat", enabled: true },
  ];
}

function buildWorkspaceNode(workspaceId: string, workspaceName: string): WikiWorkspaceContentNode {
  return {
    workspaceId,
    workspaceName,
    href: `/workspace/${workspaceId}?tab=Wiki`,
    contentBaseItems: buildContentBaseItems(workspaceId),
  };
}

export async function buildWikiContentTree(
  seeds: WikiAccountSeed[],
  workspaceRepository: WikiWorkspaceRepository,
): Promise<WikiAccountContentNode[]> {
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
      } satisfies WikiAccountContentNode;
    }),
  );

  return accountNodes.sort((a, b) => {
    if (a.accountType !== b.accountType) {
      return a.accountType === "personal" ? -1 : 1;
    }
    return a.accountName.localeCompare(b.accountName, "zh-Hant");
  });
}
