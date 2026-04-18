/**
 * Platform Module — public API surface.
 * All cross-module consumers must import from here only.
 */

export type { PlatformScopeProps } from "./shared/types";
export {
  PlatformConfigurationError,
  PlatformAuthorizationError,
  PlatformResourceNotFoundError,
} from "./shared/errors";
export type {
  PlatformDomainEvent,
  PlatformPublishedEvent,
} from "./shared/events";

export type {
  JobDocument,
  JobChunk,
  JobChunkMetadata,
  BackgroundJob,
  BackgroundJobStatus,
  BackgroundJobRepository,
} from "./subdomains/background-job/domain";
export { canTransitionJobStatus } from "./subdomains/background-job/domain";
export {
  RegisterJobDocumentUseCase,
  AdvanceJobStageUseCase,
  ListWorkspaceJobsUseCase,
} from "./subdomains/background-job/application";
export type {
  RegisterJobDocumentInput,
  AdvanceJobStageInput,
  ListWorkspaceJobsInput,
  JobResult,
} from "./subdomains/background-job/application";
export { InMemoryBackgroundJobRepository } from "./subdomains/background-job/adapters/outbound";

export type {
  NotificationEntity,
  NotificationType,
  DispatchNotificationInput,
  WorkspaceNotificationPreferenceProps,
  NotificationRepository,
  WorkspaceNotificationPreferenceRepository,
  WorkspaceNotificationEventType,
} from "./subdomains/notification/domain";
export {
  WorkspaceNotificationPreference,
  WORKSPACE_NOTIFICATION_EVENT_TYPES,
  createWorkspaceNotificationEventType,
  NotificationAggregate,
} from "./subdomains/notification/domain";
export {
  DispatchNotificationUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
  UpdateNotificationPreferencesUseCase,
  NotifyWorkspaceMembersUseCase,
  GetNotificationsForRecipientUseCase,
  GetUnreadCountUseCase,
  GetWorkspaceNotificationPreferencesQuery,
} from "./subdomains/notification/application";
export type {
  UpdateNotificationPreferencesCommand,
  WorkspaceEventPayload,
  WorkspaceNotificationPreferenceDto,
} from "./subdomains/notification/application";
export {
  InMemoryNotificationRepository,
  InMemoryWorkspaceNotificationPreferenceRepository,
} from "./subdomains/notification/adapters/outbound";

export {
  SHELL_ACCOUNT_SECTION_MATCHERS,
  SHELL_ACCOUNT_NAV_ITEMS,
  SHELL_ORGANIZATION_MANAGEMENT_ITEMS,
  SHELL_SECTION_LABELS,
  SHELL_RAIL_CATALOG_ITEMS,
  SHELL_CONTEXT_SECTION_CONFIG,
  SHELL_MOBILE_NAV_ITEMS,
  SHELL_ORG_PRIMARY_NAV_ITEMS,
  SHELL_ORG_SECONDARY_NAV_ITEMS,
  buildShellContextualHref,
  normalizeShellRoutePath,
  isExactOrChildPath,
  listShellRailCatalogItems,
  resolveShellBreadcrumbLabel,
  resolveShellNavSection,
  resolveShellPageTitle,
} from "./subdomains/platform-config/application";
export type {
  ShellNavItem,
  ShellNavSection,
  ShellRailCatalogItem,
  ShellContextSectionConfig,
  ShellRouteContext,
} from "./subdomains/platform-config/application";

export { listShellCommandCatalogItems } from "./subdomains/search/application";
export type { ShellCommandCatalogItem } from "./subdomains/search/application";

export type { CacheEntry, CacheRepository } from "./subdomains/cache/domain";
export {
  ReadCacheEntryUseCase,
  WriteCacheEntryUseCase,
  RemoveCacheEntryUseCase,
} from "./subdomains/cache/application";
export type {
  WriteCacheEntryInput,
  ReadCacheEntryInput,
  RemoveCacheEntryInput,
} from "./subdomains/cache/application";
export { InMemoryCacheRepository } from "./subdomains/cache/adapters/outbound";

export type { StoredFile, FileStorageRepository } from "./subdomains/file-storage/domain";
export {
  CreateStoredFileUseCase,
  GetStoredFileUseCase,
  DeleteStoredFileUseCase,
  ListStoredFilesUseCase,
} from "./subdomains/file-storage/application";
export type {
  CreateStoredFileInput,
  DeleteStoredFileInput,
  GetStoredFileInput,
  ListStoredFilesInput,
} from "./subdomains/file-storage/application";
export { InMemoryFileStorageRepository } from "./subdomains/file-storage/adapters/outbound";
export {
  uploadWorkspaceFile,
  getWorkspaceFileDownloadUrl,
  createClientFileStorageUseCases,
} from "./adapters/outbound/firebase-composition";
