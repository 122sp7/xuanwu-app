# fn

## PURPOSE

fn 是 Python Cloud Functions worker runtime，處理重度、可重試的 ingestion / indexing / query pipeline。
本層與 Next.js browser-facing orchestration 分離，確保 runtime 邊界清楚。
fn 內部遵循 hexagonal 分層，domain 層保持技術無關。

## GETTING STARTED

在 repo 根目錄執行：

```bash
cd fn
pip install -r requirements.txt -r requirements-dev.txt
python -m compileall -q .
python -m pytest tests/ -v
```

若要本機整合測試，可在 repo 根目錄執行 Firebase Emulator。

## ARCHITECTURE

fn 的層次：

- interface：callable/storage handler + schema 驗證
- application：use-case orchestration
- domain：protocol、規則、value objects
- infrastructure：外部服務與持久化實作

依賴方向固定為 interface -> application -> domain <- infrastructure。

## PROJECT STRUCTURE

- [main.py](main.py)：Cloud Functions 宣告入口
- [src/interface](src/interface)：handlers 與輸入 schema
- [src/application](src/application)：use-cases、dto、services
- [src/domain](src/domain)：業務規則與 protocol
- [src/infrastructure](src/infrastructure)：external/cache/audit/persistence/gateways
- [tests](tests)：pytest 測試

## DEVELOPMENT RULES

- MUST keep callable auth and input validation at interface boundary.
- MUST keep business invariants in domain, not infrastructure.
- MUST keep worker behavior idempotent for retryable paths.
- MUST keep Next.js UI/session concerns outside fn.

## AI INTEGRATION

fn 承擔 Document AI 解析、RAG ingestion、RAG query 等 worker 能力。
AI 代理修改 fn 時，需同步檢查 callable 契約、gateway 介面與跨運行時 DTO mirror。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Command reference: [../docs/05-tooling/commands-reference.md](../docs/05-tooling/commands-reference.md)
- Strategic authority: [../docs/README.md](../docs/README.md)
- AI context contracts: [../docs/01-architecture/contexts/ai](../docs/01-architecture/contexts/ai)

## USABILITY

- 新開發者可在 5 分鐘內完成依賴安裝與測試執行。
- 可在 3 分鐘內定位修改層級（interface/application/domain/infrastructure）。
