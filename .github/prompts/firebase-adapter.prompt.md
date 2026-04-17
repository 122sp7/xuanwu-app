---
name: firebase-adapter
description: 將 Domain Ports 轉成 Firebase 基礎設施實作，生成 repository / gateway adapter，嚴格遵守 Hexagonal Architecture 的 infrastructure 層職責。
applyTo: 'src/modules/**/infrastructure/**/*.{ts,tsx}'
agent: Hexagonal DDD Architect
argument-hint: 提供 Port 介面名稱、所屬模組 / 子域、需對應的 Firebase 服務（Firestore / Auth / Storage / Functions），以及必要的 Firestore 集合路徑或 schema 限制。
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
---

# Firebase Adapter 生成器

## 職責邊界

**負責**
- 將 `domain/repositories/` 或 `domain/ports/` 介面轉成 Firebase 具體實作
- Firestore collection / document 的讀寫映射
- Firebase Auth 狀態轉 domain identity model
- Cloud Storage / Functions 的 gateway adapter
- Zod 驗證 Firestore 原始資料後再轉 domain entity

**不負責**
- business logic（不在 adapter 內決定業務規則）
- domain model 設計（Port 介面已由 domain 定義）
- UI state 管理

## 輸入

- **Port / Repository 介面**：例如 `WorkspaceRepository`、`FileStoragePort`
- **所屬模組與子域**：例如 `src/modules/workspace/subdomains/scheduling`
- **Firebase 服務**：Firestore / Auth / Storage / Functions
- **Collection 路徑**（Firestore）：例如 `organizations/{orgId}/workspaces`
- **Schema 限制**：現有 Firestore schema、tenant isolation 規則

## 工作流程

1. 讀取 `docs/ubiquitous-language.md` 與對應 `docs/contexts/<context>/README.md`，確認命名一致。
2. 讀取 `.github/instructions/architecture-core.instructions.md` 與 `.github/instructions/firestore-schema.instructions.md`，確認層級規則。
3. 確認 Port 介面定義（在 `domain/repositories/` 或 `domain/ports/`）。
4. 在 `src/modules/<context>/[subdomains/<sub>/]infrastructure/` 建立實作檔案：
   - 命名格式：`Firebase<PortName>.ts`（例如 `FirebaseWorkspaceRepository.ts`）
5. 實作原則：
   - Firestore 資料先通過 Zod Schema 驗證後再轉 domain entity
   - `reconstitute()` 用於從快照重建聚合，不呼叫 `create()`
   - 不在 adapter 內含 business rule 或不變數邏輯
   - tenant isolation（`orgId` / `workspaceId`）必須從外部注入，不硬編碼
6. 若需 `firestore.rules` 更新，同步標注；若需新 index，同步更新 `firestore.indexes.json`。
7. 更新對應 `infrastructure/index.ts` barrel export。

## 輸出合約

- Firebase adapter 實作檔案（TypeScript，完整型別）
- Zod schema（Firestore raw document 驗證）
- `infrastructure/index.ts` barrel 更新
- 若有新 index：`firestore.indexes.json` 變更說明
- 若有規則調整：`firestore.rules` 受影響片段

## 驗證

- `npm run lint` — 確認無邊界違規
- `npm run build` — 確認型別一致

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill hexagonal-ddd
