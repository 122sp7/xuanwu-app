/**
 * Module: workspace
 * Layer: application/queries
 * Purpose: Build the workspace content-tree from account/workspace seeds.
 *          This is a query projection, not a use case — it aggregates
 *          workspace-scoped content nodes for read-only display.
 *
 * DDD Rule 5:  Pure reads → Query, not Use Case.
 * DDD Rule 13: Read → queries/
 */

import type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WikiContentItemNode,
  WikiWorkspaceContentNode,
} from "../../domain/entities/WikiContentTree";
import type { WikiWorkspaceRepository } from "../../domain/ports/output/WikiWorkspaceRepository";

function buildContentBaseItems(workspaceId: string): WikiContentItemNode[] {
  return [
    { key: "spaces", label: "Workspace", href: `/workspace/${workspaceId}`, enabled: true },
    {
      key: "pages",
      label: "Knowledge Pages",
      href: `/workspace/${workspaceId}?tab=Overview&panel=knowledge-pages`,
      enabled: true,
    },
    {
      key: "libraries",
      label: "Libraries",
      href: `/workspace/${workspaceId}?tab=Overview&panel=source-libraries`,
      enabled: true,
    },
    { key: "documents", label: "Documents", href: `/workspace/${workspaceId}?tab=Files`, enabled: true },
    {
      key: "vector-index",
      label: "Vector Index",
      href: `/workspace/${workspaceId}?tab=Overview&panel=knowledge-databases`,
      enabled: false,
    },
    { key: "rag", label: "RAG", href: `/workspace/${workspaceId}?tab=Notebook`, enabled: true },
    { key: "ai-tools", label: "AI Tools", href: `/workspace/${workspaceId}?tab=AiChat`, enabled: true },
  ];
}

function buildWorkspaceNode(workspaceId: string, workspaceName: string): WikiWorkspaceContentNode {
  return {
    workspaceId,
    workspaceName,
    href: `/workspace/${workspaceId}`,
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
