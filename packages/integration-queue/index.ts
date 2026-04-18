/**
 * @module integration-queue
 * Queue integration contracts and in-memory fallback primitive.
 */

export interface QueueMessage {
  topic: string;
  payload: Record<string, unknown>;
  delaySeconds?: number;
}

export interface QueuePublisher {
  publish(message: QueueMessage): Promise<{ messageId: string }>;
}

export class QueuePublishError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QueuePublishError";
  }
}

export const createInMemoryQueuePublisher = (): QueuePublisher => ({
  publish: async ({ topic }) => ({
    messageId: `${topic}-${Date.now().toString(36)}`,
  }),
});
