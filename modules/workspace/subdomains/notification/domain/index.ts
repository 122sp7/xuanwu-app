/**
 * workspace/subdomains/notification/domain barrel.
 * Cross-layer imports must use this barrel, not internal sub-paths.
 */

export type { WorkspaceNotificationPreferenceProps } from "./entities/WorkspaceNotificationPreference";
export { WorkspaceNotificationPreference } from "./entities/WorkspaceNotificationPreference";
export * from "./value-objects";
export * from "./events";
export type { WorkspaceNotificationPreferenceRepository } from "./repositories/WorkspaceNotificationPreferenceRepository";
export * from "./ports";
