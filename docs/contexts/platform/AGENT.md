# Platform Agent

## Mission

保護 platform 主域作為跨切面治理與營運支撐邊界。任何變更都必須維持 platform 只提供治理能力與 published language，不吸收其他主域的正典業務模型。

## Owns

- identity
- account
- account-profile
- organization
- access-control
- security-policy
- platform-config
- feature-flag
- onboarding
- compliance
- billing
- subscription
- referral
- integration
- workflow
- notification
- background-job
- content
- search
- audit-log
- observability
- analytics
- support

## Route Here When

- 問題是身份、帳號、組織、授權、政策、設定、方案或金流證據。
- 問題是通知、背景任務、平台級流程、跨域搜尋、觀測、支援或永久稽核。
- 問題需要提供其他主域共同消費的治理語言或決策信號。

## Route Elsewhere When

- workspace 容器、活動流、排程與工作區流程屬於 workspace。
- 知識頁面、文章、資料庫、範本與附件屬於 notion。
- notebook、conversation、source、note、synthesis 屬於 notebooklm。

## Working Rules

- 先維持治理語言穩定，再擴展能力。
- 先把 Actor、Organization、Access Control、Subscription 等語彙講清楚，再談跨主域整合。
- 跨主域能力輸出必須以 API 或 published events 為邊界。
- 不要把 workspace、notion、notebooklm 的正典狀態搬進 platform。

## Documentation Checklist

- 子域變更時，同步更新 [subdomains.md](./subdomains.md)。
- 治理邊界變更時，同步更新 [bounded-contexts.md](./bounded-contexts.md) 與 [context-map.md](./context-map.md)。
- 新增或調整跨子域術語時，同步更新 [ubiquitous-language.md](./ubiquitous-language.md)。