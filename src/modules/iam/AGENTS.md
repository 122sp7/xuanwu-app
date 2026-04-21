# IAM Module — Agent Guide

## Purpose

`src/modules/iam/` 是 Identity & Access Management 模組；account / organization 已集中於此。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/access-control/`
- `subdomains/account/`
- `subdomains/authentication/`
- `subdomains/authorization/`
- `subdomains/federation/`
- `subdomains/identity/`
- `subdomains/organization/`
- `subdomains/security-policy/`
- `subdomains/session/`
- `subdomains/tenant/`

## Route Here When

- 需要在 `src/modules/iam/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 工作區 Membership → `src/modules/workspace/`
- 跨模組消費身份能力 → `src/modules/iam/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/iam/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
