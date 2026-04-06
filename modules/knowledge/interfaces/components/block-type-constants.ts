import type { BlockType } from "../../domain/value-objects/block-content";

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  "text": "T",
  "heading-1": "H1",
  "heading-2": "H2",
  "heading-3": "H3",
  "image": "🖼",
  "code": "<>",
  "bullet-list": "•",
  "numbered-list": "1.",
  "divider": "—",
  "quote": "❝",
  "callout": "💡",
  "toggle": "▶",
  "toc": "📋",
  "synced": "🔗",
};

export const BLOCK_TYPE_NAMES: Record<BlockType, string> = {
  "text": "文字",
  "heading-1": "標題 1",
  "heading-2": "標題 2",
  "heading-3": "標題 3",
  "image": "圖片",
  "code": "程式碼",
  "bullet-list": "項目清單",
  "numbered-list": "編號清單",
  "divider": "分隔線",
  "quote": "引言",
  "callout": "標注",
  "toggle": "折疊",
  "toc": "目錄",
  "synced": "同步區塊",
};
