import { buildPurchaseOrderDraft } from "./file-processing-draft.purchase-order";
import {
  buildPlainTextDocument,
  buildTiptapDocument,
  type DraftDocumentInput,
  type DraftDocumentRepresentation,
  type DraftSection,
  normalizeWhitespace,
  trimFileExtension,
} from "./file-processing-draft.shared";

function buildGenericDraft(input: DraftDocumentInput): DraftDocumentRepresentation {
  const normalized = normalizeWhitespace(input.parsedText);
  const excerpt = normalized.length > 1200 ? `${normalized.slice(0, 1200)}…` : normalized;
  const titleBase = trimFileExtension(input.filename);
  const sections: DraftSection[] = [
    {
      heading: "系統追蹤",
      bullets: [
        `來源文件：${input.filename}`,
        `原始檔案：${input.sourceGcsUri}`,
        `解析 JSON：${input.jsonGcsUri}`,
        `頁數：${input.pageCount}`,
      ],
    },
    {
      heading: "原文節錄",
      paragraphs: [excerpt || "這份文件已完成解析，後續可再補充分頁、摘要與結構化內容。"],
    },
  ];

  return {
    title: `${titleBase}｜匯入草稿`,
    plainText: buildPlainTextDocument(`匯入草稿 ${titleBase}`, sections),
    tiptapDocument: buildTiptapDocument(`匯入草稿 ${titleBase}`, sections),
    templateKind: "generic",
  };
}

export function buildDraftDocumentRepresentation(input: DraftDocumentInput): DraftDocumentRepresentation {
  const normalized = normalizeWhitespace(input.parsedText);

  if (normalized.includes("訂購單") && normalized.includes("供應商/賣方") && normalized.includes("訂購公司/買方")) {
    return buildPurchaseOrderDraft(input);
  }

  return buildGenericDraft(input);
}

export type { DraftDocumentRepresentation } from "./file-processing-draft.shared";