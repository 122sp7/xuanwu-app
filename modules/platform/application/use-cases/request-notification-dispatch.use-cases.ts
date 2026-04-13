/**
 * request-notification-dispatch — use case.
 *
 * Command:  RequestNotificationDispatch
 * Purpose:  Creates a notification dispatch request.
 */

import type { PlatformCommandResult, RequestNotificationDispatchInput } from "../dtos";
import type { NotificationGateway, PolicyCatalogViewRepository, AuditSignalStore, DomainEventPublisher } from "../../domain/ports/output";
import { NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE } from "../../domain/events";
import { buildCorrelationId } from "../services";

export class RequestNotificationDispatchUseCase {
	constructor(
		private readonly notificationGateway: NotificationGateway,
		private readonly catalogViewRepo: PolicyCatalogViewRepository,
		private readonly auditStore: AuditSignalStore,
		private readonly eventPublisher: DomainEventPublisher,
	) {}

	async execute(input: RequestNotificationDispatchInput): Promise<PlatformCommandResult> {
		try {
			await this.catalogViewRepo.getView(input.contextId);
			const dispatchResult = await this.notificationGateway.dispatch({
				contextId: input.contextId,
				channel: input.channel,
				recipientRef: input.recipientRef,
				templateKey: input.templateKey,
			});
			if (!dispatchResult.ok) {
				return dispatchResult;
			}
			const now = new Date().toISOString();
			await this.auditStore.write({
				signalType: "notification.dispatch-requested",
				severity: "info",
				contextId: input.contextId,
				recipientRef: input.recipientRef,
				occurredAt: now,
			});
			await this.eventPublisher.publish([
				{
					type: NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE,
					aggregateType: "Notification",
					aggregateId: input.recipientRef,
					contextId: input.contextId,
					occurredAt: now,
					version: 1,
					correlationId: buildCorrelationId(),
					payload: { channel: input.channel, recipientRef: input.recipientRef, templateKey: input.templateKey },
				},
			]);
			return {
				ok: true,
				code: "NOTIFICATION_DISPATCH_REQUESTED",
				metadata: { channel: input.channel, recipientRef: input.recipientRef },
			};
		} catch (err) {
			return {
				ok: false,
				code: "REQUEST_NOTIFICATION_DISPATCH_FAILED",
				message: err instanceof Error ? err.message : "Unexpected error",
			};
		}
	}
}
