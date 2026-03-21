---
title: Namespace Core development guide
description: Developer guide for contributing to namespace-core — registering namespaces, implementing adapters, slug policy, and testing patterns.
---

# Namespace Core 開發指南

> **文件版本**：v1.0.0
> **最後更新**：2026-03-20
> **目標讀者**：參與 `modules/namespace` 實作或在模組中使用命名空間功能的工程師

---

## 前置閱讀

開始任何 Namespace Core 相關實作前，請先閱讀：

1. **架構規範**：`docs/architecture/namespace.md`
2. **開發契約**：`docs/reference/development-contracts/namespace-contract.md`
3. **整體架構指南**：`ARCHITECTURE.md`

---

## 1. 模組結構

```
modules/namespace/
├── domain/
│   ├── entities/
│   │   └── namespace.entity.ts              # Namespace class
│   ├── repositories/
│   │   └── inamespace.repository.ts         # INamespaceRepository port
│   ├── services/
│   │   └── slug-policy.ts                   # deriveSlugCandidate, isValidSlug（純函式）
│   └── value-objects/
│       └── namespace-slug.vo.ts             # NamespaceSlug
├── application/
│   └── use-cases/
│       ├── register-namespace.use-case.ts   # RegisterNamespaceUseCase
│       └── resolve-namespace.use-case.ts    # ResolveNamespaceUseCase
├── infrastructure/
│   ├── persistence/
│   │   └── config.ts                       # NAMESPACE_CORE_CONFIG
│   └── repositories/
│       └── in-memory-namespace.repository.ts
├── interfaces/
│   └── api/
│       └── namespace.controller.ts         # NamespaceController
└── index.ts
```

### 依賴方向（嚴格）

```
interfaces (api / controller)
    ↓
application (use-cases)
    ↓
domain (entities / repositories / services / value-objects)
    ↑
infrastructure (adapters)
```

---

## 2. 從模組建立命名空間

當 organization 或 workspace 被建立時，應同步呼叫 `RegisterNamespaceUseCase`：

```typescript
// modules/organization/application/use-cases/create-organization.use-case.ts
import { RegisterNamespaceUseCase, deriveSlugCandidate } from '@/modules/namespace'
import type { IOrganizationRepository } from '../domain/repositories/iorganization.repository'
import type { INamespaceRepository } from '@/modules/namespace'

export class CreateOrganizationUseCase {
  constructor(
    private readonly orgRepo: IOrganizationRepository,
    private readonly namespaceRepo: INamespaceRepository,
  ) {}

  async execute(dto: { id: string; displayName: string; ownerAccountId: string }) {
    // 1. 建立組織實體
    const org = new Organization(dto.id, dto.displayName, dto.ownerAccountId, new Date())
    await this.orgRepo.save(org)

    // 2. 推導並註冊命名空間 slug
    const slugCandidate = deriveSlugCandidate(dto.displayName)
    const registerNamespace = new RegisterNamespaceUseCase(this.namespaceRepo)
    await registerNamespace.execute({
      id:             crypto.randomUUID(),
      slug:           slugCandidate,
      kind:           'organization',
      ownerAccountId: dto.ownerAccountId,
      organizationId: dto.id,
    })
  }
}
```

---

## 3. Slug 推導與驗證

使用 slug-policy 純函式處理 slug 邏輯：

```typescript
import { deriveSlugCandidate, isValidSlug, NamespaceSlug } from '@/modules/namespace'

// 推導候選值
const candidate = deriveSlugCandidate('My Organization 2024!')
// → 'my-organization-2024'

// 快速驗證格式
if (!isValidSlug(candidate)) {
  throw new Error('Derived slug is invalid')
}

// 建立 VO（更嚴格的驗證，含 length 檢查）
const slug = NamespaceSlug.create(candidate)
console.log(slug.value) // → 'my-organization-2024'
```

---

## 4. 解析 Slug → Namespace

```typescript
import { ResolveNamespaceUseCase } from '@/modules/namespace'

const resolveNamespace = new ResolveNamespaceUseCase(namespaceRepo)

const namespace = await resolveNamespace.execute({
  slug: 'my-organization-2024',
  kind: 'organization',
})

if (!namespace) {
  // 404 — slug 不存在
}
```

---

## 5. 實作 Firestore Adapter

```typescript
// modules/organization/infrastructure/firebase/FirebaseNamespaceRepository.ts
import type { INamespaceRepository } from '@/modules/namespace'
import { Namespace, NamespaceSlug } from '@/modules/namespace'
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { NAMESPACE_CORE_CONFIG } from '@/modules/namespace/infrastructure/persistence/config'

export class FirebaseNamespaceRepository implements INamespaceRepository {
  private readonly db = getFirestore()
  private readonly col = collection(this.db, NAMESPACE_CORE_CONFIG.STORE.COLLECTION)

  async save(namespace: Namespace): Promise<void> {
    await setDoc(doc(this.col, namespace.id), {
      id:             namespace.id,
      slug:           namespace.slug.value,
      kind:           namespace.kind,
      ownerAccountId: namespace.ownerAccountId,
      organizationId: namespace.organizationId,
      status:         namespace.status,
      createdAt:      namespace.createdAt.toISOString(),
      updatedAt:      namespace.updatedAt.toISOString(),
    })
  }

  async findBySlug(slug: string, kind: string): Promise<Namespace | null> {
    const q = query(this.col, where('slug', '==', slug), where('kind', '==', kind))
    const snaps = await getDocs(q)
    if (snaps.empty) return null
    return this.toDomain(snaps.docs[0].data())
  }

  async existsBySlug(slug: string, kind: string): Promise<boolean> {
    const q = query(this.col, where('slug', '==', slug), where('kind', '==', kind))
    const snaps = await getDocs(q)
    return !snaps.empty
  }

  // ... implement remaining methods

  private toDomain(data: Record<string, unknown>): Namespace {
    return new Namespace(
      data.id as string,
      NamespaceSlug.create(data.slug as string),
      data.kind as 'organization' | 'workspace',
      data.ownerAccountId as string,
      data.organizationId as string,
      data.status as 'active' | 'suspended' | 'archived',
      new Date(data.createdAt as string),
      new Date(data.updatedAt as string),
    )
  }
}
```

---

## 6. 測試模式

```typescript
import {
  InMemoryNamespaceRepository,
  RegisterNamespaceUseCase,
  ResolveNamespaceUseCase,
  deriveSlugCandidate,
} from '@/modules/namespace'

describe('RegisterNamespaceUseCase', () => {
  it('registers a new namespace', async () => {
    const repo = new InMemoryNamespaceRepository()
    const useCase = new RegisterNamespaceUseCase(repo)

    const ns = await useCase.execute({
      id:             'ns_001',
      slug:           deriveSlugCandidate('My Org'),
      kind:           'organization',
      ownerAccountId: 'acc_001',
      organizationId: 'org_001',
    })

    expect(ns.slug.value).toBe('my-org')
    expect(ns.status).toBe('active')
  })

  it('throws on slug collision', async () => {
    const repo = new InMemoryNamespaceRepository()
    const useCase = new RegisterNamespaceUseCase(repo)

    await useCase.execute({ id: 'ns_001', slug: 'my-org', kind: 'organization', ownerAccountId: 'acc_001', organizationId: 'org_001' })

    await expect(
      useCase.execute({ id: 'ns_002', slug: 'my-org', kind: 'organization', ownerAccountId: 'acc_002', organizationId: 'org_002' }),
    ).rejects.toThrow('already taken')
  })
})
```

---

## 7. 驗證指令

```bash
npm run lint
npm run build
```
