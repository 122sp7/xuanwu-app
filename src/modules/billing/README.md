# Billing Module

## 子域清單

| 子域 | 狀態 | 說明 |
|---|---|---|
| `entitlement` | 🔨 骨架建立，實作進行中 | 授權配額信號（能力准入）|
| `subscription` | 🔨 骨架建立，實作進行中 | 訂閱計劃管理 |
| `usage-metering` | 🔨 骨架建立，實作進行中 | API 呼叫、Token 消耗等用量計量 |

**術語提醒：**
- `Subscription` = 計費計劃（billing plan）
- `Entitlement` = 能力信號（capability signal，下游模組按此准入）

---

## 預期目錄結構

```
src/modules/billing/
  index.ts
  README.md
  AGENT.md
  shared/
    events/index.ts             ← EntitlementGranted / SubscriptionChanged 等 Published Language Events
    types/index.ts
  subdomains/
    entitlement/
      domain/
      application/
      adapters/outbound/
    subscription/
      domain/
      application/
      adapters/outbound/
    usage-metering/
      domain/
      application/
      adapters/outbound/
```

---

## 衝突防護

| 禁止行為 | 原因 |
|---|---|
| 混用 Subscription / Entitlement 術語 | 違反 Ubiquitous Language |
| 在 barrel 使用 `export *` | 破壞 tree-shaking |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 模組層總覽
- [docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
