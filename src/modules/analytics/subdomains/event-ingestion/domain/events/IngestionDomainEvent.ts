export type IngestionDomainEventType =
  | {
      type: "analytics.ingestion.batch_created";
      eventId: string;
      occurredAt: string;
      payload: { batchId: string; eventCount: number };
    }
  | {
      type: "analytics.ingestion.batch_processed";
      eventId: string;
      occurredAt: string;
      payload: { batchId: string };
    }
  | {
      type: "analytics.ingestion.batch_failed";
      eventId: string;
      occurredAt: string;
      payload: { batchId: string; reason: string };
    };
