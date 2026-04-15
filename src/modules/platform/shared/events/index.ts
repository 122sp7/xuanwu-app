export interface PlatformDomainEvent<TType extends string, TPayload extends object> {
  readonly type: TType;
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: TPayload;
}

export type PlatformPublishedEvent =
  | PlatformDomainEvent<"platform.background-job.job_registered", {
      readonly jobId: string;
      readonly documentId: string;
      readonly organizationId: string;
      readonly workspaceId: string;
      readonly title: string;
      readonly mimeType: string;
    }>
  | PlatformDomainEvent<"platform.background-job.job_advanced", {
      readonly jobId: string;
      readonly documentId: string;
      readonly previousStatus: string;
      readonly nextStatus: string;
    }>
  | PlatformDomainEvent<"platform.notification.dispatched", {
      readonly notificationId: string;
      readonly recipientId: string;
      readonly notificationType: string;
    }>;
