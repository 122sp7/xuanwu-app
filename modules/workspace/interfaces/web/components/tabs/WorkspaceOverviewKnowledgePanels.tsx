"use client";

import { KnowledgeBaseArticlesPanel, KnowledgeDatabasesPanel, KnowledgePagesPanel } from "@/modules/notion/api";
import { LibrariesPanel, LibraryTablePanel } from "@/modules/notebooklm/api";
import type { WorkspaceEntity } from "../../../api/contracts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { TabsContent } from "@ui-shadcn/ui/tabs";

interface WorkspaceOverviewKnowledgePanelsProps {
  readonly workspace: WorkspaceEntity;
  readonly currentUserId?: string | null;
}

export function WorkspaceOverviewKnowledgePanels({
  workspace,
  currentUserId,
}: WorkspaceOverviewKnowledgePanelsProps) {
  return (
    <>
      <TabsContent value="knowledge-pages" className="mt-4 space-y-4">
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Knowledge Pages</CardTitle>
            <CardDescription>
              Workspace orchestration surface for notion knowledge page tree and page entry flow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgePagesPanel
              accountId={workspace.accountId}
              workspaceId={workspace.id}
              currentUserId={currentUserId}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="knowledge-base-articles" className="mt-4 space-y-4">
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Knowledge Base Articles</CardTitle>
            <CardDescription>
              Workspace orchestration surface for notion authoring article lifecycle and categorization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeBaseArticlesPanel
              accountId={workspace.accountId}
              workspaceId={workspace.id}
              currentUserId={currentUserId}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="knowledge-databases" className="mt-4 space-y-4">
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Knowledge Databases</CardTitle>
            <CardDescription>
              Workspace orchestration surface for notion structured database views.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeDatabasesPanel
              accountId={workspace.accountId}
              workspaceId={workspace.id}
              currentUserId={currentUserId}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="source-libraries" className="mt-4 space-y-4">
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Source Libraries</CardTitle>
            <CardDescription>
              Workspace orchestration surface for notebooklm source libraries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LibraryTablePanel accountId={workspace.accountId} workspaceId={workspace.id} />
            <LibrariesPanel accountId={workspace.accountId} workspaceId={workspace.id} />
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
