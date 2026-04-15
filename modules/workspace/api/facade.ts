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
  getWorkspaceManagedFiles,
  getWorkspaceManagedFileVersions,
  uploadWorkspaceManagedFile,
  renameWorkspaceManagedFile,
  deleteWorkspaceManagedFile,
  runWorkspaceManagedFileOcr,
  runWorkspaceManagedFileRagIndex,
  createWorkspaceManagedKnowledgePage,
  previewWorkspaceManagedTasks,
  createWorkspaceManagedTasks,
} from "../interfaces/facades/workspace-file.facade";

export type {
  WorkspaceManagedFileActionResult,
  WorkspaceManagedFileItem,
  WorkspaceManagedFileVersionItem,
  WorkspaceManagedTaskCandidate,
  WorkspaceManagedTaskPreviewResult,
} from "../interfaces/facades/workspace-file.facade";

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
  getWorkspaceFlowTasks,
  getWorkspaceFlowTask,
  wfCreateTask,
  wfUpdateTask,
  wfAssignTask,
  wfArchiveTask,
} from "../subdomains/task/api";

export {
  getWorkspaceFlowIssues,
  getWorkspaceFlowIssue,
  wfOpenIssue,
  wfStartIssue,
  wfFixIssue,
  wfResolveIssue,
  wfCloseIssue,
} from "../subdomains/issue/api";

export {
  getWorkspaceFlowInvoices,
  getWorkspaceFlowInvoiceItems,
  wfCreateInvoice,
  wfAddInvoiceItem,
  wfUpdateInvoiceItem,
  wfRemoveInvoiceItem,
  wfSubmitInvoice,
  wfReviewInvoice,
  wfApproveInvoice,
  wfRejectInvoice,
  wfPayInvoice,
  wfCloseInvoice,
} from "../subdomains/settlement/api";

export {
  getWorkspaceFlowTaskMaterializationBatchJobs,
  getWorkspaceFlowTaskMaterializationBatchJob,
  wfSubmitTaskMaterializationBatchJob as submitTaskMaterializationBatchJob,
  wfExtractTaskCandidatesFromKnowledge as extractTaskCandidatesFromKnowledge,
  createKnowledgeToWorkflowListener,
} from "../subdomains/orchestration/api";

export type {
  KnowledgePageApprovedHandler,
} from "../subdomains/orchestration/api";

export {
  updateWorkspaceNotificationPreferences,
  notifyWorkspaceMembers,
  getWorkspaceNotificationPreferences,
} from "@/modules/platform/subdomains/notification/api";
