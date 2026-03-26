export { WorkspaceFeedFacade, workspaceFeedFacade } from "./workspace-feed.facade";
export type {
  CreateWorkspaceFeedPostParams,
  ReplyWorkspaceFeedPostParams,
  RepostWorkspaceFeedPostParams,
  WorkspaceFeedInteractionParams,
} from "./workspace-feed.facade";

// ── UI components (cross-module public) ──────────────────────────────────────
export { WorkspaceFeedWorkspaceView } from "../interfaces/components/WorkspaceFeedWorkspaceView";
export { WorkspaceFeedAccountView } from "../interfaces/components/WorkspaceFeedAccountView";
