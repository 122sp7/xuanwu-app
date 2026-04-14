/**
 * workspace api/facade.ts
 *
 * Canonical public behavior surface for the workspace bounded context.
 * Cross-module and app-layer consumers invoke commands and queries from here.
 *
 * Internal source: interfaces/facades/
 */

export {
  getWorkspacesForAccount,
  subscribeToWorkspacesForAccount,
  getWorkspaceById,
  getWorkspaceByIdForAccount,
  buildWikiContentTree,
  authorizeWorkspaceTeam,
  createWorkspace,
  createWorkspaceLocation,
  createWorkspaceWithCapabilities,
  deleteWorkspace,
  grantIndividualWorkspaceAccess,
  mountCapabilities,
  updateWorkspaceSettings,
} from "../interfaces/facades/workspace.facade";

export {
  getWorkspaceMembers,
} from "../interfaces/facades/workspace-member.facade";

export {
  getOrganizationAuditLogs,
  getWorkspaceAuditLogs,
} from "../subdomains/audit/api";

export {
  workspaceFeedFacade,
  WorkspaceFeedFacade,
  getAccountWorkspaceFeed,
  getWorkspaceFeed,
  getWorkspaceFeedPost,
  bookmarkWorkspaceFeedPost,
  createWorkspaceFeedPost,
  likeWorkspaceFeedPost,
  replyWorkspaceFeedPost,
  repostWorkspaceFeedPost,
  shareWorkspaceFeedPost,
  viewWorkspaceFeedPost,
} from "../subdomains/feed/api";

export type {
  CreateWorkspaceFeedPostParams,
  ReplyWorkspaceFeedPostParams,
  RepostWorkspaceFeedPostParams,
  WorkspaceFeedInteractionParams,
} from "../subdomains/feed/api";

export {
  assignWorkDemand,
  getAccountDemands,
  getWorkspaceDemands,
  submitWorkDemand,
} from "../subdomains/scheduling/api";

export type {
  AssignMemberInput,
  CreateDemandInput,
} from "../subdomains/scheduling/api";

export {
  WorkspaceFlowFacade,
  WorkspaceFlowTaskFacade,
  WorkspaceFlowTaskBatchJobFacade,
  WorkspaceFlowIssueFacade,
  WorkspaceFlowInvoiceFacade,
  getWorkspaceFlowTasks,
  getWorkspaceFlowTask,
  getWorkspaceFlowIssues,
  getWorkspaceFlowInvoices,
  getWorkspaceFlowInvoiceItems,
  getWorkspaceFlowTaskMaterializationBatchJobs,
  getWorkspaceFlowTaskMaterializationBatchJob,
  createKnowledgeToWorkflowListener,
} from "../subdomains/workspace-workflow/api";

export type {
  KnowledgePageApprovedHandler,
} from "../subdomains/workspace-workflow/api";
