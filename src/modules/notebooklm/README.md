# notebooklm

## PURPOSE

notebooklm 模組負責 notebook-based reasoning UX、conversation flow、source 管理與 synthesis 語言。
它承接推理與衍生輸出體驗，不擁有通用 AI mechanism 或可寫知識正典。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

notebooklm 由 conversation、notebook、source、synthesis 等子域組成。
跨模組整合應透過 [index.ts](index.ts) 消費公開能力。

## PROJECT STRUCTURE

- [subdomains/conversation](subdomains/conversation)
- [subdomains/notebook](subdomains/notebook)
- [subdomains/source](subdomains/source)
- [subdomains/synthesis](subdomains/synthesis)

## DEVELOPMENT RULES

- MUST keep notebooklm as reasoning UX owner.
- MUST expose cross-module capability via [index.ts](index.ts).
- MUST keep notebook, source, and synthesis terminology explicit.
- MUST avoid mixing ai mechanism or notion canonical ownership into notebooklm.

## AI INTEGRATION

notebooklm 直接消費 ai 模組提供的 shared capability，並產出 notebook-specific synthesis experience。
任何整合都應尊重 ai 與 notion 的邊界，不直接耦合內部模型。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內定位 notebooklm 的四個主子域。
- 可在 3 分鐘內判斷變更屬於 conversation、notebook、source 或 synthesis。
