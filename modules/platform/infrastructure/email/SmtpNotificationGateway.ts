/**
 * SmtpNotificationGateway — Email Adapter (Driven Adapter)
 *
 * Implements: NotificationGateway (for email channel)
 *
 * Delivers email notifications via a transactional email provider
 * (e.g., Resend, SendGrid, SMTP relay).
 *
 * Responsibilities:
 *   - Accept a normalised NotificationDispatch request
 *   - Resolve template by templateKey
 *   - Render template with recipient data
 *   - Deliver via configured email provider
 *   - Return PlatformCommandResult (ok / failure)
 *
 * Rules:
 *   - Must not expose provider SDK types outside this file
 *   - Template resolution uses the platform content subdomain, not hardcoded strings
 *   - Channel-specific logic (HTML vs plain-text) is encapsulated here
 *
 * @see ports/output/index.ts — NotificationGateway interface
 * @see subdomains/notification/ — notification subdomain
 */

// TODO: implement SmtpNotificationGateway
