# Platform Module — Agent Guide

## Purpose

`src/modules/platform` 是 **Platform 橫切治理能力模組**，為 Xuanwu 系統提供通知（Notification）、背景工作（Background Job）、平台設定（Platform Config）、搜尋（Search）等橫切服務能力的實作落點。

> **注意：** `platform/subdomains/account` 與 `platform/subdomains/organization` 已**完全遷入** `src/modules/iam/`。在 `src/modules/platform/` 中**不得**重建這些子域。

## 子域清單

| 子域 | 說明 | 狀態 |
|---|---|---|
| `background-job` | 背景工作排程（BackgroundJob / JobDocument / JobChunk）| ✅ 完成 |
| `cache` | 快取管理（鍵值快取、TTL 設定）| ✅ 完成 |
| `file-storage` | 檔案儲存服務（上傳、下載、生命週期）| ✅ 完成 |
| `notification` | 通知發送 | ✅ 完成 |
| `platform-config` | 平台設定 | ✅ 完成 |
| `search` | 跨域搜尋 | ✅ 完成 |

**已遷移子域（不在 platform）：**
- `account` → `src/modules/iam/subdomains/account/`
- `organization` → `src/modules/iam/subdomains/organization/`

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK 或任何框架。
- Platform 是上游治理層（platform → workspace → notion → notebooklm），不可依賴下游模組。
- `background-job` 使用泛化命名（BackgroundJob / JobDocument / JobChunk），不使用已棄用的 Ingestion* 命名。

## Route Here When

- 撰寫 platform 橫切服務的新 use case、entity、adapter 實作。
- 實作 notification、background-job 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/platform/AGENT.md`
- Account / Organization → `src/modules/iam/`（已遷入）
- 跨模組 API boundary → `src/modules/platform/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/platform/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/platform/`（本層）|
| 跨模組 API boundary | `src/modules/platform/index.ts` |

**嚴禁事項：**
- ❌ 在 `src/modules/platform/` 重建 account / org 子域（已遷入 iam）
- ❌ 使用 `Ingestion*` 命名（已語意化為 BackgroundJob / JobDocument / JobChunk）
- ❌ platform 依賴 workspace / notion / notebooklm（違反上游方向）

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
