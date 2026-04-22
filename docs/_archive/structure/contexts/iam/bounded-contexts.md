# IAM

## Domain Role

iam 是 governance bounded context。它是身份、tenant 與 access decision 的 canonical owner。account 與 organization 的聚合根也屬於 iam（從 platform 遷入）。

## Ownership Rules

- 擁有 identity、access-control、tenant、security-policy。
- 擁有 account（帳號聚合根）與 organization（組織聚合根）— 已從 platform 遷入。
- 向下游輸出 actor reference、tenant scope、access decision。
- 不擁有 workspace、knowledge、notebook 或 billing aggregate。
