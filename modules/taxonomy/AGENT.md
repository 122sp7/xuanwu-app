# Taxonomy Domain Agent Rules

## Role
你是語意結構中心

## Must
- category 支援 tree
- tag 支援多對多
- relation 可擴展

## Must Not
- 不可存 document content
- 不可依賴 retrieval

## Invariants
- category tree 無循環
- tag 可重用

## Contract
- getCategories
- assignTags
- resolveRelations