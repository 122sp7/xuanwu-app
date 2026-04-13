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

function buildWorkspaceHref(accountId: string, workspaceId: string, suffix = ""): string {
  const encodedAccountId = encodeURIComponent(accountId);
  const encodedWorkspaceId = encodeURIComponent(workspaceId);
  const baseHref = `/${encodedAccountId}/${encodedWorkspaceId}`;
  return suffix ? `${baseHref}${suffix}` : baseHref;
}

function buildContentBaseItems(accountId: string, workspaceId: string): WikiContentItemNode[] {
  return [
    { key: "spaces", label: "Workspace", href: buildWorkspaceHref(accountId, workspaceId), enabled: true },
    {
      key: "pages",
      label: "Knowledge Pages",
      href: buildWorkspaceHref(accountId, workspaceId, "?tab=Overview&panel=knowledge-pages"),
      enabled: true,
    },
    {
      key: "libraries",
      label: "Libraries",
      href: buildWorkspaceHref(accountId, workspaceId, "?tab=Overview&panel=source-libraries"),
      enabled: true,
    },
    { key: "documents", label: "Documents", href: buildWorkspaceHref(accountId, workspaceId, "?tab=Files"), enabled: true },
    {
      key: "vector-index",
      label: "Vector Index",
      href: buildWorkspaceHref(accountId, workspaceId, "?tab=Overview&panel=knowledge-databases"),
      enabled: false,
    },
    { key: "rag", label: "RAG", href: buildWorkspaceHref(accountId, workspaceId, "?tab=Notebook"), enabled: true },
    { key: "ai-tools", label: "AI Tools", href: buildWorkspaceHref(accountId, workspaceId, "?tab=AiChat"), enabled: true },
  ];
}

function buildWorkspaceNode(accountId: string, workspaceId: string, workspaceName: string): WikiWorkspaceContentNode {
  return {
    workspaceId,
    workspaceName,
    href: buildWorkspaceHref(accountId, workspaceId),
    contentBaseItems: buildContentBaseItems(accountId, workspaceId),
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
        membersHref: seed.accountType === "organization" ? "/members" : undefined,
        teamsHref: seed.accountType === "organization" ? "/teams" : undefined,
        workspaces: workspaces.map((workspace) => buildWorkspaceNode(seed.accountId, workspace.id, workspace.name)),
      } satisfies WikiAccountContentNode;
    }),
  );

  return accountNodes.sort((a, b) => {
    if (a.accountType !== b.accountType) {
      return a.accountType === "user" ? -1 : 1;
    }
    return a.accountName.localeCompare(b.accountName, "zh-Hant");
  });
}
