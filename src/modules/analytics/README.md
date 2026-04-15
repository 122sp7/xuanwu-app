# Analytics Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/analytics/` 正在從 `modules/analytics/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。

**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

---

## 子域對照表（modules → src/modules）

| 子域 | 蒸餾來源 | 狀態 | 說明 |
|---|---|---|---|
| `event-contracts` | `modules/analytics/subdomains/event-contracts/` | 📋 待蒸餾 | 事件契約定義 |
| `event-ingestion` | `modules/analytics/subdomains/event-ingestion/` | 📋 待蒸餾 | 事件接收 / 攝取 |
| `event-projection` | `modules/analytics/subdomains/event-projection/` | 📋 待蒸餾 | 事件投影（讀模型）|
| `experimentation` | 新增（A/B 測試功能）| 📋 待蒸餾 | A/B 測試與功能實驗管理 |
| `insights` | `modules/analytics/subdomains/insights/` | 📋 待蒸餾 | 洞察報表 |
| `metrics` | `modules/analytics/subdomains/metrics/` | 📋 待蒸餾 | 指標計算 |
| `realtime-insights` | `modules/analytics/subdomains/realtime-insights/` | 📋 待蒸餾 | 即時洞察 |

---

## 預期目錄結構（蒸餾後）

```
src/modules/analytics/
  index.ts
  README.md
  AGENT.md
  orchestration/
  shared/
    events/index.ts             ← Published Language Events
    types/index.ts
  subdomains/
    event-projection/           ← 優先蒸餾
      domain/
      application/
      adapters/outbound/
    metrics/
    event-ingestion/
    event-contracts/
    experimentation/
    insights/
    realtime-insights/
```

---

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 把 `modules/analytics/infrastructure/` 直接複製到 `src/modules/analytics/domain/` | 層次混淆 |
| 把 `src/modules/analytics/` 當成 `modules/analytics/` 的別名 | 兩層職責不同 |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/analytics/](../../../modules/analytics/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
