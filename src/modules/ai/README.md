# ai

## PURPOSE

ai 模組提供共享 AI 機制能力，包括生成、檢索、記憶、安全與工具調用。
它是能力提供者，不直接擁有產品體驗流程。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

ai 以多子域切分機制能力，透過 [index.ts](index.ts) 對外提供穩定邊界。
子域聚焦 capability，避免與消費端 UX 邊界重疊。

## PROJECT STRUCTURE

- [subdomains/chunk](subdomains/chunk)
- [subdomains/citation](subdomains/citation)
- [subdomains/context](subdomains/context)
- [subdomains/embedding](subdomains/embedding)
- [subdomains/evaluation](subdomains/evaluation)
- [subdomains/generation](subdomains/generation)
- [subdomains/memory](subdomains/memory)
- [subdomains/pipeline](subdomains/pipeline)
- [subdomains/retrieval](subdomains/retrieval)
- [subdomains/safety](subdomains/safety)
- [subdomains/tool-calling](subdomains/tool-calling)

## DEVELOPMENT RULES

- MUST keep ai as capability provider, not feature UX owner.
- MUST expose cross-context APIs via module index boundary.
- MUST keep schema and contract changes explicit.
- MUST preserve module boundary alignment with docs ownership.

## AI INTEGRATION

ai 模組是 AI integration 的核心承接層。
若整合 external provider 或 flow contract 變更，需同步驗證契約與消費端邊界。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內定位 ai 子域能力入口。
- 可在 3 分鐘內判斷需求屬於 ai 機制層或消費端體驗層。
