# NotebookLM Module — Agent Guide

## Purpose

`src/modules/notebooklm/` 是 NotebookLM 使用者體驗模組；實際子域以目錄結構為準。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/conversation/`
- `subdomains/notebook/`
- `subdomains/source/`
- `subdomains/synthesis/`

## Route Here When

- 需要在 `src/modules/notebooklm/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- AI mechanism → `src/modules/ai/`
- KnowledgeArtifact 可寫內容 → `src/modules/notion/`
- 跨模組 API → `src/modules/notebooklm/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/notebooklm/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
