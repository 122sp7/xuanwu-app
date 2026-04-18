# Template Module

`src/modules/template` 是一個可複製的 **Hexagonal Architecture + DDD 多子域骨架**，示範多 subdomain 分層結構、具名匯出規範與跨子域協調模式。

## 目錄結構

```
src/modules/template/
  index.ts                          ← 模組對外唯一入口（具名匯出）
  README.md
  AGENTS.md
  orchestration/
    TemplateFacade.ts               ← 對外統一 Facade（委派各子域 use case）
    TemplateCoordinator.ts          ← 跨子域流程協調（document→generation→ingestion→workflow）
  shared/
    domain/index.ts                 ← 跨子域共用 domain 概念（Value Object、Policy）
    application/index.ts            ← 跨子域共用 DTO / Port
    config/index.ts                 ← 模組設定
    constants/index.ts              ← 模組常數
    errors/index.ts                 ← 共用錯誤類型
    events/index.ts                 ← 跨子域 Published Language Events
    infrastructure/index.ts         ← 共用 infrastructure 工具
    types/index.ts                  ← 共用 TypeScript 型別
    utils/index.ts                  ← 共用工具函式
  subdomains/
    document/                       ← 核心子域（CRUD 完整實作）
      domain/
        entities/Template.ts
        value-objects/TemplateId.ts
        value-objects/TemplateName.ts
        events/TemplateCreatedEvent.ts
        events/TemplateUpdatedEvent.ts
        repositories/TemplateRepository.ts
        services/TemplateDomainService.ts
        index.ts
      application/
        use-cases/{Create,Update,Delete}TemplateUseCase.ts
        dto/{Create,Update,Response}TemplateDTO.ts
        ports/inbound/CreateTemplatePort.ts
        ports/outbound/{TemplateRepositoryPort,CachePort,ExternalApiPort}.ts
        index.ts
      adapters/
        inbound/
          http/{TemplateController,routes}.ts
          queue/TemplateQueueHandler.ts
          index.ts
        outbound/
          firestore/{FirestoreTemplateRepository,FirestoreMapper}.ts
          cache/TemplateCacheAdapter.ts
          external-api/TemplateApiClient.ts
          index.ts
        index.ts
    generation/                     ← 生成子域（完整實作）
      domain/
        entities/GeneratedTemplate.ts   ← id: GenerationId（VO）
        value-objects/GenerationId.ts
        repositories/GenerationRepository.ts
        services/GenerationDomainService.ts
        events/GenerationCompletedEvent.ts
        index.ts
      application/
        use-cases/GenerateTemplateUseCase.ts
        dto/{GenerateTemplate,GenerationResult}DTO.ts
        ports/inbound/GenerateTemplatePort.ts
        ports/outbound/{GenerationRepositoryPort,AiGenerationPort}.ts
        index.ts
      adapters/
        inbound/
          http/{GenerationController,routes}.ts
          queue/GenerationQueueHandler.ts
          index.ts
        outbound/
          firestore/FirestoreGenerationRepository.ts
          ai/AiGenerationAdapter.ts             ← stub, TODO: wire Genkit
          index.ts
        index.ts
    ingestion/                      ← 匯入子域（完整實作）
      domain/
        entities/IngestionJob.ts        ← id: IngestionId（VO）+ markProcessing()
        value-objects/IngestionId.ts
        repositories/IngestionJobRepository.ts
        services/IngestionDomainService.ts
        events/IngestionJobEvents.ts
        index.ts
      application/
        use-cases/StartIngestionUseCase.ts
        dto/{StartIngestion,IngestionJobResponse}DTO.ts
        ports/inbound/StartIngestionPort.ts
        ports/outbound/{IngestionRepositoryPort,StoragePort}.ts
        index.ts
      adapters/
        inbound/
          http/{IngestionController,routes}.ts
          queue/IngestionQueueHandler.ts
          index.ts
        outbound/
          firestore/FirestoreIngestionJobRepository.ts
          storage/CloudStorageAdapter.ts        ← stub, TODO: wire Cloud Storage
          index.ts
        index.ts
    workflow/                       ← 流程子域（完整實作）
      domain/
        entities/TemplateWorkflow.ts    ← id: WorkflowId（VO）
        value-objects/WorkflowId.ts
        repositories/TemplateWorkflowRepository.ts
        services/WorkflowDomainService.ts
        events/WorkflowEvents.ts
        index.ts
      application/
        use-cases/InitiateWorkflowUseCase.ts
        dto/{InitiateWorkflow,WorkflowResponse}DTO.ts
        ports/inbound/InitiateWorkflowPort.ts
        ports/outbound/WorkflowRepositoryPort.ts
        index.ts
      adapters/
        inbound/
          http/{WorkflowController,routes}.ts   ← HTTP only，無 queue handler
          index.ts
        outbound/
          firestore/FirestoreWorkflowRepository.ts
          index.ts
        
        entities/IngestionJob.ts        ← id: IngestionId（VO）+ markProcessing()
        value-objects/IngestionId.ts
        repositories/IngestionJobRepository.ts
        services/IngestionDomainService.ts
        events/IngestionJobEvents.ts
        index.ts
      application/
        use-cases/StartIngestionUseCase.ts
        dto/{StartIngestion,IngestionJobResponse}DTO.ts
        ports/inbound/StartIngestionPort.ts
        ports/outbound/{IngestionRepositoryPort,StoragePort}.ts
        index.ts
      adapters/
        inbound/
          http/{IngestionController,routes}.ts
          queue/IngestionQueueHandler.ts
          index.ts
        outbound/
          firestore/FirestoreIngestionJobRepository.ts
          storage/CloudStorageAdapter.ts        ← stub, TODO: wire Cloud Storage
          index.ts
        index.ts
    workflow/                       ← 流程子域（完整實作）
      domain/
        entities/TemplateWorkflow.ts    ← id: WorkflowId（VO）
        value-objects/WorkflowId.ts
        repositories/TemplateWorkflowRepository.ts
        services/WorkflowDomainService.ts
        events/WorkflowEvents.ts
        index.ts
      application/
        use-cases/InitiateWorkflowUseCase.ts
        dto/{InitiateWorkflow,WorkflowResponse}DTO.ts
        ports/inbound/InitiateWorkflowPort.ts
        ports/outbound/WorkflowRepositoryPort.ts
        index.ts
      adapters/
        inbound/
          http/{WorkflowController,routes}.ts   ← HTTP only，無 queue handler
          index.ts
        outbound/
          firestore/FirestoreWorkflowRepository.ts
          index.ts
        index.ts
```

