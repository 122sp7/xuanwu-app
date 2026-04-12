import { WorkspaceRouteShim } from "../_shell/WorkspaceRouteShim";

export default function SettingsPage() {
  return (
    <WorkspaceRouteShim
      panel="settings"
      loadingMessage="正在導向 Workspace Settings…"
    />
  );
}

