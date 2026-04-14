/**
 * @module workspace-flow/domain/services
 * @file TaskCandidateRuleExtractor.ts
 * @description Pure, stateless rule engine that extracts task candidates from
 *   plain-text knowledge blocks using pattern matching.
 *
 * Moved from application/services/ to domain/services/ because the extractor
 * contains only domain rules and has no application or infrastructure
 * dependencies.
 *
 * @see ADR-5201 Accidental Complexity — workspace-workflow application structure
 */

import type { ExtractedTaskCandidate, KnowledgeTextBlockInput } from "../value-objects/TaskCandidate";

const CHECKBOX_PATTERN = /^\s*[-*]\s*\[(?:\s|x|X)\]\s+(.+)$/;
const TASK_PREFIX_PATTERN = /^\s*(?:[-*]|\d+[.)])?\s*task\s*[:：]\s+(.+)$/i;
const DATE_PATTERN = /(\d{4}[\/-]\d{1,2}[\/-]\d{1,2})/;

function normalizeTitle(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeDueDate(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const normalized = raw.replace(/\//g, "-");
  const [year, month, day] = normalized.split("-");
  if (!year || !month || !day) return undefined;
  const mm = month.padStart(2, "0");
  const dd = day.padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export class TaskCandidateRuleExtractor {
  extract(blocks: ReadonlyArray<KnowledgeTextBlockInput>): ReadonlyArray<ExtractedTaskCandidate> {
    const candidates: ExtractedTaskCandidate[] = [];

    for (const block of blocks) {
      const lines = block.text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      for (const line of lines) {
        const checkboxMatch = line.match(CHECKBOX_PATTERN);
        const taskPrefixMatch = line.match(TASK_PREFIX_PATTERN);
        const matchedContent = checkboxMatch?.[1] ?? taskPrefixMatch?.[1];
        if (!matchedContent) continue;

        const dueDateMatch = matchedContent.match(DATE_PATTERN);
        const dueDate = normalizeDueDate(dueDateMatch?.[1]);
        const title = normalizeTitle(
          dueDateMatch ? matchedContent.replace(dueDateMatch[1], "").trim() : matchedContent,
        );
        if (!title) continue;

        candidates.push({
          title,
          dueDate,
          source: "rule",
          confidence: 0.92,
          sourceBlockId: block.blockId,
          sourceSnippet: line.slice(0, 180),
        });
      }
    }

    const dedup = new Map<string, ExtractedTaskCandidate>();
    for (const candidate of candidates) {
      const key = candidate.title.toLowerCase();
      if (!dedup.has(key)) {
        dedup.set(key, candidate);
      }
    }
    return [...dedup.values()];
  }
}
