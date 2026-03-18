---
name: plan-file-module-mddd
agent: vsa-mddd-planner
description: Use the canonical file-module architecture plan to implement the MDDD + Hexagonal file bounded context.
argument-hint: "[phase, PR slice, or file-module task]"
---
Use **xuanwu-skill** first.

Treat `modules/file/README.md` as the canonical implementation plan for the file domain.

When the task concerns file management, account/workspace/organization boundaries, file permissions,
retention, versioning, upload/download lifecycle, or migration away from workspace-derived file signals:

1. read `modules/file/README.md`
2. keep dependency direction strict: `UI -> Application -> Domain <- Infrastructure`
3. do not import `WorkspaceOperationalSignals` into file UI or file domain
4. integrate with account / workspace / organization / audit / notification only through file-module ports
5. execute the smallest architecture-safe slice first:
   - phase 1: read-side decoupling and module skeleton
   - phase 2: canonical Firestore model + upload/download lifecycle
   - phase 3: governance / retention / archive / restore / organization aggregation
6. finish with `npm run lint` and `npm run build`
