# source — Ubiquitous Language

> **Canonical DDD reference:** `../../docs/ddd/source/ubiquitous-language.md`

本文件是 `source` 的模組就地導覽版本，命名、術語與定義以 `docs/ddd/source/ubiquitous-language.md` 為準。

## 使用規則

- 新增 class / type / variable 前，先對照 canonical 術語
- 跨模組傳遞的公開名詞，必須與 `docs/ddd/source/` 保持一致
- 若術語變更，先更新 `docs/ddd/source/ubiquitous-language.md`，再同步此文件

## Code Anchors

### Entities
- `domain/entities/AuditRecord.ts`
- `domain/entities/File.ts`
- `domain/entities/FileVersion.ts`
- `domain/entities/PermissionSnapshot.ts`
- `domain/entities/RetentionPolicy.ts`
- `domain/entities/wiki-library.types.ts`

### Events
- 目前沒有獨立的 `domain/events/*` 檔案。

### Value Objects
- 目前沒有獨立的 `domain/value-objects/*` 檔案。
