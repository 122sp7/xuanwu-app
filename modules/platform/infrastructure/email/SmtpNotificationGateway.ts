/**
 * SmtpNotificationGateway — Email Adapter (Driven Adapter)
 *
 * Implements: NotificationGateway
 * Delivers notifications. In production, replace console.info with
 * a Resend / SendGrid / SMTP relay API call.
 */

import type { NotificationGateway } from "../../domain/ports/output";
import type { PlatformCommandResult } from "../../domain/ports/input";

export class SmtpNotificationGateway implements NotificationGateway {
async dispatch(request: Record<string, unknown>): Promise<PlatformCommandResult> {
if (process.env.NODE_ENV !== "test") {
console.info("[SmtpNotificationGateway] dispatch", request);
}
return { ok: true, code: "NOTIFICATION_DISPATCHED" };
}
}
