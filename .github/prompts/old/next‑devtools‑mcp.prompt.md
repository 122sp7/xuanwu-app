---
name: next-devtools-mcp
description: 使用 Next DevTools MCP 前先核對官方手冊，再執行 Next.js 診斷、文件查詢與路由驗證
agent: App Router Agent
argument-hint: 例如 task=diagnose-runtime-errors route=/wiki-beta officialDocUrl=https://nextjs.org/docs
---

# Next DevTools MCP

## Mission
在 Next.js 任務中，先確認官方手冊與 MCP 工具可用性，再執行診斷、查詢與修復建議。

## Inputs
- task: ${input:task:diagnose-runtime-errors | docs-lookup | route-check}
- route: ${input:route:/}
- officialDocUrl: ${input:officialDocUrl:https://nextjs.org/docs}

## Rules
- 先閱讀 `officialDocUrl` 與 MCP 伺服器官方文件，再執行工具。
- 優先使用 Next.js MCP 工具；僅在必要時搭配 browser automation。
- 若要求超出可用工具，必須回報「不可直接執行」與替代方案。

## Workflow
1. 文件核對：讀取 Next.js 官方手冊與 DevTools MCP 說明。
2. 列出可用工具：確認 runtime/docs/route/error 類工具可呼叫。
3. 執行任務：依 `task` 收集診斷資料與關鍵證據。
4. 產出建議：分為立即修正、風險、後續檢查。
5. 驗證：必要時重跑同一路徑，確認錯誤是否消失。

## Output Format
### Next DevTools 結果
- task: <value>
- route: <value>
- status: <success | partial | blocked>

### 官方手冊核對
- source: <url>
- checked_topics:
  - <topic>
  - <topic>

### 已執行工具
- <tool>
- <tool>

### 發現問題
- <severity>: <finding>

### 建議修正
1. <change>
2. <change>

### 限制與替代
- limitation: <reason>
- fallback: <action>
