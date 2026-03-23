---
name: Next‑DevTools MCP Usage
description: 使用 Next‑DevTools MCP 提供的工具來與 Next.js 專案互動，包括診斷、文檔查詢、路由檢視等操作
scope: global
---

# Next‑DevTools MCP Server Usage

## 安裝與初始化 MCP 伺服器
在 MCP 客戶端設置中加入：
```
{
  "mcpServers": {
    "next‑devtools": {
      "command": "npx",
      "args": ["‑y", "next-devtools-mcp@latest"]
    }
  }
}
```
讓 AI 助手啟用 Next.js DevTools MCP 伺服器。 :contentReference[oaicite:1]{index=1}

## 初始化 Next‑DevTools MCP
use next-devtools-mcp init  
# 初始化 Next.js DevTools MCP session, 讓模型使用 MCP 工具

## 列出可用工具
use next‑devtools-mcp to list_tools  
# 列出 Next.js DevTools MCP 支援的所有工具（例如 nextjs_runtime, nextjs_docs, browser_eval 等） :contentReference[oaicite:2]{index=2}

## 查詢官方 Next.js 文檔
use next‑devtools-mcp nextjs_docs "搜尋 Next.js 官方文檔 關於 App Router 和 ISR"  
# 使用 nextjs_docs 工具查詢官方文件，取得最新建議與 API 使用方式 :contentReference[oaicite:3]{index=3}

## 取得運行時診斷資訊
use next‑devtools-mcp nextjs_runtime "get_errors"  
# 查詢目前正在運行的 Next.js 開發 server 的錯誤資訊、路由狀態等 :contentReference[oaicite:4]{index=4}

## 自動化升級到 Next.js 16+
use next‑devtools-mcp upgrade_nextjs_16  
# 使用升級工具提示與 codemod 引導升級到 Next.js 16（前提是原本版本 <16） :contentReference[oaicite:5]{index=5}

## 啟用 Cache Components
use next‑devtools-mcp enable_cache_components  
# 啟用並配置 Cache Components 模式下的設置與檢查 :contentReference[oaicite:6]{index=6}

## 使用 Browser Eval (Playwright)
use next‑devtools-mcp browser_eval "navigate to /about and screenshot"  
# 透過 browser_eval 工具使用 Playwright 進行瀏覽器操作，例如導航與截圖 :contentReference[oaicite:7]{index=7}

## 綜合范例（常用多工具結合）
use next‑devtools-mcp to list_tools  
use next‑devtools-mcp nextjs_docs "查詢 SSR best practices"
use next‑devtools-mcp nextjs_runtime "get_logs"
```
