import {
	dispatchNotification,
	markAllNotificationsRead,
	markNotificationRead,
} from "@/modules/notification/api";

/**
 * Temporary compatibility port during migration from modules/notification.
 */
export interface LegacyNotificationApplicationPort {
	dispatchNotification: typeof dispatchNotification;
	markNotificationRead: typeof markNotificationRead;
	markAllNotificationsRead: typeof markAllNotificationsRead;
}
