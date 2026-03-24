# Skill: Firebase & Upstash Configuration
## Context
處理持久化儲存、快取與工作流。

## Stack Details
- **Auth/Firestore**: 使用 Firebase Admin SDK / Client SDK。
- **Cache/Vector**: 使用 Upstash Redis 與 Upstash Vector。
- **Workflow**: 使用 Upstash Workflow 處理非同步長任務。

## Constraints
- 所有設定必須透過 `.env.local` 讀取，嚴禁寫死金鑰。
- 所有的 SDK 調用必須封裝在 **L6 Adapters** 中，並透過 **L4** 調用。
- 必須符合 Genkit 的 Trace 與 Telemetry 規範。