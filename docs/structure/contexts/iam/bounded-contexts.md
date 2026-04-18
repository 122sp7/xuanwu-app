# IAM

## Domain Role

iam 是 governance bounded context。它是身份、tenant 與 access decision 的 canonical owner。

## Ownership Rules

- 擁有 identity、access-control、tenant、security-policy。
- 向下游輸出 actor reference、tenant scope、access decision。
- 不擁有 workspace、knowledge、notebook 或 billing aggregate。
