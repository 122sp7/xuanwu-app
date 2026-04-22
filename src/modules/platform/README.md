# platform

## PURPOSE

platform 模組負責共享 operational service 與平台橫切能力，例如 audit-log、notification、search 與 background-job。
它不再擁有 account 或 organization 的正典所有權。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

platform 由 audit-log、background-job、cache、feature-flag、file-storage、notification、platform-config、search 等子域組成。
跨模組整合應透過 [index.ts](index.ts) 消費公開能力。

## PROJECT STRUCTURE

- [subdomains/audit-log](subdomains/audit-log)
- [subdomains/background-job](subdomains/background-job)
- [subdomains/cache](subdomains/cache)
- [subdomains/feature-flag](subdomains/feature-flag)
- [subdomains/file-storage](subdomains/file-storage)
- [subdomains/notification](subdomains/notification)
- [subdomains/platform-config](subdomains/platform-config)
- [subdomains/search](subdomains/search)

## DEVELOPMENT RULES

- MUST keep platform as operational service owner.
- MUST expose cross-module capability via [index.ts](index.ts).
- MUST keep operational terminology explicit.
- MUST avoid mixing IAM or workspace ownership into platform.

## AI INTEGRATION

platform 可向 AI 或其他模組提供通知、搜尋、檔案與背景作業等共享能力。
任何 AI 整合都應透過公開邊界消費，不直接依賴 platform 內部模型。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內理解 platform 的 operational service 範圍。
- 可在 3 分鐘內判斷變更屬於 notification、search、file-storage 或 background-job。
