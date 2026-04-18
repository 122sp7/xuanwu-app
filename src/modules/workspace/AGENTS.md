# Workspace Module — Agent Guide

## Purpose

`src/modules/workspace` 是 **Workspace 協作容器能力模組**，為 Xuanwu 系統提供任務（Task）、議題（Issue）、生命週期（Lifecycle）、編排（Orchestration）、成員資格（Membership）等工作區協作能力的實作落點。

> **注意：** `workspace-workflow` 子域已移除（2026-04-15）。其能力已分散至 task、issue、settlement、approval、quality、orchestration、task-formation 七個子域。

## 子域清單（名詞域）

| 子域 | 說明 | 狀態 |
|---|---|---|
| `activity` | 活動記錄實體（使用者操作歷程）| 🔨 骨架建立，實作進行中 |
| `api-key` | API 金鑰管理實體 | 🔨 骨架建立，實作進行中 |
| `approval` | 審批實體（審批流程與決策）| 🔨 骨架建立，實作進行中 |
| `audit` | 日誌紀錄實體 | 🔨 骨架建立，實作進行中 |
| `feed` | 活動動態實體 | 🔨 骨架建立，實作進行中 |
| `invitation` | 邀請實體（工作區邀請管理）| 🔨 骨架建立，實作進行中 |
| `issue` | 議題實體（議題管理）| 🔨 骨架建立，實作進行中 |
| `lifecycle` | 生命週期實體（工作區生命週期）| 🔨 骨架建立，實作進行中 |
| `membership` | 成員資格實體（Membership）| 🔨 骨架建立，實作進行中 |
| `orchestration` | 跨子域編排（原 workspace-workflow）| 🔨 骨架建立，實作進行中 |
| `quality` | 品質管控實體 | 🔨 骨架建立，實作進行中 |
| `resource` | 資源實體（工作區資源配額與管理）| 🔨 骨架建立，實作進行中 |
| `schedule` | 排程實體 | 🔨 骨架建立，實作進行中 |
| `settlement` | 結算實體 | 🔨 骨架建立，實作進行中 |
| `share` | 分享實體（對外發布）| 🔨 骨架建立，實作進行中 |
| `task` | 任務實體（任務管理）| 🔨 骨架建立，實作進行中 |
| `task-formation` | 任務生成實體（AI 輔助任務生成）| 🔨 骨架建立，實作進行中 |

## task-formation 歸屬決策

`task-formation` 屬於 **`workspace`** 子域，理由：
- 輸出物（Task entities）是 workspace 的領域物件
- 業務流程（使用者確認候選任務）是 workspace 層關注點
- AI 生成能力由 `ai/generation` Port 注入（透過 `src/modules/ai/index.ts`），workspace 消費

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK 或任何框架。
- `Membership`（工作區參與）≠ `Actor`（身份）：前者屬於 workspace，後者屬於 iam。
- `orchestration/` 是跨子域流程協調層，不包含業務規則。
- workspace 不直接呼叫 Firestore；透過 `src/modules/platform/index.ts`（FileAPI、PermissionAPI）。

## Route Here When

- 撰寫 workspace 的新 use case、entity、adapter 實作。
- 實作 task / issue / lifecycle 等子域骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/workspace/AGENTS.md`
- 跨模組 API boundary → `src/modules/workspace/index.ts`
- AI 任務提取能力 → `src/modules/ai/index.ts`（generation）
- 成員身份驗證 → `src/modules/iam/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/workspace/AGENTS.md` |
| 撰寫新 use case / adapter / entity | `src/modules/workspace/`（本層）|
| 跨模組 API boundary | `src/modules/workspace/index.ts` |

**嚴禁事項：**
- ❌ 新建或恢復 `workspace-workflow` 子域（已拆解）
- ❌ 在 workspace 直接呼叫 Firestore（透過 src/modules/platform/index.ts）
- ❌ 使用 `approve` 作為子域名（已更正為名詞 `approval`）
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
