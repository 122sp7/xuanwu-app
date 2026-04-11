/**
 * RequestNotificationDispatchCommand
 *
 * Command: RequestNotificationDispatch
 * Purpose: Creates a notification dispatch request.
 *
 * Typical payload fields:
 *   contextId, channel, recipientRef, templateKey
 *
 * Handled by:  RequestNotificationDispatchService
 * Output ports: NotificationGateway, PolicyCatalogRepository, AuditSignalStore
 *
 * Result: PlatformCommandResult (ok, code, message, metadata)
 *
 * @see docs/application-services.md — Command-oriented Services
 */

// TODO: implement RequestNotificationDispatchCommand command payload type
