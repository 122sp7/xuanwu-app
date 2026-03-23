---
name: playwright-mcp
description: 使用 Playwright MCP 前先核對官方手冊，執行可重現的頁面互動、截圖與錯誤診斷
agent: agent
tools:
	- playwright/*
argument-hint: 例如 url=http://localhost:3000 flow=login-and-submit officialDocUrl=https://playwright.dev
---

# Playwright MCP

## Mission
先核對 Playwright 官方手冊，再用 MCP 工具進行穩定且可重現的 UI 診斷流程。

## Inputs
- url: ${input:url:請輸入目標網址}
- flow: ${input:flow:請描述要重現的操作路徑}
- officialDocUrl: ${input:officialDocUrl:https://playwright.dev}

## Rules
- 先讀官方手冊，再開始瀏覽器自動化。
- 必須記錄每一步動作與對應觀察結果，避免只給結論。
- 優先輸出可重現步驟、證據（截圖/console/network）與修復建議。

## Workflow
1. 讀官方手冊：確認目前客戶端支援的 Playwright MCP 動作。
2. 啟動與導航：開啟瀏覽器並前往 `url`。
3. 依 `flow` 重現問題：逐步操作並記錄結果。
4. 收集證據：截圖、console、network、DOM/可及性資訊。
5. 彙整診斷：指出根因、影響範圍、修正優先順序。

## Output Format
### Playwright 診斷結果
- url: <value>
- flow: <value>
- status: <success | partial | blocked>

### 官方手冊核對
- source: <url>
- checked_items:
	- <item>
	- <item>

### 重現步驟
1. <step>
2. <step>

### 證據
- screenshot: <path or note>
- console: <summary>
- network: <summary>

### 建議修正
1. <fix>
2. <fix>

### 限制與替代
- limitation: <reason>
- fallback: <action>
