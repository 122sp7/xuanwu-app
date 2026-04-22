# iam

## PURPOSE

iam 模組負責身份、存取、租戶、帳號與組織治理。
它提供其他模組所需的 actor、access decision、tenant scope 與相關能力邊界。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../../docs/README.md](../../../docs/README.md)

## ARCHITECTURE

iam 由 access-control、account、authentication、authorization、federation、identity、organization、security-policy、session、tenant 等子域組成。
跨模組整合應透過 [index.ts](index.ts) 消費公開能力。

## PROJECT STRUCTURE

- [subdomains/access-control](subdomains/access-control)
- [subdomains/account](subdomains/account)
- [subdomains/authentication](subdomains/authentication)
- [subdomains/authorization](subdomains/authorization)
- [subdomains/federation](subdomains/federation)
- [subdomains/identity](subdomains/identity)
- [subdomains/organization](subdomains/organization)
- [subdomains/security-policy](subdomains/security-policy)
- [subdomains/session](subdomains/session)
- [subdomains/tenant](subdomains/tenant)

## DEVELOPMENT RULES

- MUST keep iam as identity and access owner.
- MUST keep account and organization semantics inside iam.
- MUST expose cross-module capability via [index.ts](index.ts).
- MUST avoid mixing workspace or billing ownership into iam.

## AI INTEGRATION

iam 可向 AI 或其他模組提供 actor reference、tenant scope 與 access decision。
任何 AI 整合都應消費已發布的語言，不應直接依賴 iam 內部模型。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent modules index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內定位 iam 的主要子域與責任。
- 可在 3 分鐘內判斷需求屬於 identity、authorization、session 或 organization。
