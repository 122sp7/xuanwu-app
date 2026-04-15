# Platform Module — Agent Guide

## Purpose

`src/modules/platform` 是 **Platform 橫切治理能力蒸餾骨架**，為 Xuanwu 系統提供通知（Notification）、背景工作（Background Job）、平台設定（Platform Config）、搜尋（Search）等橫切服務能力的新實作落點。

**蒸餾來源：** `modules/platform/`（account / organization 子域已遷入 `modules/iam/`）  
**蒸餾狀態：** 🔨 進行中（account / org 已移至 iam；notification、background-job 等待蒸餾）

> **注意：** `platform/subdomains/account` 與 `platform/subdomains/organization` 已**完全遷入** `modules/iam/`。在 `src/modules/platform/` 中**不得**重建這些子域。

## 蒸餾子域清單

| 子域 | 說明 | 蒸餾狀態 |
|---|---|---|
| `background-job` | 背景工作排程（BackgroundJob / JobDocument / JobChunk）| 📋 待蒸餾 |
| `notification` | 通知發送 | 📋 待蒸餾 |
| `platform-config` | 平台設定 | 📋 待蒸餾 |
| `search` | 跨域搜尋 | 📋 待蒸餾 |

**已遷移子域（不在 platform）：**
- `account` → `modules/iam/subdomains/account/`
- `organization` → `modules/iam/subdomains/organization/`

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK 或任何框架。
- Platform 是上游治理層（platform → workspace → notion → notebooklm），不可依賴下游模組。
- `background-job` 使用泛化命名（BackgroundJob / JobDocument / JobChunk），不使用已棄用的 Ingestion* 命名。

## Route Here When

- 撰寫 platform 橫切服務的新 use case、entity、adapter 實作。
- 實作 notification、background-job 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `modules/platform/AGENT.md`、`modules/platform/api/`
- Account / Organization → `modules/iam/` 與 `src/modules/iam/`（已遷入）
- 跨模組 API boundary → `modules/platform/api/index.ts`

## 衝突防護（src/modules vs modules/）

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `modules/platform/AGENT.md`、`modules/platform/api/` |
| 撰寫新 use case / adapter / entity | `src/modules/platform/`（本層）|
| 跨模組 API boundary | `modules/platform/api/index.ts` |

**⚠ 蒸餾作業進行中 — 嚴禁事項：**
- ❌ 在 `src/modules/platform/` 重建 account / org 子域（已遷入 iam）
- ❌ 把 `modules/platform/infrastructure/` 直接搬到 `src/modules/platform/domain/`
- ❌ 使用 `Ingestion*` 命名（已語意化為 BackgroundJob / JobDocument / JobChunk）
- ❌ platform 依賴 workspace / notion / notebooklm（違反上游方向）

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/platform/](../../../modules/platform/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
