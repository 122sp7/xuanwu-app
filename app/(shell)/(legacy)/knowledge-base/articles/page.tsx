import { WorkspaceRouteShim } from "../../_shell/WorkspaceRouteShim";

export default function KnowledgeBaseArticlesPage() {
  return (
    <WorkspaceRouteShim
      panel="knowledge-base-articles"
      loadingMessage="正在導向 Workspace Overview（Knowledge Base Articles）…"
    />
  );
}
