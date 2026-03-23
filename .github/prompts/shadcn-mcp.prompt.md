---
name: shadcn-mcp
description: 使用 shadcn MCP 前先核對官方手冊，再執行元件搜尋、安裝與頁面組裝
agent: agent
tools:
	- shadcn/*
argument-hint: 例如 task=add-components components=button,card officialDocUrl=https://ui.shadcn.com/docs
---

# shadcn MCP

## Mission
先讀 shadcn 官方手冊與 MCP 指南，再進行元件查找、加入與用法輸出。

## Inputs
- task: ${input:task:search | add | build-page}
- components: ${input:components:button,card}
- officialDocUrl: ${input:officialDocUrl:https://ui.shadcn.com/docs}

## Rules
- 必須先核對官方手冊（`officialDocUrl`）與目前 registry 設定。
- 優先使用 MCP 提供的註冊表與元件工具，不要臆測不存在元件。
- 若無法安裝或找不到元件，要提供替代元件與理由。

## Workflow
1. 文件核對：讀取 shadcn 官方手冊與 MCP 使用文件。
2. 列出可用 registry / 元件：確認名稱與版本。
3. 依 `task` 執行：
	 - `search`: 搜尋元件與範例
	 - `add`: 產生或執行加入命令
	 - `build-page`: 組合頁面結構與依賴清單
4. 驗證結果：檢查是否成功加入與引用。
5. 輸出摘要：包含命令、檔案變更與備援方案。

## Output Format
### shadcn 執行結果
- task: <value>
- components: <resolved list>
- status: <success | partial | blocked>

### 官方手冊核對
- source: <url>
- checked_items:
	- <item>
	- <item>

### 已執行工具
- <tool>
- <tool>

### 產出
- add_command: <command or none>
- changed_files:
	- <file>
	- <file>

### 限制與替代
- limitation: <reason>
- fallback: <action>