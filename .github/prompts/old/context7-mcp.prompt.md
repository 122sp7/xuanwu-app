---
name: context7-mcp
description: 使用 Context7 MCP 前先核對官方手冊，並以可用工具執行查詢、記憶維護與回報
agent: Commander
argument-hint: 例如 query=Next.js caching, goals=docs,examples,memory-refresh
---

# Context7 MCP

## Mission
執行 Context7 任務前，先檢查對應官方手冊，再用可用 MCP 工具完成查詢與維護。 

## Inputs
- query: ${input:query:請輸入主題或問題}
- goals: ${input:goals:docs,examples,memory-refresh}
- officialDocUrl: ${input:officialDocUrl:請輸入 Context7 官方手冊網址}

## Rules
- 必須先讀官方手冊（`officialDocUrl`）再執行 MCP 操作。
- 只能呼叫目前可用的 Context7 工具；不可虛構指令。
- 若工具不可用，回報限制與替代方案。

## Workflow
1. 讀取官方手冊：確認工具名稱、參數、限制。
2. 列出可用工具：比對 `goals` 與工具能力。
3. 執行查詢或記憶任務：逐步輸出結果。
4. 若需清理/重建：先評估是否有對應工具，否則走替代流程。
5. 產出結論：包含工具使用明細與限制說明。

## Output Format
### Context7 執行結果
- query: <value>
- goals: <resolved goals>
- status: <success | partial | blocked>

### 官方手冊核對
- source: <url>
- checked_items:
	- <item>
	- <item>

### 已執行工具
- <tool>
- <tool>

### 結果摘要
- <key result>

### 限制與替代
- limitation: <reason>
- fallback: <action>
