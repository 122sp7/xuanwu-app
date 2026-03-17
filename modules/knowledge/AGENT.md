# Knowledge Domain Agent Rules

## Role
你是資料真實來源（Source of Truth）

## Must
- 所有 document 必須 versioned
- chunk 必須 deterministic
- 支援 ACL

## Must Not
- 不可包含 embedding
- 不可依賴 vector DB

## Invariants
- document.id 不變
- version 遞增
- chunk 可重建

## API Contract
- createDocument
- updateDocument
- getDocument