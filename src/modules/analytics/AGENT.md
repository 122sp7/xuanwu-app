# Analytics Module — Agent Guide

## Purpose

`src/modules/analytics` 是 **Analytics 能力蒸餾骨架**，為 Xuanwu 系統提供事件投影、指標計算、洞察報表等分析能力的新實作落點。

**蒸餾來源：** `modules/analytics/`  
**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

## 蒸餾子域清單

蒸餾來源 `modules/analytics/subdomains/` 包含以下子域：

| 子域 | 說明 | 蒸餾狀態 |
|---|---|---|
| `event-contracts` | 事件契約定義（Published Language）| 📋 待蒸餾 |
| `event-ingestion` | 事件接收 / 攝取 | 📋 待蒸餾 |
| `event-projection` | 事件投影（讀模型計算）| 📋 待蒸餾 |
| `insights` | 洞察報表 | 📋 待蒸餾 |
| `metrics` | 指標計算 | 📋 待蒸餾 |
| `realtime-insights` | 即時洞察 | 📋 待蒸餾 |

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、HTTP client 或任何框架。
- `application/` 只依賴 `domain/` 抽象，不依賴 adapter 實作。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`。

## Route Here When

- 撰寫 Analytics 的新 use case、entity、adapter 實作。
- 實作事件投影、指標計算 port 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `modules/analytics/AGENT.md`、`modules/analytics/api/`
- 跨模組 API boundary → `modules/analytics/api/index.ts`

## 衝突防護（src/modules vs modules/）

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `modules/analytics/AGENT.md`、`modules/analytics/api/` |
| 撰寫新 use case / adapter / entity | `src/modules/analytics/`（本層） |
| 跨模組 API boundary | `modules/analytics/api/index.ts` |

**⚠ 蒸餾作業進行中 — 嚴禁事項：**
- ❌ 把 `modules/analytics/infrastructure/` 的實作直接搬到 `src/modules/analytics/domain/`
- ❌ 把 `src/modules/analytics/` 當成 `modules/analytics/` 的別名
- ❌ 在 `domain/` 匯入 Firebase SDK、React
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 蒸餾狀態與目錄結構
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/analytics/](../../../modules/analytics/) — 完整 HEX+DDD 實作層（邊界規則權威）
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
