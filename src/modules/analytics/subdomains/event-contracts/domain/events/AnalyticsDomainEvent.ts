export type AnalyticsDomainEventType =
  | {
      type: "analytics.event.tracked";
      eventId: string;
      occurredAt: string;
      payload: { analyticsEventId: string; name: string; source: string };
    }
  | {
      type: "analytics.event.ingestion_failed";
      eventId: string;
      occurredAt: string;
      payload: { name: string; reason: string };
    };
