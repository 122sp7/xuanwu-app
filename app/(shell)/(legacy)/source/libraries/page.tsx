import { WorkspaceRouteShim } from "../../_shell/WorkspaceRouteShim";

export default function SourceLibrariesPage() {
  return (
    <WorkspaceRouteShim
      panel="source-libraries"
      loadingMessage="正在導向 Workspace Overview（Source Libraries）…"
    />
  );
}
