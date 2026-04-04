---
description: '限界上下文邊界與模組依賴方向規範，遵循 Vaughn Vernon IDDD 戰略設計原則。'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# 限界上下文規則 (Bounded Context Rules)

## 核心原則

每個 `modules/<context>/` 是一個**獨立的限界上下文**，擁有自己的通用語言與領域模型。同一術語在不同限界上下文中可能有不同含義，須以各自的模型為準。

## 邊界規則

1. **跨模組存取**只能透過目標模組的 `api/` 公開合約進行。嚴禁直接匯入其他模組的 `domain/`、`application/`、`infrastructure/` 或 `interfaces/` 內部程式碼。
2. **限界上下文間的通訊**只能透過以下方式：
   - 發布與訂閱**領域事件** (Domain Events)
   - 呼叫目標模組的 `api/` 公開 Facade 或合約
3. **基礎設施直接呼叫**（如 Firebase Admin、Upstash）必須封裝在各自模組的 `infrastructure/` 層，不得跨模組共用。

## 依賴方向

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/` 必須保持框架無關（不能匯入 Firebase SDK、React、HTTP 客戶端等）。
- `infrastructure/` 實作 `domain/` 定義的 Repository 介面，只向下依賴。
- `application/` 協調 Use Cases，只依賴 `domain/` 的抽象。
- `interfaces/` 處理 UI、路由處理器、API 傳輸與 Server Action 接線。

## 上下文地圖 (Context Map)

本專案的限界上下文依功能職責劃分：

| 限界上下文 | 模組路徑 | 核心職責 |
|------------|---------|---------|
| 帳戶管理 | `modules/account` | 帳戶政策、RBAC、訂閱方案 |
| AI 代理人 | `modules/agent` | Genkit 流程、AI 回應生成 |
| 資產管理 | `modules/asset` | 文件資產、函式庫管理 |
| 內容管理 | `modules/content` | Wiki 頁面、文件內容 |
| 識別驗證 | `modules/identity` | 身分認證、Token 刷新 |
| 知識庫 | `modules/knowledge` | 知識整合 |
| 知識圖譜 | `modules/knowledge-graph` | 圖形資料結構 |
| 通知 | `modules/notification` | 系統通知發送 |
| 組織管理 | `modules/organization` | 多租戶組織架構 |
| 知識檢索 | `modules/retrieval` | RAG 查詢與向量搜尋 |
| 共用模組 | `modules/shared` | 跨模組共用基礎設施 |
| 工作空間 | `modules/workspace` | 工作空間核心功能 |
| 稽核記錄 | `modules/workspace-audit` | 操作稽核日誌 |
| 動態消息 | `modules/workspace-feed` | 工作空間動態 |
| 工作流程 | `modules/workspace-flow` | 任務、問題、發票流程 |
| 排程管理 | `modules/workspace-scheduling` | 行程與排程 |

## 防腐層 (Anti-Corruption Layer)

- 整合外部系統（Firebase、Genkit、Upstash）時，必須在 `infrastructure/` 層建立適配器。
- 防止外部概念與命名污染領域模型的類別與介面。
- 在適配器中負責翻譯外部模型與領域模型之間的概念差異。

## 禁止模式

- ❌ `import { X } from '@/modules/other-context/domain/...'`
- ❌ `import { X } from '@/modules/other-context/application/...'`
- ❌ `import { X } from '@/modules/other-context/infrastructure/...'`
- ✅ `import { X } from '@/modules/other-context/api'`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill slavingia-skills-mvp
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
