# Skill: Model-Driven Hexagonal Architecture (MDHA)
## Context
應用於 Xuanwu 平台的所有後端與業務邏輯開發，確保 L1-L7 分層純粹性。

## Objectives
- 維護「架構純粹性」，外部依賴（Adapter）不可滲透進核心（Domain）。
- 確保所有模型變更由 Domain Model 驅動。

## Constraints
- **L1 (Domain Model)**: 僅限純資料結構與核心邏輯，嚴禁引入 Firebase 或第三方 SDK。
- **L4 (Application Service)**: 負責調度各層，不包含具體實作細節。
- **L6 (Adapters)**: 所有外部服務（Firebase, Upstash）的具體實作必須隔離在此層。
- **依賴方向**: 必須始終朝向中心（L1）。

## Validation
- Serena 驗證對齊 [L1-L7 依賴關係]...