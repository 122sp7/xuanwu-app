# Workspace Agent

> Strategic agent documentation: [docs/contexts/workspace/AGENT.md](../../docs/contexts/workspace/AGENT.md)

## Mission

保護 workspace 主域作為協作容器、工作區範疇與 workspaceId 錨點。

## Route Here When

- 問題的中心是 workspaceId、工作區建立封存、工作區內角色與參與關係。
- 問題的中心是工作區共享、存在感、活動流、排程與工作流執行。
- 問題需要提供其他主域運作所需的 workspace scope。

## Route Elsewhere When

- 身份、組織、授權、權益、憑證、通知治理屬於 platform。
- 知識頁面、文章、資料庫、分類、內容發布屬於 notion。
- notebook、conversation、source、retrieval、synthesis 屬於 notebooklm。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Route And Account Contract

- Treat `accountId` as the shell account scope and `workspaceId` as the workspace scope anchor; do not collapse them into one identifier.
- Canonical workspace detail route is `/{accountId}/{workspaceId}`. `/{accountId}/workspace/{workspaceId}` remains legacy redirect-only surface.
- Workspace code-level account type stays `"user" | "organization"`; presentation may say 個人帳號 / 組織帳號, but domain, application, DTO, and query contracts must not drift to `"personal"`.

## Development Order (Strangler Pattern)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration:
1. Find a Use Case to extract
2. Build Domain model for that use case
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter
