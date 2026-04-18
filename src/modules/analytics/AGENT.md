# Analytics Module — Agent Guide

## Purpose

`src/modules/analytics` 是 **Analytics 能力模組**，為 Xuanwu 系統提供事件投影、指標計算、洞察報表等分析能力的實作落點。

## 子域清單

| 子域 | 說明 | 狀態 |
|---|---|---|
| `event-contracts` | 事件契約定義（Published Language）| 🔨 骨架建立，實作進行中 |
| `event-ingestion` | 事件接收 / 攝取 | 🔨 骨架建立，實作進行中 |
| `event-projection` | 事件投影（讀模型計算）| 🔨 骨架建立，實作進行中 |
| `experimentation` | A/B 測試與功能實驗管理 | 🔨 骨架建立，實作進行中 |
| `insights` | 洞察報表 | 🔨 骨架建立，實作進行中 |
| `metrics` | 指標計算 | 🔨 骨架建立，實作進行中 |
| `realtime-insights` | 即時洞察 | 🔨 骨架建立，實作進行中 |

## Boundary Rules

- `domain/` 禁止匯入 React、Firebase SDK、HTTP client 或任何框架。
- `application/` 只依賴 `domain/` 抽象，不依賴 adapter 實作。
- 跨子域協調透過 `orchestration/` 或 `shared/events/`。

## Route Here When

- 撰寫 Analytics 的新 use case、entity、adapter 實作。
- 實作事件投影、指標計算 port 等骨架。

## Route Elsewhere When

- 讀取邊界規則 → `src/modules/analytics/AGENT.md`
- 跨模組 API boundary → `src/modules/analytics/index.ts`

## 路由規則

| 情境 | 正確路徑 |
|---|---|
| 讀取邊界規則 / published language | `src/modules/analytics/AGENT.md` |
| 撰寫新 use case / adapter / entity | `src/modules/analytics/`（本層） |
| 跨模組 API boundary | `src/modules/analytics/index.ts` |

**嚴禁事項：**
- ❌ 在 `domain/` 匯入 Firebase SDK、React
- ❌ 在 barrel 使用 `export *`

## 文件網絡

- [README.md](README.md) — 模組目錄結構
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
