/**
 * @module integration-queue
 * 訊息佇列整合層：QStash HTTP publisher 合約與工具函式。
 *
 * Context7 基線：/websites/upstash_qstash
 * - 支援 retry、delay、callback/failureCallback。
 * - 發布訊息必須通過 Authorization: Bearer <token>。
 * - 不依賴 @upstash/qstash npm package（使用 HTTP API）。
 */

// ─── Config ───────────────────────────────────────────────────────────────────

export interface QStashConfig {
  /** QStash REST URL — 預設 https://qstash.upstash.io/v2 */
  baseUrl?: string;
  /** Bearer token from QSTASH_TOKEN env var */
  token: string;
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface QueuePublishOptions {
  /**
   * The destination URL to deliver the message to.
   * E.g. `https://yourapp.com/api/worker/embedding`
   */
  destination: string;

  /** JSON-serialisable message body */
  body?: unknown;

  /** Additional HTTP headers forwarded to the destination */
  headers?: Record<string, string>;

  /** Delay before delivery (seconds or Upstash duration string, e.g. "30s") */
  delay?: number | string;

  /** Max delivery retries (default: 3) */
  retries?: number;

  /** URL called on successful delivery */
  callback?: string;

  /** URL called when all retries are exhausted */
  failureCallback?: string;
}

export interface QueuePublishResult {
  messageId: string;
}

// ─── Client interface ─────────────────────────────────────────────────────────

export interface QueueClient {
  publish(options: QueuePublishOptions): Promise<QueuePublishResult>;
}

// ─── HTTP implementation ──────────────────────────────────────────────────────

/**
 * Creates a QStash HTTP publisher that sends messages via the QStash REST API.
 *
 * @example
 * ```ts
 * const queue = createQStashClient({ token: process.env.QSTASH_TOKEN! });
 * await queue.publish({
 *   destination: 'https://app.example.com/api/worker/embed',
 *   body: { documentId: 'doc-123' },
 *   retries: 3,
 *   delay: '5s',
 * });
 * ```
 */
export const createQStashClient = (config: QStashConfig): QueueClient => {
  const baseUrl = config.baseUrl ?? "https://qstash.upstash.io/v2";

  return {
    async publish(options) {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      };

      if (options.retries !== undefined) {
        headers["Upstash-Retries"] = String(options.retries);
      }

      if (options.delay !== undefined) {
        headers["Upstash-Delay"] = String(options.delay);
      }

      if (options.callback) {
        headers["Upstash-Callback"] = options.callback;
      }

      if (options.failureCallback) {
        headers["Upstash-Failure-Callback"] = options.failureCallback;
      }

      const url = `${baseUrl}/publish/${encodeURIComponent(options.destination)}`;

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new IntegrationQueueError(
          `QStash publish failed (${response.status}): ${text}`,
          response.status,
        );
      }

      const json = (await response.json()) as { messageId: string };
      return { messageId: json.messageId };
    },
  };
};

// ─── Legacy QueuePublisher interface ─────────────────────────────────────────
// Kept for backward compatibility with callers using QueueMessage shape.

export interface QueueMessage {
  topic: string;
  payload: Record<string, unknown>;
  delaySeconds?: number;
}

export interface QueuePublisher {
  publish(message: QueueMessage): Promise<{ messageId: string }>;
}

// ─── Error ────────────────────────────────────────────────────────────────────

export class IntegrationQueueError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "IntegrationQueueError";
  }
}

/** @deprecated Use IntegrationQueueError */
export class QueuePublishError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QueuePublishError";
  }
}

// ─── No-op stub ───────────────────────────────────────────────────────────────

/** Development / test stub — logs instead of sending real requests. */
export const createNoOpQueueClient = (): QueueClient => ({
  publish: async (options) => {
    console.debug("[integration-queue] no-op publish", options.destination, options.body);
    return { messageId: `noop-${Date.now()}` };
  },
});

/** @deprecated Use createNoOpQueueClient */
export const createInMemoryQueuePublisher = (): QueuePublisher => ({
  publish: async ({ topic }) => ({
    messageId: `${topic}-${Date.now().toString(36)}`,
  }),
});