## Barrel 結構（具名匯出原則）

所有 barrel 使用明確的 `export { X }` 與 `export type { X }`，嚴禁 `export *`。

| 檔案 | 覆蓋範圍 |
|---|---|
| `index.ts` | 模組對外唯一公開入口：重新匯出全部四個子域的 domain + application 符號 |
| `subdomains/document/domain/index.ts` | entities、value-objects、events、repositories、services |
| `subdomains/document/application/index.ts` | use-cases、dto、ports |
| `subdomains/generation/domain/index.ts` | GeneratedTemplate、GenerationId、events、service、repo |
| `subdomains/generation/application/index.ts` | GenerateTemplateUseCase、dto、ports（含 AiGenerationPort）|
| `subdomains/ingestion/domain/index.ts` | IngestionJob、IngestionId、events、service、repo |
| `subdomains/ingestion/application/index.ts` | StartIngestionUseCase、dto、ports（含 StoragePort）|
| `subdomains/workflow/domain/index.ts` | TemplateWorkflow、WorkflowId、events、service、repo |
| `subdomains/workflow/application/index.ts` | InitiateWorkflowUseCase、dto、ports |
| `shared/*/index.ts` | 各共用層的對外出口 |

### 根 index.ts 匯出範例

```ts
// src/modules/template/index.ts
export {
  Template, TemplateId, TemplateName,
  TemplateCreatedEvent, TemplateUpdatedEvent, TemplateDomainService,
} from './subdomains/document/domain';
export type { TemplateProps, TemplateRepository } from './subdomains/document/domain';
export {
  CreateTemplateUseCase, UpdateTemplateUseCase, DeleteTemplateUseCase,
} from './subdomains/document/application';
export type {
  CreateTemplateDTO, UpdateTemplateDTO, TemplateResponseDTO,
  CreateTemplatePort, TemplateRepositoryPort, CachePort, ExternalApiPort,
} from './subdomains/document/application';

// generation
export { GeneratedTemplate, GenerationId, GenerationDomainService, GenerationCompletedEvent } from './subdomains/generation/domain';
export type { GenerationRepository } from './subdomains/generation/domain';
export { GenerateTemplateUseCase } from './subdomains/generation/application';
export type { GenerateTemplateDTO, GenerationResultDTO, GenerateTemplatePort, GenerationRepositoryPort, AiGenerationPort } from './subdomains/generation/application';

// ingestion
export { IngestionJob, IngestionId, IngestionDomainService, IngestionJobStartedEvent, IngestionJobCompletedEvent } from './subdomains/ingestion/domain';
export type { IngestionJobRepository, IngestionStatus } from './subdomains/ingestion/domain';
export { StartIngestionUseCase } from './subdomains/ingestion/application';
export type { StartIngestionDTO, IngestionJobResponseDTO, StartIngestionPort, IngestionRepositoryPort, StoragePort } from './subdomains/ingestion/application';

// workflow
export { TemplateWorkflow, WorkflowId, WorkflowDomainService, WorkflowInitiatedEvent, WorkflowCompletedEvent } from './subdomains/workflow/domain';
export type { TemplateWorkflowRepository, WorkflowStatus } from './subdomains/workflow/domain';
export { InitiateWorkflowUseCase } from './subdomains/workflow/application';
export type { InitiateWorkflowDTO, WorkflowResponseDTO, InitiateWorkflowPort, WorkflowRepositoryPort } from './subdomains/workflow/application';
```

