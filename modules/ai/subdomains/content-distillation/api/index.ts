/**
 * Public API boundary for the AI distillation subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * This barrel is client-safe — it exports only types and interfaces.
 * Server-only functions live in ./server.ts.
 */

import type { DistillContentInput, DistillationResult } from "../domain/ports/DistillationPort";

export type {
  DistillContentInput,
  DistillationItem,
  DistillationPort,
  DistillationResult,
  DistillationSource,
} from "../domain/ports/DistillationPort";

export interface DistillationAPI {
  distillContent(input: DistillContentInput): Promise<DistillationResult>;
}
