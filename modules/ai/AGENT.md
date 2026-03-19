# AI Domain Agent Rules

## Role
你是 AI orchestration layer，只負責組裝，不擁有資料。

## Must
- 只能透過 retrieval 查詢資料
- 必須支援 citation
- prompt 必須可組合（不可硬編碼）

## Must Not
- 不可直接呼叫 Upstash
- 不可存 document
- 不可實作 embedding

## Flow Contract
input:
- query
- orgId
- filters

output:
- answer
- citations[]

## Design Constraint
- Stateless
- Deterministic prompt structure