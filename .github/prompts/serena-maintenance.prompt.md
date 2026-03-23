---
name: Serena MCP Memory & Index Maintenance
description: 全套 Serena MCP 記憶與索引維護指令，包含階段上下文總結
scope: global
---

# Serena MCP Memory & Index Maintenance

## 1️⃣ 重新掃描專案並更新記憶
`serena.update_memory`  
重新掃描 repository、文件與專案，將最新資訊同步至 MCP 記憶

## 2️⃣ 總結整個階段上下文（非單次對話）
`serena.summarize_long_term_memory`  
將整個開發階段的專案上下文、架構決策、資料夾結構、Domain Model、Coding Conventions 等整理成長期記憶

## 3️⃣ 修剪舊索引與 embeddings
`serena.prune_index`  
清理過時向量、刪除無用索引條目，避免向量庫膨脹

## 4️⃣ 壓縮並重建語義索引
`serena.rebuild_index`  
將記憶與索引進行重建、壓縮，確保查詢效率

## 5️⃣ 完整維護流程（建議固定使用）
```
serena.update_memory
serena.summarize_long_term_memory
serena.prune_index
serena.rebuild_index
```  
依序執行可維護專案記憶完整性與索引效能
