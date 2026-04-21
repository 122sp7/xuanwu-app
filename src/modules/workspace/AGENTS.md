# Workspace Module — Agent Guide

## Purpose

`src/modules/workspace/` 是 工作區協作模組；workspace-workflow 已拆分，現況以子目錄索引為準。

## Immediate Index

- Parent AGENTS: [../AGENTS.md](../AGENTS.md)
- Parent README: [../README.md](../README.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)

## Subdomain Index（actual directories）

- `subdomains/activity/`
- `subdomains/api-key/`
- `subdomains/approval/`
- `subdomains/audit/`
- `subdomains/feed/`
- `subdomains/invitation/`
- `subdomains/issue/`
- `subdomains/lifecycle/`
- `subdomains/membership/`
- `subdomains/orchestration/`
- `subdomains/quality/`
- `subdomains/resource/`
- `subdomains/schedule/`
- `subdomains/settlement/`
- `subdomains/share/`
- `subdomains/task/`
- `subdomains/task-formation/`

## Route Here When

- 需要在 `src/modules/workspace/` 內新增或調整 domain / application / adapters / orchestration 實作。
- 需要確認此 bounded context 的目前目錄形狀與公開邊界。

## Route Elsewhere When

- 身份與權限 → `src/modules/iam/`
- AI mechanism → `src/modules/ai/`
- 跨模組 API → `src/modules/workspace/index.ts`

## Drift Guard

- `AGENTS.md` 擁有 `src/modules/workspace/` 的 routing、nested index、放置判斷。
- `README.md` 擁有同一節點的人類可讀概覽。
- 子域名稱與數量以實際 `subdomains/` 目錄為準。

## Related Docs

- [../../../docs/README.md](../../../docs/README.md)
- [../../../docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md)
