<!-- Purpose: Subdomain scaffold overview for platform 'notification'. -->

# Notification

## Overview

The **notification** subdomain manages notification routing, delivery, and preferences across Xuanwu. It handles multi-channel distribution (email, in-app, push), user preference management, and notification lifecycle.

## Core Responsibilities

- **Notification routing**: Determine delivery channels and recipients based on event triggers
- **Preference management**: User-configured notification settings and opt-in/opt-out rules
- **Template management**: Notification message templates with variable substitution
- **Delivery tracking**: Status and delivery history for audit and retry logic
- **Channel adapters**: Integration with email, push, and in-app notification providers

## Bounded Context

- **Module**: `modules/platform/subdomains/notification`
- **Aggregate roots**: `Notification`, `NotificationPreference`, `NotificationTemplate`
- **Published events**: `NotificationQueued`, `NotificationDelivered`, `NotificationFailed`, `PreferenceUpdated`
- **External contracts**: Publishes via `modules/platform/api`

## Key Entities & Value Objects

- `Notification` — Core notification aggregate with content, recipient, channels, and status
- `NotificationPreference` — User preference aggregate (channel opt-in, frequency, quiet hours)
- `NotificationTemplate` — Reusable message template with placeholders
- `NotificationChannel` — Value object representing delivery method (email, push, in-app)
- `NotificationStatus` — Value object for delivery state (pending, delivered, failed, bounced)

## Repositories

- `INotificationRepository` — Store and retrieve notifications
- `INotificationPreferenceRepository` — Manage user notification preferences
- `INotificationTemplateRepository` — Access and version templates

## Use Cases

- `queue-notification.use-case.ts` — Queue a notification for delivery
- `update-preference.use-case.ts` — Update user notification preferences
- `deliver-notification.use-case.ts` — Attempt delivery to configured channels
- `handle-delivery-failure.use-case.ts` — Retry or record failed delivery
- `list-notification-history.use-case.ts` — Retrieve user notification history

## Infrastructure

- **Firebase**: Firestore collections for notifications, preferences, templates
- **Email adapter**: Integration with email provider (SendGrid, Firebase Email)
- **Push adapter**: Integration with Firebase Cloud Messaging (FCM)
- **In-app adapter**: Direct storage for UI consumption

## Cross-Module Dependencies

- **Upstream**: Consumes domain events from `workspace`, `notion`, `notebooklm`
- **Downstream**: None
- **Peers**: May query `identity` for user/tenant context via `modules/platform/api`

## Anti-Patterns & Guardrails

- Do not hardcode notification content; use templates with variable substitution
- Do not bypass preferences; always check opt-in/opt-out before queueing
- Do not couple delivery logic to specific providers; use adapter pattern
- Do not store sensitive data (passwords, tokens) in notification payloads
