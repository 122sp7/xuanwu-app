# Template Module — Agent Guide

## Purpose

`src/modules/template/` 是 可複製骨架模組；提供新 bounded context 的結構參考。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/document/`
- `subdomains/generation/`
- `subdomains/ingestion/`
- `subdomains/workflow/`

## Route Here When

- 需要在 `src/modules/template/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 真實業務實作 → `src/modules/<context>/`
- 共享套件 → `packages/`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/template/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
