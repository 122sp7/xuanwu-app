# template

## PURPOSE

template 模組是新 bounded context 的可複製骨架。
它提供最小可行的目錄結構與分層邊界示例，避免每次從零建模。

## GETTING STARTED

使用 template 作為新模組基線時：

1. 先讀 [AGENTS.md](AGENTS.md)
2. 對齊 [../../../docs/README.md](../../../docs/README.md) 的所有權與術語
3. 複製結構後再填入特定 context 的語言與規則

## ARCHITECTURE

template 對齊 modules 層的標準依賴方向與邊界：

- public boundary 由 [index.ts](index.ts) 提供
- subdomains 提供核心能力分割
- 文件分工為 AGENTS（行為）與 README（導覽）

## PROJECT STRUCTURE

- [subdomains/document](subdomains/document)
- [subdomains/generation](subdomains/generation)
- [subdomains/ingestion](subdomains/ingestion)
- [subdomains/workflow](subdomains/workflow)

## DEVELOPMENT RULES

- MUST keep template generic and context-agnostic.
- MUST update AGENTS and README together when scaffold changes.
- MUST preserve module boundary and dependency-direction examples.

## AI INTEGRATION

AI 代理應使用 template 作為結構參考，而非直接複製業務語言。
實際命名與邊界需回到 docs 權威文件再落地。

## DOCUMENTATION

- Routing rules: [AGENTS.md](AGENTS.md)
- Parent module index: [../README.md](../README.md)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內用 template 建立新模組骨架。
- 可在 3 分鐘內定位要放置的新子域位置與入口檔。
