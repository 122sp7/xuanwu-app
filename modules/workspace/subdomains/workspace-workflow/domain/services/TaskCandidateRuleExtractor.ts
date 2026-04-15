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
const TASK_PREFIX_PATTERN = /^\s*(?:[-*•]|\d+[.)、])?\s*task\s*[:：]\s+(.+)$/i;
const BULLET_PATTERN = /^\s*(?:[-*•]|\d+[.)、])\s+(.+)$/;
const POLITE_PREFIX_PATTERN = /^(?:請(?:先|於)?|需(?:要)?|應(?:該)?|須)\s*(.+)$/i;
const ACTION_START_PATTERN = /^(?:安排|確認|提交|完成|更新|修正|整理|建立|回覆|追蹤|聯絡|提供|檢查|審核|準備|匯出|送出|簽署|付款|補件|通知|協調|規劃|處理)/i;
const NON_TASK_PREFIX_PATTERN = /^(?:注意事項?|備註|說明|合計|總計|金額|地址|電話|傳真|頁次|page\b|invoice\b)/i;
const DATE_PATTERN = /(\d{4}[\/-]\d{1,2}[\/-]\d{1,2})/;

function normalizeTitle(value: string): string {
  return value
    .trim()
    .replace(/^[：:：\-•*\d.)、\s]+/, "")
    .replace(/[，。；;:：\-\s]+$/, "")
    .replace(/\s+/g, " ");
}

function resolveCandidateText(line: string): string | undefined {
  const checkboxMatch = line.match(CHECKBOX_PATTERN);
  if (checkboxMatch?.[1]) {
    return checkboxMatch[1];
  }

  const taskPrefixMatch = line.match(TASK_PREFIX_PATTERN);
  if (taskPrefixMatch?.[1]) {
    return taskPrefixMatch[1];
  }

  const bulletMatch = line.match(BULLET_PATTERN)?.[1] ?? line;
  if (NON_TASK_PREFIX_PATTERN.test(bulletMatch) || bulletMatch.length < 4 || bulletMatch.length > 120) {
    return undefined;
  }

  const politePrefixMatch = bulletMatch.match(POLITE_PREFIX_PATTERN);
  if (politePrefixMatch?.[1]) {
    return politePrefixMatch[1];
  }

  if (ACTION_START_PATTERN.test(bulletMatch)) {
    return bulletMatch;
  }

  if (DATE_PATTERN.test(bulletMatch) && /[\u4e00-\u9fffA-Za-z]/.test(bulletMatch)) {
    return bulletMatch;
  }

  return undefined;
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
        const matchedContent = resolveCandidateText(line);
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