所有 source 檔內部 import 使用**直接相對路徑**，不依賴 barrel index，確保 barrel 可獨立修改。

## 依賴方向

```
subdomains/*/adapters/inbound → subdomains/*/application → subdomains/*/domain
                                                                    ↑
                               subdomains/*/adapters/outbound  ───┘
                                                    ↑
                                             shared/domain
```

跨子域協調只能透過 `orchestration/` 或 `shared/events/`，不得直接跨 subdomain import。

## 如何複製成新模組

1. 複製整個 `src/modules/template/` 資料夾。
2. 全域取代 `Template` → `<YourEntity>`（保留大小寫規律），各子域實體名稱也一併取代。
3. 保留實際有業務需求的子域；刪除不需要的子域（generation / ingestion / workflow 可視業務選用）。
4. 依 DDD 開發順序填入業務規則：Domain → Application → Ports → Adapters → Orchestration。
5. 更新根 `index.ts` barrel，僅匯出有實作的子域符號。

---

## 路由規則

- 讀取邊界規則、published language → `src/modules/<context>/AGENTS.md`
- 撰寫新實作程式碼 → `src/modules/<context>/`，以本模組為骨架基線
- 需要跨模組 API boundary → `src/modules/<context>/index.ts`

---

## 衝突防護

1. **不在 `domain/` 匯入 Firebase SDK、React、HTTP client 或 ORM。**
2. `template` 模組本身不代表任何業務邊界；真實業務請在對應 `src/modules/<context>/` 實作。

---

## 文件網絡

- [src/modules/README.md](../README.md) — 模組層狀態總覽
- [src/modules/template/AGENTS.md](AGENTS.md) — Agent / Copilot 使用規則
- [docs/structure/domain/bounded-contexts.md](../../../docs/structure/domain/bounded-contexts.md) — 主域所有權地圖
- [docs/structure/domain/bounded-context-subdomain-template.md](../../../docs/structure/domain/bounded-context-subdomain-template.md) — 設計藍圖
