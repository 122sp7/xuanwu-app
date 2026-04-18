# Billing Module — Agent Guide

## Purpose

`src/modules/billing` 是 **Billing 能力模組**，為 Xuanwu 系統提供訂閱管理與授權配額（Entitlement）的實作落點。

## 子域清單

| 子域 | 說明 | 狀態 |
|---|---|---|
| `entitlement` | 授權配額信號（能力准入）| 🔨 骨架建立，實作進行中 |
| `subscription` | 訂閱計劃管理 | 🔨 骨架建立，實作進行中 |
| `usage-metering` | 用量計量（API 呼叫、Token 消耗等）| 🔨 骨架建立，實作進行中 |

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、HTTP client 或任何框架。
- Entitlement 信號是上游 Published Language；下游（workspace、notion 等）僅消費，不定義。
- `subscription` ≠ `entitlement`：billing plan（計費）vs capability signal（能力信號）。

## Route Here When

- 撰寫 Billing 的新 use case、entity、adapter 實作。
- 實作 entitlement check port、subscription repository 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/billing/AGENTS.md`
- 跨模組 API boundary → `src/modules/billing/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/billing/AGENTS.md` |
| 撰寫新 use case / adapter / entity | `src/modules/billing/`（本層）|
| 跨模組 API boundary | `src/modules/billing/index.ts` |

**嚴禁事項：**
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
