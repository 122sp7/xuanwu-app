# infra — Agent Rules

## Immediate Index

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)

## Subpackage Index

- `client-state/` — client-side 狀態原語。 ([AGENTS.md](client-state/AGENTS.md) / [README.md](client-state/README.md))
- `date/` — 日期與時間工具原語。 ([AGENTS.md](date/AGENTS.md) / [README.md](date/README.md))
- `form/` — headless 表單狀態原語。 ([AGENTS.md](form/AGENTS.md) / [README.md](form/README.md))
- `http/` — HTTP 工具原語。 ([AGENTS.md](http/AGENTS.md) / [README.md](http/README.md))
- `query/` — server-state query 原語。 ([AGENTS.md](query/AGENTS.md) / [README.md](query/README.md))
- `serialization/` — 序列化 / 反序列化原語。 ([AGENTS.md](serialization/AGENTS.md) / [README.md](serialization/README.md))
- `state/` — Zustand / XState 封裝原語。 ([AGENTS.md](state/AGENTS.md) / [README.md](state/README.md))
- `table/` — headless 表格原語。 ([AGENTS.md](table/AGENTS.md) / [README.md](table/README.md))
- `trpc/` — tRPC client / provider 原語。 ([AGENTS.md](trpc/AGENTS.md) / [README.md](trpc/README.md))
- `uuid/` — UUID 生成與驗證原語。 ([AGENTS.md](uuid/AGENTS.md) / [README.md](uuid/README.md))
- `virtual/` — 長清單虛擬化原語。 ([AGENTS.md](virtual/AGENTS.md) / [README.md](virtual/README.md))
- `zod/` — Zod schema helper 原語。 ([AGENTS.md](zod/AGENTS.md) / [README.md](zod/README.md))

## Routing Rules

- `packages/infra/*` 只放本地 infra primitive。
- 需要外部服務 / credentials / network 的能力改放 `packages/integration-*`。
- 子套件清單以實際目錄為準。

## Drift Guard

- `AGENTS.md` 管 routing 與 nested index。
- `README.md` 管 infra 子套件總覽。
