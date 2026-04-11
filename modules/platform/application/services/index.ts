/**
 * platform application services barrel.
 *
 * Application Services handle flow coordination, transaction boundaries and
 * cross-aggregate orchestration.  They do not carry core business invariants.
 */

export { buildCausationId } from "./build-causation-id";
export { buildCorrelationId } from "./build-correlation-id";
export {
  quickCreateKnowledgePage,
  type QuickCreatePageInput,
  type QuickCreatePageResult,
} from "./shell-quick-create";
