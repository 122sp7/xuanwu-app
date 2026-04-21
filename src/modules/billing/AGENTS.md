# Billing Module — Agent Guide

## Purpose

`src/modules/billing/` 是 計費能力模組；處理 entitlement、subscription、usage-metering。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/entitlement/`
- `subdomains/subscription/`
- `subdomains/usage-metering/`

## Route Here When

- 需要在 `src/modules/billing/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 跨模組消費 entitlement / plan → `src/modules/billing/index.ts`
- 帳號 / 組織 / session → `src/modules/iam/`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/billing/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
