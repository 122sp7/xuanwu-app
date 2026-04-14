import "server-only";

import { SharedAiKnowledgeSummaryAdapter } from "../../../infrastructure/knowledge/ai";

export function makeKnowledgeSummaryPort() {
  return new SharedAiKnowledgeSummaryAdapter();
}
