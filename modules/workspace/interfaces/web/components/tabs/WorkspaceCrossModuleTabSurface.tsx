"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import type { WorkspaceEntity } from "../../../api/contracts";
import type { WorkspaceTabValue } from "../../navigation/workspace-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import {
  KnowledgeBaseArticlesPanel,
  KnowledgeDatabasesPanel,
  KnowledgePagesPanel,
} from "@/modules/notion/api";
import {
  RagQueryPanel,
  SourceDocumentsPanel,
} from "@/modules/notebooklm/api";

// Dynamic import to break synchronous module-evaluation cycle between
// workspace/api → workspace/interfaces → notebooklm/api → ConversationPanel → workspace/api.
// SSR disabled because ConversationPanel is a "use client" component that
// relies on browser-only hooks (useState, useEffect) and workspace context providers.
const ConversationPanel = dynamic(
  () =>
    import("@/modules/notebooklm/subdomains/conversation/api/ui").then(
      (m) => m.ConversationPanel,
    ),
  { ssr: false },
);

interface WorkspaceCrossModuleTabSurfaceOptions {
  readonly tab: WorkspaceTabValue;
  readonly workspace: WorkspaceEntity;
  readonly accountId: string;
  readonly currentUserId?: string | null;
  readonly workspaces: Record<string, WorkspaceEntity>;
}

function renderWorkspacePlaceholder(title: string, description: string): ReactNode {
  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function renderWorkspaceCrossModuleTabSurface(
  options: WorkspaceCrossModuleTabSurfaceOptions,
): ReactNode | null {
  const { tab, workspace, accountId, currentUserId, workspaces } = options;

  switch (tab) {
    case "NotionKnowledge":
      return (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Notion Knowledge</CardTitle>
            <CardDescription>Workspace orchestration view for notion knowledge pages.</CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgePagesPanel
              accountId={workspace.accountId}
              workspaceId={workspace.id}
              currentUserId={currentUserId}
            />
          </CardContent>
        </Card>
      );
    case "NotionAuthoring":
      return (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Notion Authoring</CardTitle>
            <CardDescription>Workspace orchestration view for article authoring and lifecycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeBaseArticlesPanel
              accountId={workspace.accountId}
              workspaceId={workspace.id}
              currentUserId={currentUserId}
            />
          </CardContent>
        </Card>
      );
    case "NotionDatabase":
      return (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Notion Database</CardTitle>
            <CardDescription>Workspace orchestration view for knowledge databases.</CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeDatabasesPanel
              accountId={workspace.accountId}
              workspaceId={workspace.id}
              currentUserId={currentUserId}
            />
          </CardContent>
        </Card>
      );
    case "NotionCollaboration":
      return renderWorkspacePlaceholder(
        "Notion Collaboration",
        "Collaboration panels need a concrete content context (contentId/contentType). Select a page or article first, then open collaboration from its detail flow.",
      );
    case "NotionRelations":
      return renderWorkspacePlaceholder(
        "Notion Relations",
        "Relations UI is not mounted yet. This tab is reserved for workspace-owned orchestration when relation graph surfaces are introduced.",
      );
    case "NotionTaxonomy":
      return renderWorkspacePlaceholder(
        "Notion Taxonomy",
        "Taxonomy UI is not mounted yet. This tab is reserved for workspace-owned orchestration when taxonomy surfaces are introduced.",
      );
    case "NotebookSource":
      return (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>NotebookLM Source</CardTitle>
            <CardDescription>Workspace orchestration view for source document ingestion.</CardDescription>
          </CardHeader>
          <CardContent>
            <SourceDocumentsPanel workspaceId={workspace.id} />
          </CardContent>
        </Card>
      );
    case "Notebook":
    case "NotebookSynthesis":
      return <RagQueryPanel workspaceId={workspace.id} />;
    case "NotebookConversation":
    case "AiChat":
      return (
        <ConversationPanel
          accountId={accountId}
          workspaces={workspaces}
          requestedWorkspaceId={workspace.id}
        />
      );
    case "NotebookNotebook":
      return renderWorkspacePlaceholder(
        "NotebookLM Notebook",
        "Notebook subdomain currently exposes actions without a dedicated workspace-facing panel. This tab is reserved for future notebook-centric UI.",
      );
    default:
      return null;
  }
}
