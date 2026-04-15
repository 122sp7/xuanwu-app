# Billing Module — 精簡蒸餾骨架

> **⚠ 蒸餾作業進行中**：`src/modules/billing/` 正在從 `modules/billing/`（完整 HEX+DDD 實作層）蒸餾而來。兩層職責不同，不可互換。

**蒸餾狀態：** 📋 待蒸餾（骨架已建立，業務實作待填入）

---

## 子域對照表（modules → src/modules）

| 子域 | 蒸餾來源 | 狀態 | 說明 |
|---|---|---|---|
| `entitlement` | `modules/billing/subdomains/entitlement/` | 📋 待蒸餾 | 授權配額信號（能力准入）|
| `subscription` | `modules/billing/subdomains/subscription/` | 📋 待蒸餾 | 訂閱計劃管理 |
| `usage-metering` | 新增（用量計量）| 📋 待蒸餾 | API 呼叫、Token 消耗等用量計量 |

**術語提醒：**
- `Subscription` = 計費計劃（billing plan）
- `Entitlement` = 能力信號（capability signal，下游模組按此准入）

---

## 預期目錄結構（蒸餾後）

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
| 把 `modules/billing/infrastructure/` 直接複製到 `src/modules/billing/domain/` | 層次混淆 |
| 混用 Subscription / Entitlement 術語 | 違反 Ubiquitous Language |

---

## 文件網絡

- [AGENT.md](AGENT.md) — Agent / Copilot 使用規則
- [src/modules/README.md](../README.md) — 蒸餾層總覽
- [modules/billing/](../../../modules/billing/) — 完整 HEX+DDD 實作層
- [docs/bounded-contexts.md](../../../docs/bounded-contexts.md) — 主域所有權地圖
