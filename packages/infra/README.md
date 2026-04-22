# packages/infra

## PURPOSE

packages/infra 提供 repo 內共用的本地 infra primitive，例如 state、query、http、serialization 與 zod helpers。
它只承接技術原語，不承接外部服務整合或業務規則。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../README.md](../README.md)
3. [../../docs/README.md](../../docs/README.md)

## ARCHITECTURE

packages/infra 由多個本地 primitive 子套件構成，供 modules 與其他 packages 重用。
外部 SDK 或服務封裝應留在 integration packages，而不是 infra。

## PROJECT STRUCTURE

- [client-state](client-state)
- [date](date)
- [form](form)
- [http](http)
- [query](query)
- [serialization](serialization)
- [state](state)
- [table](table)
- [trpc](trpc)
- [uuid](uuid)
- [virtual](virtual)
- [zod](zod)

## DEVELOPMENT RULES

- MUST keep only local technical primitives in packages/infra.
- MUST route external integrations to integration packages.
- MUST keep package purposes explicit and stable.
- MUST avoid business ownership here.

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent package index: [../README.md](../README.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內判斷某個共享技術能力是否應落在 infra。
- 可在 3 分鐘內定位對應 primitive 子套件。
