import { WorkspaceRouteShim } from "../../_shell/WorkspaceRouteShim";

export default function SourceDocumentsPage() {
  return (
    <WorkspaceRouteShim
      tab="Files"
      loadingMessage="正在導向 Workspace Files…"
    />
  );
}
