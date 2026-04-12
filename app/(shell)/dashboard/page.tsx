import { WorkspaceRouteShim } from "../_shell/WorkspaceRouteShim";

export default function DashboardPage() {
  return (
    <WorkspaceRouteShim
      loadingMessage="正在導向 Workspace Overview…"
    />
  );
}

