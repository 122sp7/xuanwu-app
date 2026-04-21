# AI Module — Agent Guide

## Purpose

`src/modules/ai/` 是 AI 機制能力模組；提供 AI mechanism，使用者體驗仍由其他模組組合。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/chunk/`
- `subdomains/citation/`
- `subdomains/context/`
- `subdomains/embedding/`
- `subdomains/evaluation/`
- `subdomains/generation/`
- `subdomains/memory/`
- `subdomains/pipeline/`
- `subdomains/retrieval/`
- `subdomains/safety/`
- `subdomains/tool-calling/`

## Route Here When

- 需要在 `src/modules/ai/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 使用者對話與 RAG UX → `src/modules/notebooklm/`
- 知識內容寫入 → `src/modules/notion/`
- 任務生成業務流程 → `src/modules/workspace/`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/ai/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
