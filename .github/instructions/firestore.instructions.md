---
name: Xuanwu Firestore Rules
description: Apply these rules when editing Firestore rules, indexes, and Firestore-backed repository code.
applyTo: "firestore.rules,firestore.indexes.json,**/*firestore*.ts,infrastructure/firebase/**/*.ts,lib/firebase/**/*.ts,modules/**/infrastructure/**/*.ts"
---
# Firestore rules

- Treat Firestore as an infrastructure concern; repository code should implement ports instead of leaking SDK details upward.
- Keep collection names, document shapes, and indexes aligned with the owning module boundaries.
- When changing security rules, verify tenant, account, and organization access paths explicitly.
- Prefer converter or mapper layers for persistence DTOs rather than binding UI or domain models directly to Firestore documents.
- Document any required index or rules deployment step alongside code changes that depend on them.
