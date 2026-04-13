/**
 * NotificationService — Backward-compatibility re-export shim.
 *
 * Composition logic has been relocated to
 * interfaces/composition/notification-service.ts to fix the
 * infrastructure → application dependency direction violation.
 */

export { notificationService } from "../interfaces/composition/notification-service";
