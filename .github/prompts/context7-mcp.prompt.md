---
name: Context7 MCP Usage
description: 使用 Context7 MCP 的常用指令與提示，包含文件抓取與長期上下文管理
scope: global
---

# Context7 MCP Prompt

## 1️⃣ 啟用 Context7 MCP 記憶與資料抓取
`context7.use_mcp`  
啟用 Context7 MCP 服務，允許 AI 助手抓取最新文件、代碼範例與知識庫資料

## 2️⃣ 更新 Context7 記憶
`context7.update_memory`  
重新掃描工作區與 repository，將最新文件與知識庫同步至 MCP 記憶

## 3️⃣ 總結專案上下文
`context7.summarize_long_term_memory`  
整理整個開發階段的上下文、架構決策、資料夾結構與重要設計決策，生成長期記憶

## 4️⃣ 修剪舊索引與 embeddings
`context7.prune_index`  
清理過期向量與無用索引條目，保持索引庫清爽高效

## 5️⃣ 重建語義索引
`context7.rebuild_index`  
將 Context7 MCP 記憶與索引進行壓縮與重建，確保查詢效率與準確度

## 6️⃣ 完整維護流程（建議固定使用）
```
context7.use_mcp
context7.update_memory
context7.summarize_long_term_memory
context7.prune_index
context7.rebuild_index
```
依序執行可維護 Context7 MCP 專案記憶完整性與索引效能
