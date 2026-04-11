/**
 * request-notification-dispatch — use case.
 *
 * Command:  RequestNotificationDispatch
 * Purpose:  Creates a notification dispatch request.
 *
 * Payload fields:
 *   contextId, channel, recipientRef, templateKey
 *
 * Orchestration steps:
 *   1. Load PolicyCatalog via PolicyCatalogRepository
 *   2. Evaluate NotificationRoutingPolicy domain service
 *   3. Dispatch via NotificationGateway
 *   4. Record audit signal via AuditSignalStore
 *   5. Return PlatformCommandResult
 *
 * Output ports:
 *   NotificationGateway, PolicyCatalogRepository, AuditSignalStore
 *
 * Returns: PlatformCommandResult (ok, code, message, metadata)
 *
 * @see docs/application-services.md
 * @see ports/input/index.ts — PlatformCommandPort
 */

// TODO: implement RequestNotificationDispatchUseCase
