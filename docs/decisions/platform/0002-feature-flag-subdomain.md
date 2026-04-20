# ADR 0002 — platform `feature-flag` 子域建立

## Status

Proposed

## Date

2025-02-11

## Context

`docs/structure/domain/subdomains.md` 的 platform baseline 定義包含 `feature-flag`：

> feature-flag — 功能開關策略與發佈節點

目前 `platform/subdomains/` 有 `platform-config`，但沒有 `feature-flag`。問題：

1. **`platform-config` ≠ feature-flag**：`platform-config` 負責平台配置輪廓（如：Firebase 專案設定、環境變數），feature-flag 負責執行期的功能開關決策（如：哪些用戶看到哪些功能）。
2. **無 FeatureFlag 業務語言**：`docs/structure/domain/ubiquitous-language.md` 定義的 platform 術語中無 FeatureFlag，代表尚未正式化。
3. **billing entitlement 的區別**：`billing/entitlement` 控制的是「付費方案給予哪些能力」，而 feature-flag 控制的是「開發團隊把哪些功能打開給哪些用戶測試」。兩者都能限制功能可用性，但決策維度不同。

系統中潛在需求：
- Canary release（只讓 10% 用戶看到新功能）
- Beta program（特定 organizationId 優先開啟）
- Gradual rollout（按百分比漸進開放）

這些策略屬於 **platform 的發佈治理能力**，不是 billing 的商業授權。

## Decision

### 建立 `platform/subdomains/feature-flag/`

```
src/modules/platform/subdomains/feature-flag/
  README.md
  domain/
    entities/
      FeatureFlag.ts           # 聚合根：name, status, rolloutStrategy, rules
    value-objects/
      FlagStatus.ts            # enabled / disabled / gradual
      RolloutStrategy.ts       # percentage, allowList, denyList
      FlagTarget.ts            # userId / organizationId / accountId
    services/
      FlagEvaluator.ts         # 純業務邏輯：給定 actor → 決定 flag 是否開啟
    events/
      FeatureFlagUpdated.ts
    repositories/
      FeatureFlagRepository.ts
  application/
    use-cases/
      evaluate-feature-flag.use-case.ts   # 主要消費 API
      create-feature-flag.use-case.ts
      update-rollout-strategy.use-case.ts
    dtos/
      EvaluateFlagInput.ts
      EvaluateFlagResult.ts    # { enabled: boolean; reason: string }
```

### 邊界澄清

| 問題 | 機制 | 所屬 |
|---|---|---|
| 這個功能需要付費方案嗎？ | Entitlement | billing |
| 這個功能是否在本次 release 開啟？ | FeatureFlag | platform |
| 這個功能是否對這個用戶授權？ | AccessDecision | iam |

### 與 platform-config 的分工

`platform-config`：靜態的平台環境配置（Firebase 設定、API endpoint、env 變數等），部署時決定，不在執行期動態改變。  
`feature-flag`：執行期的功能開關，可不重新部署即更新。

## Consequences

**正面：** 提供正式的功能發佈治理能力；與 entitlement 的商業授權邏輯分開，各自清晰。  
**負面：** 需要一個 backend 儲存 flag 定義（Firestore 即可）；評估效能時需確保 `evaluate-feature-flag` 不成為 hot path 瓶頸。  
**中性：** 初期 `RolloutStrategy` 只需支援 `enabled / disabled`，漸進 rollout 在真實需求出現時再擴展（YAGNI）。

## References

- `docs/structure/domain/subdomains.md` — platform feature-flag baseline
- `src/modules/platform/subdomains/platform-config/` — 現有平台配置（不負責功能開關）
- `src/modules/billing/subdomains/entitlement/` — 商業授權（不負責發佈策略）
- ADR platform/0001 — audit-log（feature-flag 更新應觸發 audit-log 記錄）
