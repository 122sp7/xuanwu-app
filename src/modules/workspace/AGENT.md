# Workspace Module — Agent Guide

## Purpose

`src/modules/workspace` 是 **Workspace 協作容器能力蒸餾骨架**，為 Xuanwu 系統提供任務（Task）、議題（Issue）、生命週期（Lifecycle）、編排（Orchestration）、成員資格（Membership）等工作區協作能力的新實作落點。

**蒸餾來源：** `modules/workspace/`  
**蒸餾狀態：** 🔨 進行中（task、issue、lifecycle 等子域蒸餾中）

> **注意：** `workspace-workflow` 子域已移除（2026-04-15）。其能力已分散至 task、issue、settlement、approve、quality、orchestration、task-formation 七個子域。

## 蒸餾子域清單

| 子域 | 說明 | 蒸餾狀態 |
|---|---|---|
| `approve` | 審批流程 | 📋 待蒸餾 |
| `audit` | 稽核紀錄 | 📋 待蒸餾 |
| `feed` | 活動動態 | 📋 待蒸餾 |
| `issue` | 議題管理 | 🔨 進行中 |
| `lifecycle` | 工作區生命週期 | 🔨 進行中 |
| `membership` | 成員資格（Membership）| 🔨 進行中 |
| `orchestration` | 跨子域流程編排（原 workspace-workflow）| 🔨 進行中 |
| `quality` | 品質管控 | 📋 待蒸餾 |
| `scheduling` | 排程 | 📋 待蒸餾 |
| `settlement` | 結算 / 交割 | 📋 待蒸餾 |
| `sharing` | 分享 / 對外發布 | 📋 待蒸餾 |
| `task` | 任務管理 | 🔨 進行中 |
| `task-formation` | AI 輔助任務生成 | 📋 待蒸餾 |

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK 或任何框架。
- `Membership`（工作區參與）≠ `Actor`（身份）：前者屬於 workspace，後者屬於 iam。
- `orchestration/` 是跨子域流程協調層，不包含業務規則。
- workspace 不直接呼叫 Firestore；透過 `modules/platform/api/`（FileAPI、PermissionAPI）。

## Route Here When

- 撰寫 workspace 的新 use case、entity、adapter 實作。
- 實作 task / issue / lifecycle 等子域骨架。

## Route Elsewhere When

- 讀取邊界規則 → `modules/workspace/AGENT.md`、`modules/workspace/api/`
- 跨模組 API boundary → `modules/workspace/api/index.ts`
- AI 任務提取 → `modules/ai/api/`（tool-runtime）
- 成員身份驗證 → `modules/iam/api/`

## 衝突防護（src/modules vs modules/）

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `modules/workspace/AGENT.md`、`modules/workspace/api/` |
| 撰寫新 use case / adapter / entity | `src/modules/workspace/`（本層）|
| 跨模組 API boundary | `modules/workspace/api/index.ts` |

**⚠ 蒸餾作業進行中 — 嚴禁事項：**
- ❌ 新建或恢復 `workspace-workflow` 子域（已拆解）
- ❌ 把 `modules/workspace/infrastructure/` 直接搬到 `src/modules/workspace/domain/`
- ❌ 在 workspace 直接呼叫 Firestore（透過 platform/api）
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/workspace/](../../../modules/workspace/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
