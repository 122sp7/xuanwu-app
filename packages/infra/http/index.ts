/**
 * @module infra/http
 * Small HTTP primitives shared by integration and adapter layers.
 */

export interface HttpRequestOptions {
  timeoutMs?: number;
  retryCount?: number;
  retryDelayMs?: number;
}

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

const wait = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const withTimeout = (timeoutMs: number): AbortController => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
};

export const request = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: HttpRequestOptions = {},
): Promise<Response> => {
  const {
    timeoutMs = 15000,
    retryCount = 0,
    retryDelayMs = 250,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retryCount; attempt += 1) {
    const timeoutController = withTimeout(timeoutMs);

    try {
      const response = await fetch(input, {
        ...init,
        signal: init.signal ?? timeoutController.signal,
      });

      if (!response.ok) {
        throw new HttpError(
          `Request failed with status ${response.status}`,
          response.status,
          response.statusText,
        );
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt < retryCount) {
        await wait(retryDelayMs);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("HTTP request failed");
};

export const requestJson = async <T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: HttpRequestOptions = {},
): Promise<T> => {
  const response = await request(input, init, options);
  return (await response.json()) as T;
};
