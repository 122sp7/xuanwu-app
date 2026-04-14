/**
 * workspace/subdomains/notification — public API boundary.
 *
 * Cross-subdomain and cross-module consumers must import through this path.
 * Internal layers (domain/, application/, infrastructure/, interfaces/) must
 * not be imported directly from outside this subdomain.
 */

// ── Types & value objects ────────────────────────────────────────────────────
export type {
  WorkspaceNotificationEventType,
  WorkspaceNotificationPreferenceDto,
} from "../application/dto/notification-preference.dto";
export { WORKSPACE_NOTIFICATION_EVENT_TYPES } from "../application/dto/notification-preference.dto";

// ── Commands ─────────────────────────────────────────────────────────────────
export type { UpdateNotificationPreferencesCommand } from "../application/use-cases/update-notification-preferences.use-case";
export type { WorkspaceEventPayload } from "../application/use-cases/notify-workspace-members.use-case";

// ── Server actions & queries (composition surface) ──────────────────────────
export {
  updateWorkspaceNotificationPreferences,
  notifyWorkspaceMembers,
} from "../interfaces/_actions/workspace-notification.actions";
export { getWorkspaceNotificationPreferences } from "../interfaces/queries/workspace-notification.queries";

// ── UI components ────────────────────────────────────────────────────────────
export { WorkspaceNotificationPreferencesPanel } from "../interfaces/components/WorkspaceNotificationPreferencesPanel";

// ── Composition service (for internal workspace orchestration only) ──────────
export { workspaceNotificationService } from "../interfaces/composition/notification-preference-service";

