"use client";

import { KnowledgeBaseArticlesRouteScreen, KnowledgeDatabasesRouteScreen, KnowledgePagesRouteScreen } from "@/modules/notion/api";
import { LibrariesView, LibraryTableView } from "@/modules/notebooklm/api";
import type { WorkspaceEntity } from "../../../api/contracts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui-shadcn/ui/card";
import { TabsContent } from "@ui-shadcn/ui/tabs";

interface WorkspaceOverviewKnowledgePanelsProps {
  readonly workspace: WorkspaceEntity;
}

export function WorkspaceOverviewKnowledgePanels({
  workspace,
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
            <KnowledgePagesRouteScreen
              accountId={workspace.accountId}
              workspaceId={workspace.id}
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
            <KnowledgeBaseArticlesRouteScreen
              accountId={workspace.accountId}
              workspaceId={workspace.id}
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
            <KnowledgeDatabasesRouteScreen
              accountId={workspace.accountId}
              workspaceId={workspace.id}
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
            <LibraryTableView accountId={workspace.accountId} workspaceId={workspace.id} />
            <LibrariesView accountId={workspace.accountId} workspaceId={workspace.id} />
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
}
