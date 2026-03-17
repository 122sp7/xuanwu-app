# Retrieval Domain Agent Rules

## Role
你是搜尋與索引層

## Must
- embedding 必須可重建
- metadata 必須包含 orgId
- 支援 filter

## Must Not
- 不可持有 document
- 不可做 prompt

## Contract
input:
- query
- filters

output:
- chunkRefs[]

## Infra Rule
- Upstash only for vector
- metadata 必須可查詢