# notion

## PURPOSE

notion 模組負責 canonical writable knowledge、page、block、database、template 與 collaboration 語言。
它是可寫知識內容的 owning context，不承接 notebooklm reasoning UX 或通用 AI mechanism 所有權。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

notion 由 block、collaboration、database、knowledge、page、template、view 等子域組成。
跨模組整合應透過 [index.ts](index.ts) 消費公開能力。

## PROJECT STRUCTURE

- [subdomains/block](subdomains/block)
- [subdomains/collaboration](subdomains/collaboration)
- [subdomains/database](subdomains/database)
- [subdomains/knowledge](subdomains/knowledge)
- [subdomains/page](subdomains/page)
- [subdomains/template](subdomains/template)
- [subdomains/view](subdomains/view)

## DEVELOPMENT RULES

- MUST keep notion as canonical writable knowledge owner.
- MUST expose cross-module capability via [index.ts](index.ts).
- MUST keep knowledge, page, block, and collaboration terminology explicit.
- MUST avoid mixing notebooklm reasoning or ai mechanism ownership into notion.

## AI INTEGRATION

notion 可提供 canonical knowledge 與 structured content 給 ai 與 notebooklm 消費。
任何整合都應透過公開邊界完成，不直接依賴 notion 內部模型。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內理解 notion 的主要知識內容子域。
- 可在 3 分鐘內判斷變更屬於 page、block、database、template 或 collaboration。
