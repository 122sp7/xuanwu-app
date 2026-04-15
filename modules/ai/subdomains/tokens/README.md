# tokens — 計費權重與使用量配額

## 子域目的

管理 AI 請求的 token 計費權重、使用量配額，以及每個模型端點的最大請求上限（Max Requests）配置。此子域是 `ai` bounded context 對「AI 資源消耗的可量化治理」的正典知識邊界。

## 業務能力邊界

**負責：**
- Token 的計費權重（pricing weight）定義與版本化
- Per-model / per-workspace / per-actor 的使用量配額設定
- 模型端點的 Max Requests 上限配置（rate limiting contract）
- Token 用量的記錄與配額核減

**不負責：**
- 財務計費與帳單生成（屬於 `billing` bounded context）
- 模型呼叫的實際執行（屬於 `inference` 子域）
- 供應商帳戶的 API key 管理（屬於 `platform/integration` 子域）
- Token 超限時的 UI 呈現（屬於 `interfaces/` 層）

## tokens vs billing 分工

| 關注點 | tokens | billing |
|--------|--------|---------|
| Token 計費權重 | ✅ 正典所有者 | 消費信號 |
| 使用量配額 | ✅ 正典所有者 | 消費信號 |
| 帳單生成 | ❌ | ✅ 正典所有者 |
| Entitlement 判定 | ❌ | ✅ 正典所有者 |

## 核心概念

| 概念 | 說明 |
|------|------|
| TokenUsageRecord | 單次 AI 請求的 input/output token 用量記錄 |
| TokenQuota | Per-scope（workspace/actor）可用 token 配額實體 |
| PricingWeight | 每個模型的 token 計費倍率值對象 |
| MaxRequests | 模型端點的請求頻率上限配置 |

## 架構層級

```
tokens/
  api/              ← 對外公開配額查詢與用量記錄入口
  domain/
    entities/       ← TokenQuota, TokenUsageRecord
    value-objects/  ← PricingWeight, MaxRequests, TokenCount
    repositories/   ← TokenQuotaRepository（介面）
    events/         ← TokenQuotaExceeded, TokenUsageRecorded
  application/
    use-cases/      ← RecordTokenUsage, CheckQuotaAvailability, UpdateModelPricing
```

## 事件合約

- `TokenQuotaExceeded` → 下游 `safety-guardrail` 可訂閱以阻擋後續請求
- `TokenUsageRecorded` → 下游 `billing/analytics` 消費計費信號

## Ubiquitous Language

- **TokenQuota**：在特定 scope 下可消耗的 token 上限（不是帳單金額）
- **PricingWeight**：模型使用的計費倍率（業務概念，非財務計算）
- **MaxRequests**：API 端點的速率上限，是模型端點的靜態配置
- **TokenUsageRecord**：不可變的用量事實記錄，不是即時計數器
