---
description: 'Firestore schema and index design rules aligned to bounded context ownership.'
applyTo: '{src/modules/**/infrastructure/**/*.{ts,tsx,js,jsx},firestore.indexes.json,firestore.rules}'
---

# Firestore Schema

## Rules

- Keep collection ownership explicit per module.
- Version breaking schema transitions with migration steps.
- Update indexes with query-shape changes.

## Validation

- Verify read/write paths remain compatible.
- Confirm index coverage for new query patterns.

## Firebase Layer Hard Rules

The following are CRITICAL violations if violated:

1. **Firebase 只能在 `infrastructure/` adapter 層** — `domain/` 與 `application/` 嚴禁直接 import Firebase SDK
2. **Firestore 必須透過 repository access** — 不允許在 use case 或 route 直接呼叫 `firestore.collection()`
3. **Cloud Functions 不含 domain logic** — `fn/` 函式只負責 I/O 協調；業務規則在 Next.js domain layer
4. **workspace 不直接呼叫 Firestore** — 必須透過 `platform/api` 的 FileAPI / PermissionAPI 等 Service API
5. **Security Rules 必須含 tenant isolation** — `orgId` / `workspaceId` 必須在規則中強制隔離

## Firebase Import 審查清單

- [ ] `src/modules/**/domain/` 無任何 `firebase` import？
- [ ] `src/modules/**/application/` 無任何 `firebase` import？
- [ ] `src/app/` route files 無直接 Firestore / Storage import？
- [ ] Firebase import 集中在 `src/modules/**/infrastructure/` 與 `src/modules/platform/`？
- [ ] Collection 所有權歸屬 bounded context 明確？
- [ ] Breaking schema change 有 migration 步驟？
- [ ] 新 query pattern 有對應 index 更新？

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill xuanwu-development-contracts
