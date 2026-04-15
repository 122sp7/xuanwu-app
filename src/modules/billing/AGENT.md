# Billing Module — Agent Guide

## Purpose

`src/modules/billing` 是 **Billing 能力蒸餾骨架**，為 Xuanwu 系統提供訂閱管理與授權配額（Entitlement）的新實作落點。

**蒸餾來源：** `modules/billing/`  
**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

## 蒸餾子域清單

| 子域 | 說明 | 蒸餾狀態 |
|---|---|---|
| `entitlement` | 授權配額信號（能力准入）| 📋 待蒸餾 |
| `subscription` | 訂閱計劃管理 | 📋 待蒸餾 |
| `usage-metering` | 用量計量（API 呼叫、Token 消耗等）| 📋 待蒸餾 |

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、HTTP client 或任何框架。
- Entitlement 信號是上游 Published Language；下游（workspace、notion 等）僅消費，不定義。
- `subscription` ≠ `entitlement`：billing plan（計費）vs capability signal（能力信號）。

## Route Here When

- 撰寫 Billing 的新 use case、entity、adapter 實作。
- 實作 entitlement check port、subscription repository 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `modules/billing/AGENT.md`、`modules/billing/api/`
- 跨模組 API boundary → `modules/billing/api/index.ts`

## 衝突防護（src/modules vs modules/）

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `modules/billing/AGENT.md`、`modules/billing/api/` |
| 撰寫新 use case / adapter / entity | `src/modules/billing/`（本層） |
| 跨模組 API boundary | `modules/billing/api/index.ts` |

**⚠ 蒸餾作業進行中 — 嚴禁事項：**
- ❌ 把 `modules/billing/infrastructure/` 的實作直接搬到 `src/modules/billing/domain/`
- ❌ 把 `src/modules/billing/` 當成 `modules/billing/` 的別名
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/billing/](../../../modules/billing/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
