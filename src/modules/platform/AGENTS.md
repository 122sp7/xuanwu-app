# Platform Module — Agent Guide

## Purpose

`src/modules/platform/` 是 平台橫切能力模組；account / organization 已遷入 iam。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/audit-log/`
- `subdomains/background-job/`
- `subdomains/cache/`
- `subdomains/feature-flag/`
- `subdomains/file-storage/`
- `subdomains/notification/`
- `subdomains/platform-config/`
- `subdomains/search/`

## Route Here When

- 需要在 `src/modules/platform/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- account / organization → `src/modules/iam/`
- 跨模組 API → `src/modules/platform/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/platform/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
