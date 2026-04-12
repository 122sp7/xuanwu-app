import { WorkspaceRouteShim } from "../../_shell/WorkspaceRouteShim";

export default function OrganizationKnowledgePage() {
  return (
    <WorkspaceRouteShim
      panel="knowledge-pages"
      loadingMessage="正在導向 Workspace Overview（Knowledge Pages）…"
    />
  );
}
