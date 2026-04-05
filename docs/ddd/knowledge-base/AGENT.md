# knowledge-base — DDD Agent

## 戰略分類

| 屬性 | 值 |
|---|---|
| **Domain Type** | **Core Domain** — 產品差異化核心 |
| **Module** | `modules/knowledge-base/` |
| **Aggregates** | Article, Category |
| **Key Events** | article_created / published / verified, category_created |

## 為何是 Core Domain

組織知識庫（SOP / Wiki）直接承載知識平台的可信度與協作深度，與 `knowledge`（個人筆記）共同構成 Xuanwu 的差異化競爭壁壘。

## 關鍵設計決策

1. **Article ≠ Page** — 明確分離個人（knowledge）與組織（knowledge-base）知識邊界
2. **VerificationState** — 組織知識的準確性治理，設計為 BC 內建能力而非協作插件
3. **Backlink** — 由 `BacklinkExtractorService` 從 markdown 自動解析，保持 Article 圖譜一致性
4. **Category 深度限制 5 層** — 防止過深的知識組織結構降低導航效率

## 詳細實作文件

→ [`modules/knowledge-base/`](../../modules/knowledge-base/)
