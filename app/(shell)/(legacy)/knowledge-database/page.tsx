import { WorkspaceRouteShim } from "../_shell/WorkspaceRouteShim";

export default function KnowledgeDatabasePage() {
  return (
    <WorkspaceRouteShim
      panel="knowledge-databases"
      loadingMessage="正在導向 Workspace Overview（Knowledge Databases）…"
    />
  );
}
