# AI Context

## Purpose

ai 是共享 AI capability 主域。它負責 generation、orchestration、distillation、retrieval、memory、safety 與 provider routing，供 notion、notebooklm 等主域穩定消費。

## Context Summary

| Aspect | Summary |
|---|---|
| Primary Role | 共享 AI capability orchestration |
| Upstream Dependency | iam access policy、billing entitlement |
| Downstream Consumers | notion、notebooklm |
| Core Principle | 提供 AI 能力，不接管內容正典或推理輸出語義 |

## Baseline Subdomains

- generation — 文字生成，Genkit 接縫
- orchestration — 執行圖與工作流協調
- distillation — 將長輸出濃縮為精煉知識片段
- retrieval — 向量搜尋與上下文抓取
- memory — 對話歷史與狀態保存
- context — prompt 上下文組裝
- safety — 安全護欄與內容保護
- tool-calling — 外部工具調用協調
- reasoning — 推理步驟管理
- conversation — AI 互動輪次管理
- evaluation — 輸出品質評估
- tracing — AI 執行觀測與追蹤

## Key Relationships

- 與 iam：消費 actor reference 與 access decision。
- 與 billing：消費 entitlement signal 決定 AI 配額。
- 與 notion：向 notion 提供 generate、summarize、distill 能力。
- 與 notebooklm：向 notebooklm 提供 generation、retrieval、distillation 能力。

## Strategic Rules

- Context 應先做 token budgeting、ranking 與壓縮，再把結果交給 generation 或 distillation。
- Distillation 應被視為 knowledge compiler，而不是單純摘要工具。
- Retrieval、memory、evaluation 都應明確接收並檢查 distillation 的輸出，而不是各自重新定義相同語義。
- 大型蒸餾或多來源蒸餾應優先走 async pipeline，避免同步入口承擔過高成本與延遲。

## Reading Order

1. [subdomains.md](./subdomains.md)
2. [bounded-contexts.md](./bounded-contexts.md)
3. [context-map.md](./context-map.md)
4. [ubiquitous-language.md](./ubiquitous-language.md)
5. [AGENT.md](./AGENT.md)

## Dependency Direction

- 本主域內部固定採用 interfaces -> application -> domain <- infrastructure。
- Genkit、LLM SDK 等 provider 細節只能停留在 infrastructure 層。
- 下游消費者只透過 `src/modules/ai/index.ts` 的公開匯出存取，不可直接依賴 ai 內部實作路徑。

## Anti-Pattern Rules

- 不把 notion 的 KnowledgeArtifact 或 notebooklm 的 Conversation 語義拉進 ai domain。
- 不在 ai 內重建 identity 或 billing 邏輯。
- 不讓下游模組直接呼叫 ai 的 infrastructure 或 subdomain internals。

## Document Network

- [AGENT.md](./AGENT.md)
- [bounded-contexts.md](./bounded-contexts.md)
- [context-map.md](./context-map.md)
- [subdomains.md](./subdomains.md)
- [ubiquitous-language.md](./ubiquitous-language.md)
- [../../architecture-overview.md](../../architecture-overview.md)
- [../../integration-guidelines.md](../../integration-guidelines.md)
