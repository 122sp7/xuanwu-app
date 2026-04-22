# experimentation

## PURPOSE

experimentation 子域負責實驗觀測與分析試驗語言。

## GETTING STARTED

先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../../README.md](../../README.md)
3. [../../../../../../docs/README.md](../../../../../../docs/README.md)

## ARCHITECTURE

此子域隸屬 analytics，承接 experiment 與 observation 能力。

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)

## DEVELOPMENT RULES

- MUST keep experimentation terms explicit.
- MUST route cross-module access through [../../index.ts](../../index.ts).

## DOCUMENTATION

- Parent: [../../README.md](../../README.md)
- Strategic authority: [../../../../../../docs/README.md](../../../../../../docs/README.md)

## USABILITY

- 開發者可快速定位 analytics 中的 experimentation 邊界。
