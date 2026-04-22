# packages

## PURPOSE

packages 目錄承接共享 infra primitive、外部整合封裝與可重用 UI package。
它提供跨模組共用能力，但不承接業務語言所有權。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../docs/README.md](../docs/README.md)

## ARCHITECTURE

packages 由 infra、integration-* 與 ui-* 三類共享套件構成。
業務規則仍應留在 src/modules，packages 只提供共用技術能力。

## PROJECT STRUCTURE

- [infra](infra)
- [integration-ai](integration-ai)
- [integration-firebase](integration-firebase)
- [integration-queue](integration-queue)
- [ui-components](ui-components)
- [ui-dnd](ui-dnd)
- [ui-editor](ui-editor)
- [ui-markdown](ui-markdown)
- [ui-shadcn](ui-shadcn)
- [ui-vis](ui-vis)
- [ui-visualization](ui-visualization)

## DEVELOPMENT RULES

- MUST keep shared technical capability in packages.
- MUST keep business ownership in src/modules.
- MUST keep package boundaries explicit and stable.
- MUST avoid duplicating strategic docs here.

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Infra subgroup: [infra/README.md](infra/README.md)
- Strategic authority: [../docs/README.md](../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內判斷共享能力應放在 infra、integration 或 ui 套件。
- 可在 3 分鐘內定位適合的 package 子樹。
