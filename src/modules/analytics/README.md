# Analytics Module

## 子域清單

| 子域 | 狀態 | 說明 |
|---|---|---|
| `event-contracts` | 🔨 骨架建立，實作進行中 | 事件契約定義 |
| `event-ingestion` | 🔨 骨架建立，實作進行中 | 事件接收 / 攝取 |
| `event-projection` | 🔨 骨架建立，實作進行中 | 事件投影（讀模型）|
| `experimentation` | 🔨 骨架建立，實作進行中 | A/B 測試與功能實驗管理 |
| `insights` | 🔨 骨架建立，實作進行中 | 洞察報表 |
| `metrics` | 🔨 骨架建立，實作進行中 | 指標計算 |
| `realtime-insights` | 🔨 骨架建立，實作進行中 | 即時洞察 |

---

## 預期目錄結構

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
    event-projection/
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
| 在 `domain/` 中 import Firebase SDK、React | 破壞 domain 純度 |
| 在 barrel 使用 `export *` | 破壞 tree-shaking |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
