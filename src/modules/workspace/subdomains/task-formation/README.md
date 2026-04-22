# task-formation

## PURPOSE

task-formation 子域負責從知識內容抽取任務候選，並在使用者確認後批次建立正式任務。
此子域擁有 TaskFormationJob 工作生命週期、候選任務暫存與確認流程。

## GETTING STARTED

開始前先讀：

1. [AGENTS.md](AGENTS.md)
2. [../../AGENTS.md](../../AGENTS.md)
3. [../../README.md](../../README.md)

開發時優先檢查 domain 與 use-cases，再接 inbound/outbound adapters。

## ARCHITECTURE

核心流程：

1. CreateTaskFormationJob
2. ExtractTaskCandidates via extractor port
3. Persist candidates to job
4. User review and confirm
5. Trigger task use-case boundary for batch creation

## PROJECT STRUCTURE

- [domain](domain)：TaskFormationJob、值物件、events、repository port
- [application](application)：DTO、use-cases、orchestration
- [adapters/inbound](adapters/inbound)：server actions / UI entry
- [adapters/outbound](adapters/outbound)：Firestore/Genkit 等實作

## DEVELOPMENT RULES

- MUST persist extracted candidates before UI review.
- MUST use extractor ports instead of direct Genkit calls inside use-cases.
- MUST create tasks through task subdomain use-case boundary.
- MUST keep task-formation lifecycle state transitions explicit.

## AI INTEGRATION

AI extraction 需以 schema 驗證輸入與輸出，並在 application 層以 port 呼叫。
UI 狀態流建議使用顯式狀態機，避免候選任務狀態漂移。

## DOCUMENTATION

- Routing/rules: [AGENTS.md](AGENTS.md)
- Parent subdomains: [../../README.md](../../README.md)
- Strategic authority: [../../../../../docs/README.md](../../../../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內掌握抽取到確認的主流程。
- 可在 3 分鐘內定位需修改的層（domain/application/adapters）。
