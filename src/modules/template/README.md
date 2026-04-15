# Template Module

`src/modules/template` 是一個可複製的 **Hexagonal Architecture + DDD 多子域骨架**，示範多 subdomain 分層結構、具名匯出規範與跨子域協調模式。

## 目錄結構

```
src/modules/template/
  index.ts                          ← 模組對外唯一入口（具名匯出）
  README.md
  AGENT.md
  orchestration/
    TemplateFacade.ts               ← 對外統一 Facade（委派各子域 use case）
    TemplateCoordinator.ts          ← 跨子域流程協調（document→generation→ingestion→workflow）
  shared/
    domain/
      index.ts                      ← 跨子域共用 domain 概念（Value Object、Policy）
    application/
      index.ts                      ← 跨子域共用 DTO / Port
    config/
      index.ts                      ← 模組設定
    constants/
      index.ts                      ← 模組常數
    errors/
      index.ts                      ← 共用錯誤類型
    events/
      index.ts                      ← 跨子域 Published Language Events
    infrastructure/
      index.ts                      ← 共用 infrastructure 工具
    types/
      index.ts                      ← 共用 TypeScript 型別
    utils/
      index.ts                      ← 共用工具函式
  subdomains/
    document/                       ← 核心子域（完整實作）
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
        use-cases/CreateTemplateUseCase.ts
        use-cases/UpdateTemplateUseCase.ts
        use-cases/DeleteTemplateUseCase.ts
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
    generation/                     ← 生成子域（stub — 展開時填入）
      domain/entities/GeneratedTemplate.ts
      domain/index.ts
      application/index.ts
      adapters/index.ts
    ingestion/                      ← 匯入子域（stub）
      domain/entities/IngestionJob.ts
      domain/index.ts
      application/index.ts
      adapters/index.ts
    workflow/                       ← 流程子域（stub）
      domain/entities/TemplateWorkflow.ts
      domain/index.ts
      application/index.ts
      adapters/index.ts
```

## Barrel 結構（具名匯出原則）

所有 barrel 使用明確的 `export { X }` 與 `export type { X }`，嚴禁 `export *`。

| 檔案 | 覆蓋範圍 |
|---|---|
| `index.ts` | 模組對外唯一公開入口：主要由 `subdomains/document` 重新匯出 |
| `subdomains/document/domain/index.ts` | entities、value-objects、events、repositories、services |
| `subdomains/document/application/index.ts` | use-cases、dto、ports |
| `subdomains/document/adapters/inbound/index.ts` | http + queue adapters |
| `subdomains/document/adapters/outbound/index.ts` | firestore、cache、external-api adapters |
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
2. 全域取代 `Template` → `<YourEntity>`（保留大小寫規律）。
3. 刪除不需要的子域（generation / ingestion / workflow 為 stub，可直接刪）。
4. 依 DDD 開發順序填入業務規則：Domain → Application → Ports → Adapters → Orchestration。
5. 舊平坦層 `domain/` `application/` `adapters/` 確認無人依賴後刪除。
