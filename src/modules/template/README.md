# Template Module

`src/modules/template` 是一個可複製的 **Hexagonal Architecture + DDD** 骨架模組，示範標準分層結構與具名匯出規範。

## 目錄結構

```
src/modules/template/
  index.ts                        ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts                      ← domain 聚合 barrel
    entities/
      Template.ts                 ← 聚合根
    value-objects/
      TemplateId.ts
      TemplateName.ts
    events/
      TemplateCreatedEvent.ts
      TemplateUpdatedEvent.ts
    repositories/
      TemplateRepository.ts       ← domain port（介面）
    services/
      TemplateDomainService.ts
  application/
    index.ts                      ← application 聚合 barrel
    use-cases/
      CreateTemplateUseCase.ts
      UpdateTemplateUseCase.ts
      DeleteTemplateUseCase.ts
    dto/
      CreateTemplateDTO.ts
      UpdateTemplateDTO.ts
      TemplateResponseDTO.ts
    ports/
      inbound/
        CreateTemplatePort.ts
      outbound/
        TemplateRepositoryPort.ts  ← domain repository 別名
        CachePort.ts
        ExternalApiPort.ts
  adapters/
    inbound/
      index.ts                     ← inbound 聚合 barrel
      http/
        TemplateController.ts
        routes.ts
      rpc/
        TemplateRpcHandler.ts
      cron/
        TemplateCronJob.ts
      queue/
        TemplateQueueHandler.ts
    outbound/
      index.ts                     ← outbound 聚合 barrel
      firestore/
        FirestoreTemplateRepository.ts
        FirestoreMapper.ts
      cache/
        TemplateCacheAdapter.ts
      external-api/
        TemplateApiClient.ts
```

## Barrel 結構（具名匯出原則）

本模組使用 **5 個 barrel index**，不使用 `export *`：

| 檔案 | 覆蓋範圍 |
|---|---|
| `index.ts` | 模組對外唯一公開入口：domain + application 重要符號 |
| `domain/index.ts` | entities、value-objects、events、repositories、services |
| `application/index.ts` | use-cases、dto、ports/inbound、ports/outbound |
| `adapters/inbound/index.ts` | http、rpc、cron、queue adapters |
| `adapters/outbound/index.ts` | firestore、cache、external-api adapters |

### 具名匯出範例

```ts
// src/modules/template/index.ts
export { Template, TemplateId, TemplateName, TemplateCreatedEvent, TemplateUpdatedEvent, TemplateDomainService } from './domain';
export type { TemplateProps, TemplateRepository } from './domain';
export { CreateTemplateUseCase, UpdateTemplateUseCase, DeleteTemplateUseCase } from './application';
export type { CreateTemplateDTO, UpdateTemplateDTO, TemplateResponseDTO, CreateTemplatePort, TemplateRepositoryPort, CachePort, ExternalApiPort } from './application';
```

所有 source 檔內部 import 使用**直接相對路徑**（例如 `'../../domain/value-objects/TemplateId'`），不依賴任何 barrel index，因此子 barrel 可以自由刪改而不破壞內部參照。

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

- `domain/` 不依賴任何框架或外部技術。
- `application/` 只依賴 `domain/` 抽象，不依賴 adapter 實作。
- adapters 只實作 port，不承載業務規則。

## 如何複製成新模組

1. 複製整個 `src/modules/template/` 資料夾。
2. 全域取代 `Template` → `<YourEntity>`（保留大小寫規律）。
3. 刪除不需要的 adapter（cron / queue / cache / external-api 為可選）。
4. 依 DDD 開發順序填入業務規則：Domain → Application → Ports → Infrastructure → Interface。
