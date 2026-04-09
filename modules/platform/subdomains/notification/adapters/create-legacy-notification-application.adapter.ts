import {
	dispatchNotification,
	markAllNotificationsRead,
	markNotificationRead,
} from "@/modules/notification/api";
import type { LegacyNotificationApplicationPort } from "../application";

export function createLegacyNotificationApplicationAdapter(): LegacyNotificationApplicationPort {
	return {
		dispatchNotification,
		markNotificationRead,
		markAllNotificationsRead,
	};
}
