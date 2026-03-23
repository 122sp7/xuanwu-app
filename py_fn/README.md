# 一、依賴方向（Clean Architecture / DDD）

你的這個分層是標準 **Clean Architecture**，依賴只能往內層。

## 依賴規則（最重要）

```
interface  -> application -> domain
infrastructure -> application -> domain
app -> interface / application / infrastructure
core -> 所有人都可以依賴
domain -> 不能依賴任何外層
```

換句話說：

```
┌─────────────┐
│  interface  │
└──────┬──────┘
       │
┌──────▼──────┐
│ application │
└──────┬──────┘
       │
┌──────▼──────┐
│   domain    │
└─────────────┘

infrastructure → application / domain
app → 負責組裝所有東西
core → 共用工具
```

---

# 二、各層允許依賴表

這個很重要，實務上用這張表就不會亂掉。

| Layer          | 可以依賴                      |
| -------------- | ------------------------- |
| interface      | application, domain, core |
| application    | domain, core              |
| domain         | core                      |
| infrastructure | application, domain, core |
| app            | 全部                        |
| core           | 不依賴任何層                    |

---

# 三、實際 import 範例

### Controller

```
interface/controllers/user_controller.py

from application.use_cases.create_user import CreateUserUseCase
from interface.schemas.user_schema import CreateUserRequest
```

### UseCase

```
application/use_cases/create_user.py

from domain.repositories.user_repository import UserRepository
from domain.entities.user import User
```

### Repository Implementation

```
infrastructure/repositories/firestore_user_repository.py

from domain.repositories.user_repository import UserRepository
from infrastructure.persistence.firestore.client import FirestoreClient
```

### Bootstrap / DI

```
app/container/container.py

from infrastructure.repositories.firestore_user_repository import FirestoreUserRepository
from application.use_cases.create_user import CreateUserUseCase
```

**依賴流向**

```
Controller → UseCase → Domain → Repository Interface
                               ↑
                      Repository Implementation
```

這就是典型 **Ports & Adapters / Hexagonal Architecture**

---

# 四、README.md（幫你整理完整）

以下是一份可以直接放專案的 README.md

````markdown
# py_fn Notes

## Architecture

This project follows Clean Architecture + DDD layering.

```
interface → application → domain
infrastructure → application → domain
app → dependency injection / bootstrap
core → shared utilities
```

### Layer Responsibilities

| Layer | Responsibility |
|------|----------------|
| interface | HTTP / Firebase Functions handlers, controllers, middleware |
| application | Use cases, DTOs, application services |
| domain | Entities, value objects, repository interfaces, domain logic |
| infrastructure | Firestore, Storage, Vector DB, external APIs |
| app | Dependency injection, bootstrap, config |
| core | Shared utilities, constants, exceptions |

### Dependency Rules

- interface can depend on application and domain
- application can depend on domain
- infrastructure can depend on application and domain
- domain must not depend on other layers
- core can be used by all layers
- app wires everything together

---

## Current Runtime

This runtime currently uses Firebase Functions + Upstash Vector/Redis/QStash for the wiki-beta RAG path.

---

## Future: Upstash Workflow

When we move to a workflow-orchestrated pipeline (multi-step, retryable, long-running tasks), install these packages:

```bash
pip install fastapi uvicorn upstash-workflow
```

Use this only when workflow endpoints are actually introduced.

---

## Why Not Install Now

- Keep dependencies minimal (Occam's razor).
- Avoid unused runtime surface in Firebase Functions.
- Add only when workflow serve endpoints are implemented.

---

## High-Level Flow

```
HTTP Request
    ↓
Interface (Controller / Handler)
    ↓
Application (Use Case)
    ↓
Domain (Entity / Logic)
    ↓
Repository Interface
    ↓
Infrastructure (Firestore / Vector / APIs)
```

---

## Folder Structure

```
py_fn/src
├─ app
├─ application
├─ domain
├─ infrastructure
├─ interface
├─ core
```

---

## Design Principles

- Clean Architecture
- Dependency Inversion
- DDD (Domain Driven Design)
- Ports and Adapters
- Minimal Dependencies
- Serverless Friendly
````

---

# 五、最後給你一個超重要觀念

這種架構的核心不是資料夾，而是**依賴方向**：

```
外層可以依賴內層
內層不能依賴外層
Domain 永遠在最中心
```

記住這張圖就不會亂：

```
        interface
           ↓
      application
           ↓
          domain
           ↑
    infrastructure
           
app 負責組裝全部
core 全部共用
```
