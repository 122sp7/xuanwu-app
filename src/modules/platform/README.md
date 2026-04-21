# Platform Module

`src/modules/platform/` 是 平台橫切能力模組；account / organization 已遷入 iam。

## Navigation Index

- Pair: [AGENTS.md](AGENTS.md)
- Parent: [../README.md](../README.md)
- Public boundary: [index.ts](index.ts)

## Directory Index（actual directories）

- `subdomains/audit-log/`
- `subdomains/background-job/`
- `subdomains/cache/`
- `subdomains/feature-flag/`
- `subdomains/file-storage/`
- `subdomains/notification/`
- `subdomains/platform-config/`
- `subdomains/search/`

## Pair Contract

- `README.md` 維護 `src/modules/platform/` 的最短概覽與實際目錄索引。
- `AGENTS.md` 維護 agent routing、nested index 與放置決策。
- 若未來新增 / 移除子域，先更新這兩份索引，再補充更細的 module-local 說明。

## Read Next

- [../AGENTS.md](../AGENTS.md)
- [../../../docs/README.md](../../../docs/README.md)
